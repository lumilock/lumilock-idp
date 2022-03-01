export const oidcConstants = {
  issuer: 'https://192.168.99.1:3000',
  authorizationURL: 'https://192.168.99.1:3000/auth/authorize',
  loginURL: 'http://192.168.99.1:3001/login',
  tokenURL: 'https://192.168.99.1:3000/auth/token',
  userInfoURL: 'https://192.168.99.1:3000/auth/userinfo',
  clientID: 'my-clientId',
  clientSecret: 'my-clientSecret',
  callbackURL: 'https://192.168.99.1:3000/auth/callback',
  scope: 'openid profile',
  tokenDuration: 3600, // seconds
  accessTokenSecret: '3a5z6e4tr87fd6',
  refreshTokenDuration: 86400 * 90, // seconds (1 days = 86400 seconds so * 90 = 90days in seconds, it is the resfresh token lifetime)
  refreshTokenSecret: '1a2z3e4r5t6',
  idTokenDuration: 3600, // seconds
  idTokenSecret: 'd4sf65fds45f6d4s6',
};
