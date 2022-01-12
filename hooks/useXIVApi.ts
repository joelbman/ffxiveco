import axios from 'axios';

const useXIVApi = () => {
  const searchItem = async (keyword: string) => {
    return axios.post('https://xivapi.com/search', {
      indexes: 'item',
      body: {
        query: {
          bool: {
            must: [
              {
                wildcard: {
                  NameCombined_en: '*' + keyword + '*',
                },
              },
            ],
            filter: [
              {
                range: {
                  IsUntradable: {
                    lt: '1',
                  },
                },
              },
            ],
          },
        },
        from: 0,
        size: 10,
        sort: [
          {
            LevelItem: 'desc',
          },
        ],
      },
    });
  };

  const getRecipe = async (id: string) => {
    return axios.get('https://xivapi.com/recipe/' + id);
  };

  const getItem = async (id: string) => {
    return axios.get('https://xivapi.com/item/' + id);
  };

  return { searchItem, getRecipe, getItem };
};

export default useXIVApi;
