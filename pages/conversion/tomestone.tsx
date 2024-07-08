import React, { useContext, useEffect, useState } from 'react';
import CurrencyTable from '../../components/CurrencyTable';
import Error from '../../components/Error';
import Layout from '../../components/Layout';
import Loader from '../../components/Loader';
import ItemIcon from '../../components/icons/ItemIcon';
import { WorldContext } from '../../context/WorldContext';
import tomestoneData from '../../data/tomestone.json';
import useUniversalis from '../../hooks/useUniversalis';

const Tomestone = () => {
  const { world } = useContext(WorldContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { getCurrencyRatios } = useUniversalis(world);
  const [data, setData] = useState<any>();

  useEffect(() => {
    if (!world) {
      return;
    }

    // const fetchData = async () => {
    //   setLoading(true);
    //   setError(false);

    //   try {
    //     const items = await getCurrencyRatios(tomestoneData.Aphorism.items);
    //     setData(items);
    //     setError(false);
    //   } catch (e) {
    //     setError(true);
    //   }

    //   setLoading(false);
    // };

    // fetchData();

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
      Dawntrail update coming soon.
      {/* <h2 className="flex">
        <ItemIcon
          className="mr-2"
          iconId={tomestoneData.Aphorism.iconId}
          name={tomestoneData.Aphorism.name}
        />
        Aphorism
      </h2>
      <CurrencyTable
        data={data}
        iconId={tomestoneData.Aphorism.iconId}
        name={tomestoneData.Aphorism.name}
      /> */}
    </Layout>
  );
};

export default Tomestone;
