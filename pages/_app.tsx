import '../styles/globals.css';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.min.css';

import { useEffect, useState } from 'react';
import { WorldContext } from '../context/WorldContext';
import { ToastContainer } from 'react-toastify';
import useStorage from '../hooks/useStorage';

export const validateContinent = (c: string | undefined | null) =>
  c === 'EU' || c === 'NA' ? c : 'EU';

const App = ({ Component, pageProps }: any) => {
  const storage = useStorage();

  const [world, setWorld] = useState<string>('Spriggan');
  const [continent, setContinent] = useState<'EU' | 'NA'>('EU');

  useEffect(() => {
    setContinent(validateContinent(storage.getItem('continent')));
    setWorld(storage.getItem('world') || 'Cerberus');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WorldContext.Provider
      value={{ world, updateWorld: setWorld, continent, updateContinent: setContinent }}
    >
      <Component {...pageProps} />
      <ToastContainer
        containerId={'toastcontainer'}
        className={
          'relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer'
        }
        position="bottom-center"
        closeOnClick
      />
    </WorldContext.Provider>
  );
};

export default App;
