import { InfinitySpin } from 'react-loader-spinner';
import Layout from './Layout';

const Loader = () => {
  return (
    <Layout>
      <figure
        className="flex items-center justify-center overflow-hidden"
        style={{ minHeight: '80vh' }}
      >
        <InfinitySpin width="200" color="#fff" />
      </figure>
    </Layout>
  );
};

export default Loader;
