const { hostname } = require('os');

module.exports = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'xivapi.com' }],
  },
};
