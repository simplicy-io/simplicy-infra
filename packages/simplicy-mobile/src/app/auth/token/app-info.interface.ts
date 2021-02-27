export interface AppInfo {
  service: string;
  uuid: string;
  appURL: string;
  authServerURL: string;
  clientId: string;
  profileURL: string;
  tokenURL: string;
  introspectionURL: string;
  authorizationURL: string;
  callbackURLs: string[];
  revocationURL: string;
  communicationService: string;
  expireRequestLogInMinutes: number;
}
