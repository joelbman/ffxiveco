import Layout from '../components/Layout';

const Home = () => {
  return (
    <Layout>
      <h1>FFXIV Economy tools</h1>

      <p>
        Quickstart: Pick your region and world from the top-right and search a craftable item by
        name to calculate the profit/loss.
      </p>

      <p>
        If you find any bugs or have any suggestions just yell at me on Discord (@so0le) or open an
        issue on{' '}
        <a href="https://github.com/joelbman/ffxiveco/" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </p>

      <div className="my-8">
        <h2>Crafting profits</h2>
        <p>
          Select your world & search a craftable item by name. I&apos;ll look in to adding more
          information on the item view later on, especially for non-craftable items.
        </p>
      </div>

      <h2>Possibly Coming Soon ™️</h2>
      <ul className="list-disc pl-8">
        <li>Skybuilder&apos;s scrip conversion rates</li>
        <li>Gemstone conversion rates</li>
      </ul>
    </Layout>
  );
};

export default Home;
