import React, { useContext, useEffect, useState } from 'react';
import CurrencyTable from '../../components/CurrencyTable';
import Error from '../../components/Error';
import Layout from '../../components/Layout';
import Loader from '../../components/Loader';
import ItemIcon from '../../components/icons/ItemIcon';
import { WorldContext } from '../../context/WorldContext';
import scripData from '../../data/gathererScrips.json';
import useUniversalis from '../../hooks/useUniversalis';

const Gatherer = () => {
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
        console.log(e);
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
      <h1>Gatherer&apos;s scrip conversion rates</h1>

      <p className="mb-8" style={{ maxWidth: '640px' }}>
        Fishing bait are not included as they update very infrequently on the Universalis API. They
        can be worth investing in to but it&apos;s better to check the current prices in-game.
      </p>

      <div>
        <h2 className="flex">
          <ItemIcon
            className="mr-2"
            iconId={scripData.purple.iconId}
            name="Purple Gatherer's Scrip"
          />
          Purple scrips
        </h2>

        <h3>Materia & Materials</h3>
        <CurrencyTable
          data={purpleScripData}
          iconId={scripData.purple.iconId}
          name="Purple Gatherer's Scrip"
        />

        {/* <h3>Fishing bait</h3>
        <CurrencyTable
          data={purpleScripData}
          bait
          iconId={scripData.purple.iconId}
          name="Purple Gatherer's Scrip"
        /> */}
      </div>
    </Layout>
  );
};

export default Gatherer;
