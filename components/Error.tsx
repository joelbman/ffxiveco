import Layout from './Layout';

interface Props {
  children: React.ReactNode;
}

const Error = ({ children }: Props) => {
  return <Layout>{children}</Layout>;
};

export default Error;
