import React, { useContext, useEffect, useState } from 'react';
import CurrencyTable from '../../components/CurrencyTable';
import Error from '../../components/Error';
import Layout from '../../components/Layout';
import Loader from '../../components/Loader';
import ItemIcon from '../../components/icons/ItemIcon';
import { WorldContext } from '../../context/WorldContext';
import scripData from '../../data/crafterScrips.json';
import useUniversalis from '../../hooks/useUniversalis';

const Crafter = () => {
  const { world } = useContext(WorldContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { getCurrencyRatios } = useUniversalis(world);
  const [purpleScripData, setPurpleScripData] = useState<any>();

  useEffect(() => {
    if (!world) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(false);

      try {
        const itemsP = await getCurrencyRatios(scripData.purple.items);
        setPurpleScripData(itemsP);
        setError(false);
      } catch (e) {
        setError(true);
      }

      setLoading(false);
    };

    fetchData();

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
      <h1>Crafter&apos;s scrip conversion rates</h1>

      <div>
        <h2 className="flex mb-0">
          <ItemIcon
            className="mr-2"
            iconId={scripData.purple.iconId}
            name="Purple Crafter's Scrip"
          />
          Purple scrips
        </h2>
        <CurrencyTable
          data={purpleScripData}
          iconId={scripData.purple.iconId}
          name="Purple Crafter's Scrip"
        />
      </div>
    </Layout>
  );
};

export default Crafter;
