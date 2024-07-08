import React, { useContext, useEffect, useState } from 'react';
import CurrencyTable from '../../components/CurrencyTable';
import Error from '../../components/Error';
import Layout from '../../components/Layout';
import Loader from '../../components/Loader';
import ItemIcon from '../../components/icons/ItemIcon';
import { WorldContext } from '../../context/WorldContext';
import scripData from '../../data/gathererScrips.json';
import useUniversalis from '../../hooks/useUniversalis';
import ScripSection from '../../components/ScripSection';

const Gatherer = () => {
  const { world } = useContext(WorldContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { getCurrencyRatios } = useUniversalis(world);
  const [purpleScripData, setPurpleScripData] = useState<any>();
  const [orangeScripData, setOrangeScripData] = useState<any>();

  useEffect(() => {
    if (!world) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(false);

      const [purpleReq, orangeReq] = await Promise.allSettled([
        getCurrencyRatios(scripData.purple.items),
        getCurrencyRatios(scripData.orange.items),
      ]);

      if (orangeReq.status === 'fulfilled') {
        setOrangeScripData(orangeReq.value);
      }
      if (purpleReq.status === 'fulfilled') {
        setPurpleScripData(purpleReq.value);
      }

      if (orangeReq.status === 'rejected' && purpleReq.status === 'rejected') {
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
        <p>Error retrieving data. Try again a bit later.</p>
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

      {orangeScripData ? (
        <ScripSection data={orangeScripData} name="Orange Gatherer's Scrip" type="gatherer" />
      ) : (
        <p>Failed to load Orange Scrip data - Universalis API might be under heavy load</p>
      )}

      {purpleScripData ? (
        <ScripSection data={purpleScripData} name="Purple Gatherer's Scrip" type="gatherer" />
      ) : (
        <p>Failed to load Purple Scrip data - Universalis API might be under heavy load</p>
      )}
    </Layout>
  );
};

export default Gatherer;
