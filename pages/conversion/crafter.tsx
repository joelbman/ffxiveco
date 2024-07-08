import React, { useContext, useEffect, useState } from 'react';
import Error from '../../components/Error';
import Layout from '../../components/Layout';
import Loader from '../../components/Loader';
import { WorldContext } from '../../context/WorldContext';
import scripData from '../../data/crafterScrips.json';
import useUniversalis from '../../hooks/useUniversalis';
import ScripSection from '../../components/ScripSection';

const Crafter = () => {
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
        <p>Error retrieving data.</p>
      </Error>
    );
  }

  return (
    <Layout>
      <h1>Crafter&apos;s scrip conversion rates</h1>

      {orangeScripData ? (
        <ScripSection data={orangeScripData} name="Orange Crafter's Scrip" type="crafter" />
      ) : (
        <p>Failed to load Orange Scrip data - Universalis API might be under heavy load</p>
      )}

      {purpleScripData ? (
        <ScripSection data={purpleScripData} name="Purple Crafter's Scrip" type="crafter" />
      ) : (
        <p>Failed to load Purple Scrip data - Universalis API might be under heavy load</p>
      )}
    </Layout>
  );
};

export default Crafter;
