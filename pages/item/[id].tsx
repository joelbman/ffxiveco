import { useRouter } from 'next/dist/client/router';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import Error from '../../components/Error';
import Layout from '../../components/Layout';
import Loader from '../../components/Loader';
import GilIcon from '../../components/icons/GilIcon';
import { WorldContext } from '../../context/WorldContext';
import useUniversalis, { CraftMaterial } from '../../hooks/useUniversalis';
import { toast } from 'react-toastify';
import Head from 'next/head';

interface Item {
  craftQuantity: number;
  craftingCost: number;
  profitHQ: number;
  profitNQ: number;
  avgPriceHQ: number;
  avgPriceNQ: number;
  materialsError?: boolean;
}

interface TabContentProps {
  item: Item;
  hq?: boolean;
}

const TabContent = ({ item, hq }: TabContentProps) => (
  <>
    {item.craftQuantity > 1 && <div>Items produced per craft: {item.craftQuantity}</div>}
    {item.craftingCost > 0 && (
      <div className="flex items-center">
        Total material cost per craft: {item.craftingCost} <GilIcon />
      </div>
    )}

    <div className="flex items-center">
      Average unit price: {hq ? item.avgPriceHQ : item.avgPriceNQ} <GilIcon />
    </div>

    {item.profitHQ || item.profitNQ ? (
      <div className="flex items-center text-xl mt-4">
        {item.materialsError ? (
          <div>Profit/Loss per craft: N/A</div>
        ) : (
          <div className="flex items-center">
            <span className="mr-2">Profit/Loss per craft:</span>
            {hq && (
              <span className={item.profitHQ > 0 ? 'text-green-500' : 'text-red-500'}>
                {item.profitHQ}
              </span>
            )}
            {!hq && (
              <span className={item.profitNQ > 0 ? 'text-green-500' : 'text-red-500'}>
                {item.profitNQ}
              </span>
            )}
            <GilIcon />
          </div>
        )}
      </div>
    ) : (
      <div className="mt-6 italic">More details on non-craftable items coming soon.</div>
    )}
  </>
);

const ItemDetail = () => {
  const router = useRouter();
  const { world } = useContext(WorldContext);
  const [item, setItem] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { getCraftingCost } = useUniversalis(world);
  const { id } = router.query;

  useEffect(() => {
    if (!world) {
      return;
    }

    const fetchData = async (itemId: string) => {
      setLoading(true);
      setError(false);

      const data = await getCraftingCost(itemId);

      if (data.name && (data.avgPriceHQ || data.avgPriceNQ)) {
        setItem(data);
      } else {
        setError(true);
      }

      toast('test');

      setLoading(false);
    };

    if (id !== undefined) {
      fetchData(id as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, world]);

  if (loading) {
    return <Loader />;
  }

  if (error || !item) {
    return (
      <Error>
        <h1>Error</h1>
        <p>
          Item data not found. Maybe the item is not marketable? Universalis API might also be under
          heavy load, in that case try again in a few minutes.
        </p>
      </Error>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{item.name ? item.name + ' - ' : ''}FFXIV Eco</title>
      </Head>

      <header className="flex items-center mb-8">
        <Image src={`https://xivapi.com/${item.icon}`} alt={item.name} height="64" width="64" />
        <h1 className="ml-4 mb-0">
          {item.name}

          {item.updated && (
            <small>
              <i>Updated: {item.updated}</i>
            </small>
          )}
        </h1>
      </header>

      <Tabs style={{ maxWidth: '1024px' }}>
        <TabList>
          {item.avgPriceHQ > 0 && <Tab>HQ</Tab>}
          {item.avgPriceNQ > 0 && <Tab>NQ</Tab>}
        </TabList>

        {item.avgPriceHQ > 0 && (
          <TabPanel>
            <TabContent item={item} hq />
          </TabPanel>
        )}
        {item.avgPriceNQ > 0 && (
          <TabPanel>
            <TabContent item={item} />
          </TabPanel>
        )}
      </Tabs>

      {item.materialsError && (
        <p className="mt-8">
          Could not receive material prices. Universalis API might be under heavy load, try again in
          a few minutes.
        </p>
      )}

      {item.materials.length > 0 && !item.materialsError && (
        <div>
          <h2 className="mt-8">Materials</h2>

          <p>
            Material average costs are calculated from the 5 cheapest listings, quality is ignored.
          </p>

          <table className="w-full mt-8" style={{ maxWidth: '1024px' }}>
            <thead>
              <tr>
                <th className="w-12"></th>
                <th>Name</th>
                <th>Amount</th>
                <th>Average PPU</th>
                <th>Average total</th>
                <th>Last update</th>
              </tr>
            </thead>
            <tbody>
              {item.materials.map((m: CraftMaterial) => (
                <tr key={m.id}>
                  <td className="w-12">
                    <Link
                      href={`/item/${m.id}`}
                      passHref
                      className="flex items-center justify-center"
                    >
                      <Image
                        src={`https://xivapi.com/${m.iconUrl}`}
                        width="36"
                        height="36"
                        alt={m.name}
                      />
                    </Link>
                  </td>
                  <td>
                    <Link href={`/item/${m.id}`} passHref className="flex items-center">
                      {m.name}
                    </Link>
                  </td>
                  <td>{m.amount}</td>
                  <td>
                    {m.avgPrice ? (
                      <div className="flex items-center">
                        {m.avgPrice}
                        <GilIcon />
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    {m.avgTotalPrice ? (
                      <div className="flex items-center">
                        {m.avgTotalPrice}
                        <GilIcon />
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>{m.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default ItemDetail;
