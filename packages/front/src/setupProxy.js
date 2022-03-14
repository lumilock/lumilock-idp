// setupProxy.js
// https://create-react-app.dev/docs/proxying-api-requests-in-development#configuring-the-proxy-manually
// https://github.com/chimurai/http-proxy-middleware
const { createProxyMiddleware } = require('http-proxy-middleware');

// eslint-disable-next-line no-console
console.log(process.env.REACT_APP_API_URL);

// eslint-disable-next-line func-names
module.exports = function (app) {
  app.use(
    [
      '/auth/logout',
      '/auth/login',
    ],
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL,
      changeOrigin: true,
      xfwd: true,
      secure: false,
    }),
  );
};
