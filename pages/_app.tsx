import '../styles/globals.css';
import 'react-tabs/style/react-tabs.css';

import { useEffect, useState } from 'react';
import { WorldContext } from '../context/WorldContext';

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
    </WorldContext.Provider>
  );
};

export default App;
