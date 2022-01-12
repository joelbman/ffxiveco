import React, { useContext, useEffect, useState } from 'react';
import Error from '../../components/Error';
import Layout from '../../components/Layout';
import Loader from '../../components/Loader';
import GilIcon from '../../components/icons/GilIcon';
import ItemIcon from '../../components/icons/ItemIcon';
import { WorldContext } from '../../context/WorldContext';
import tomestoneData from '../../data/tomestone.json';
import useUniversalis from '../../hooks/useUniversalis';
import { getRelativeTime } from '../../util/relativeTime';

const Tomestone = () => {
  const { world } = useContext(WorldContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { getItemPrices, getAveragePrice } = useUniversalis(world);
  const [data, setData] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);

      try {
        const items = tomestoneData.Aphorism;
        const res = await getItemPrices(items.map((i) => i.id.toString()));
        setData(
          items
            .map((i) => {
              const item = res.data.items.find((it: any) => it.itemID === i.id);
              item.avgPrice = getAveragePrice(item?.listings);
              return {
                ...i,
                updated: getRelativeTime(item.lastUploadTime),
                gilRatio: item.avgPrice / i.cost,
                avgPrice: item.avgPrice,
              };
            })
            .sort((a, b) => b.gilRatio - a.gilRatio)
        );
        setError(false);
      } catch (e) {
        setError(true);
      }

      setLoading(false);
    };

    if (window) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [world]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Error>
        <h1>Error</h1>
        <p>Error retrieving data.</p>
      </Error>
    );
  }

  return (
    <Layout>
      <h1>Tomestone conversion rates</h1>

      <h2>Aphorism</h2>
      <table className="w-full mt-8" style={{ maxWidth: '1024px' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Cost</th>
            <th>Average price</th>
            <th>Currency/gil ratio</th>
            <th>Last update</th>
          </tr>
        </thead>
        <tbody>
          {data.map((i: any) => (
            <tr key={i.id}>
              <td>{i.name}</td>
              <td>{i.cost}</td>
              <td>
                {i.avgPrice} <GilIcon />
              </td>
              <td>{i.gilRatio.toFixed(2)}</td>
              <td>{i.updated}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <i className="block mt-6 text-sm">TODO: Item icons</i>
    </Layout>
  );
};

export default Tomestone;
