import * as mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const schema = new mongoose.Schema(
  {
    uuid: { type: String, default: uuidv4 },
    appURL: String,
    authServerURL: String,
    clientId: String,
    clientSecret: String,
    profileURL: String,
    tokenURL: String,
    introspectionURL: String,
    authorizationURL: String,
    callbackURLs: [String],
    revocationURL: String,
    clientTokenUuid: String,
  },
  { collection: 'server_settings', versionKey: false },
);

export const ServerSettings = schema;

export const SERVER_SETTINGS = 'ServerSettings';
