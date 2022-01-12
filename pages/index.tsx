import Layout from '../components/Layout';

const Home = () => {
  return (
    <Layout>
      <h1>FFXIV Economy tools</h1>

      <p>Site is currently under development, only Chaos datacenter realms are supported. </p>

      <p>
        If you find any bugs or have any suggestions just yell at me on Discord or open an issue on{' '}
        <a href="https://github.com/joelbman/ffxiv-pc-tools/" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </p>

      <div className="my-8">
        <h2>Crafting profits</h2>
        <p>Select your world & search a craftable item by name.</p>
      </div>

      <h2>Coming Soon ™️</h2>
      <ul className="list-disc pl-8">
        <li>White & Purple scrips gil currency conversion (Materias vs reagents etc.)</li>
      </ul>
    </Layout>
  );
};

export default Home;
