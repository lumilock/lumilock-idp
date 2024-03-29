import 'dotenv/config';

export const oidcConstants = {
  issuer: process.env.OAUTH2_CLIENT_PROVIDER_OIDC_ISSUER,
  authorizationURL: `${process.env.OAUTH2_CLIENT_PROVIDER_OIDC_ISSUER}/api/auth/authorize`,
  frontUrl: process.env.OAUTH2_CLIENT_FRONT_OIDC_URI,
  loginURL: `${process.env.OAUTH2_CLIENT_FRONT_OIDC_URI}/login`,
  tokenURL: `${process.env.OAUTH2_CLIENT_PROVIDER_OIDC_ISSUER}/api/auth/token`,
  userInfoURL: `${process.env.OAUTH2_CLIENT_PROVIDER_OIDC_ISSUER}/api/auth/userinfo`,
  callbackURL: `${process.env.OAUTH2_CLIENT_PROVIDER_OIDC_ISSUER}/api/auth/callback`,
  scope: 'openid profile',
  accessTokenDuration: process.env.ACCESS_TOKEN_DURATION || 3600, // seconds
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenDuration: process.env.REFRESH_TOKEN_DURATION || 86400 * 30, // seconds (1 days = 86400 seconds so * 30 = 30days in seconds, it is the resfresh token lifetime)
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  idTokenDuration: process.env.ID_TOKEN_DURATION || 3600, // 3600 seconds = 1h
  idTokenSecret: process.env.ID_TOKEN_SECRET,
  secretCodeGenerator: process.env.SECRET_CODE_GENERATOR,
  secretHashKey: process.env.SECRET_HASH_KEY,
  clientLauncherId: process.env.CLIENT_LAUNCHER_ID,
};
