export interface OAuth2Config {
  clientId: string;
  profileUrl: string;
  tokenUrl: string;
  authServerUrl: string;
  authorizationUrl: string;
  revocationUrl: string;
  scope: string;
  callbackUrl: string;
  logoutUrl: string;
  jwksUrl: string;
}

export const APP_INFO_URL = 'https://myaccount.simplicy.io/info';
