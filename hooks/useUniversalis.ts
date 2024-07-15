import axios from 'axios';
import { getRelativeTime } from '../util/relativeTime';
import useXIVApi from './useXIVApi';
import { toast } from 'react-toastify';

export interface CraftMaterial {
  id: number;
  name: string;
  updated?: string;
  iconUrl: string;
  amount: number;
  avgPrice: number;
  avgTotalPrice: number;
}

interface RequestParams {
  hq?: boolean;
  listings?: number;
}

interface Listing {
  pricePerUnit: number;
  [key: string]: unknown;
}

interface CurrencyItem {
  cost: number;
  id: number;
  name: string;
}

const getAveragePrice = (listings: Listing[]) => {
  if (!listings) {
    return 0;
  }
  const sum = listings.reduce((a: number, b: Listing) => a + b['pricePerUnit'], 0);
  return Math.round(sum / listings.length);
};

const useUniversalis = (world: string) => {
  const { getRecipe, getItem } = useXIVApi();

  const getItemPrices = async (itemIds: string | string[], params?: RequestParams) => {
    let hqStr = '';
    if (params?.hq !== undefined) {
      hqStr += params.hq ? '&hq=true' : '&hq=false';
    }

    return axios
      .get(
        `https://universalis.app/api/v2/${world}/${
          typeof itemIds === 'string' ? itemIds : itemIds.join(',')
        }?listings=${params?.listings ? params.listings : 5}${hqStr}`
      )
      .catch((e) => {
        if (axios.isAxiosError(e) && e.response?.status === 504) {
          toast.error('Universalis API request timed out - try again in a bit');
        }
        return null;
      });
  };

  const getCraftingCost = async (id: string) => {
    const formattedResponse = {
      name: '',
      icon: '',
      updated: '',
      avgPriceNQ: 0,
      avgPriceHQ: 0,
      profitNQ: 0,
      profitHQ: 0,
      craftQuantity: 0,
      craftingCost: 0,
      materials: [] as CraftMaterial[],
      materialsError: false,
    };

    const [universalisNQ, universalisHQ, xivreq] = await Promise.allSettled([
      getItemPrices(id, { hq: false, listings: 3 }),
      getItemPrices(id, { hq: true, listings: 3 }),
      getItem(id),
    ]);

    if (xivreq.status === 'fulfilled') {
      formattedResponse.name = xivreq.value.data.Name;
      formattedResponse.icon = xivreq.value.data.IconHD;
    }

    if (universalisHQ.status === 'fulfilled') {
      formattedResponse.avgPriceHQ = getAveragePrice(universalisHQ.value?.data.listings);
    } else {
      toast.error('HQ price request failed - Universalis might be under heavy load');
    }

    if (universalisNQ.status === 'fulfilled') {
      formattedResponse.avgPriceNQ = getAveragePrice(universalisNQ.value?.data.listings);
      formattedResponse.updated = getRelativeTime(universalisNQ.value?.data.lastUploadTime) || '';
    } else {
      toast.error('NQ price request failed - Universalis might be under heavy load');
    }

    // If searched item is craftable look for material prices
    if (xivreq.status === 'fulfilled' && xivreq.value.data.GameContentLinks?.Recipe?.ItemResult) {
      const recipeId = xivreq.value.data.GameContentLinks.Recipe.ItemResult[0];

      if (recipeId) {
        const recipeReq = await getRecipe(recipeId);
        const materialIds: string[] = [];

        for (let i = 0; i < 10; i++) {
          const materialId = recipeReq.data['ItemIngredient' + i + 'TargetID'];
          if (materialId) {
            formattedResponse.materials.push({
              id: materialId,
              name: recipeReq.data[`ItemIngredient${i}`]?.Name,
              iconUrl: recipeReq.data[`ItemIngredient${i}`]?.Icon,
              amount: recipeReq.data['AmountIngredient' + i],
              updated: '',
              avgPrice: 0,
              avgTotalPrice: 0,
            });

            materialIds.push(materialId);
          }
        }

        formattedResponse.craftQuantity = recipeReq.data.AmountResult;

        const materialPrices = await getItemPrices(materialIds, { listings: 3 });

        if (materialPrices?.data.items) {
          formattedResponse.materials = Object.values(materialPrices?.data.items).map(
            (material: any) => {
              const matIndex = formattedResponse.materials.findIndex(
                (m) => m.id === material.itemID
              );
              const avgPrice = getAveragePrice(material.listings);

              return {
                ...formattedResponse.materials[matIndex],
                avgPrice,
                updated: getRelativeTime(material.lastUploadTime),
                avgTotalPrice: Math.round(avgPrice * formattedResponse.materials[matIndex].amount),
              };
            }
          );

          formattedResponse.craftingCost = formattedResponse.materials.reduce(
            (a, b) => a + b['avgTotalPrice'],
            0
          );
        } else {
          formattedResponse.materialsError = true;
        }

        formattedResponse.profitNQ = Math.round(
          formattedResponse.avgPriceNQ * formattedResponse.craftQuantity -
            formattedResponse.craftingCost
        );
        formattedResponse.profitHQ = Math.round(
          formattedResponse.avgPriceHQ * formattedResponse.craftQuantity -
            formattedResponse.craftingCost
        );
      }
    }

    return formattedResponse;
  };

  const getCurrencyRatios = async (items: CurrencyItem[]) => {
    const res = await getItemPrices(
      items.map((i) => i.id.toString()),
      { listings: 5 }
    );
    return items
      .map((i) => {
        const item = Object.values(res?.data.items).find((it: any) => it.itemID === i.id) as Record<
          string,
          any
        >;
        item.avgPrice = getAveragePrice(item?.listings);
        return {
          ...i,
          updated: getRelativeTime(item.lastUploadTime),
          gilRatio: item.avgPrice ? item.avgPrice / i.cost : 0,
          avgPrice: item.avgPrice || '-',
        };
      })
      .sort((a, b) => b.gilRatio - a.gilRatio);
  };

  return { getItemPrices, getCraftingCost, getAveragePrice, getCurrencyRatios };
};

export default useUniversalis;
