import { Document } from 'mongoose';

export interface ServerSettings extends Document {
  uuid?: string;
  appURL?: string;
  authServerURL?: string;
  clientId?: string;
  clientSecret?: string;
  profileURL?: string;
  tokenURL?: string;
  introspectionURL?: string;
  authorizationURL?: string;
  callbackURLs?: string;
  revocationURL?: string;
  clientTokenUuid?: string;
  callbackProtocol?: string;
}
