import * as mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    key: String,
    value: { type: mongoose.Schema.Types.Mixed },
  },
  { collection: 'bunq_session', versionKey: false },
);

export const BunqSession = schema;

export const BUNQ_SESSION = 'BunqSession';
