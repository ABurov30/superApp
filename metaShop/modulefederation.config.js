const deps = require('./package.json').dependencies;

console.log(process.env.ROOT_PATH_MODE);
module.exports = {
  name: 'metaShopApp',
  filename: 'remoteEntry.js',
  exposes: {
    './metaShopAppInit': './src/entry',
  },
};
