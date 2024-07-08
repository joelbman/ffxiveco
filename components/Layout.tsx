import Head from 'next/head';
import Footer from './Footer';
import NavBar from './NavBar';
import { toast } from 'react-toastify';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  toast('test');

  return (
    <div>
      <Head>
        <title>FFXIV Eco</title>
        <meta
          name="description"
          content="FFXIV Economy tools - crafting profits, tomestone/scrip item to gil ratios etc."
        />
      </Head>

      <NavBar />

      <main className="mt-20 px-8 pb-20 flex flex-col items-center" style={{ minHeight: '90vh' }}>
        <div className="container">{children}</div>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
