import Layout from '../components/Layout';

const Home = () => {
  return (
    <Layout>
      <h1>FFXIV Economy tools</h1>

      <p>
        Site is currently under development, only Chaos & Light datacenter worlds are supported.
      </p>

      <p>
        If you find any bugs or have any suggestions just yell at me on Discord (so0le#5155) or open
        an issue on{' '}
        <a href="https://github.com/joelbman/ffxiv-pc-tools/" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </p>

      <div className="my-8">
        <h2>Crafting profits</h2>
        <p>
          Select your world & search a craftable item by name. Will be adding more information on
          the item view later on, especially for non-craftable items.
        </p>
      </div>

      <h2>Coming Soon ™️</h2>
      <ul className="list-disc pl-8">
        <li>Skybuilder&apos;s scrip conversion rates</li>
      </ul>
    </Layout>
  );
};

export default Home;
