import 'dotenv/config';

export const oidcConstants = {
  issuer: process.env.OAUTH2_CLIENT_PROVIDER_OIDC_ISSUER,
  authorizationURL: `${process.env.OAUTH2_CLIENT_PROVIDER_OIDC_ISSUER}/auth/authorize`,
  frontUrl: process.env.OAUTH2_CLIENT_FRONT_OIDC_URI,
  loginURL: `${process.env.OAUTH2_CLIENT_FRONT_OIDC_URI}/login`,
  tokenURL: `${process.env.OAUTH2_CLIENT_PROVIDER_OIDC_ISSUER}/auth/token`,
  userInfoURL: `${process.env.OAUTH2_CLIENT_PROVIDER_OIDC_ISSUER}/auth/userinfo`,
  callbackURL: `${process.env.OAUTH2_CLIENT_PROVIDER_OIDC_ISSUER}/auth/callback`,
  scope: 'openid profile',
  tokenSecret: process.env.TOKEN_SECRET,
  tokenDuration: process.env.TOKEN_DURATION || 3600, // seconds
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenDuration: process.env.REFRESH_TOKEN_DURATION || 86400 * 30, // seconds (1 days = 86400 seconds so * 30 = 30days in seconds, it is the resfresh token lifetime)
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  idTokenDuration: process.env.REFRESH_TOKEN_SECRET || 3600, // 3600 seconds = 1h
  idTokenSecret: process.env.ID_TOKEN_SECRET,
  secretCodeGenerator: process.env.SECRET_CODE_GENERATOR,
};
