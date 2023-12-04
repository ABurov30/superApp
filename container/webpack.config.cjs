const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  mode: 'development',
  devServer: {
    port: 8000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new ModuleFederationPlugin({
      name: 'container',
      remotes: {
        nirvanaApp: 'nirvanaApp@http://localhost:3001/remoteEntry.js',
        metaShopApp: 'metaShopApp@http://localhost:3000/remoteEntry.js',
      },
    }),
  ],
};
