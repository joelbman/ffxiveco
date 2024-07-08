import '../styles/globals.css';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.min.css';

import { useEffect, useState } from 'react';
import { WorldContext } from '../context/WorldContext';
import { ToastContainer } from 'react-toastify';

const App = ({ Component, pageProps }: any) => {
  const [world, setWorld] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    setWorld(localStorage.getItem('world') || 'Spriggan');
  }, []);

  return (
    <WorldContext.Provider value={{ world, updateWorld: setWorld }}>
      <Component {...pageProps} />
      <ToastContainer containerId={'toastcontainer'} position="bottom-center" closeOnClick />
    </WorldContext.Provider>
  );
};

export default App;
