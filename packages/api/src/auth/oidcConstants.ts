export const oidcConstants = {
  issuer: 'http://localhost:3000',
  authorizationURL: 'http://localhost:3000/auth/authorize',
  loginURL: 'http://localhost:3001/login',
  tokenURL: 'http://localhost:3000/auth/token',
  userInfoURL: 'http://localhost:3000/auth/userinfo',
  clientID: 'my-clientId',
  clientSecret: 'my-clientSecret',
  callbackURL: 'http://localhost:3000/auth/callback',
  scope: 'openid profile',
  tokenDuration: 3600, // seconds
  accessTokenSecret: '3a5z6e4tr87fd6',
  refreshTokenDuration: 86400 * 90, // seconds (1 days = 86400 seconds so * 90 = 90days in seconds, it is the resfresh token lifetime)
  refreshTokenSecret: '1a2z3e4r5t6',
};
