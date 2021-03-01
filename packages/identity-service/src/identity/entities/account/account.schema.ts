import * as mongoose from 'mongoose';

export const schema = new mongoose.Schema(
  {
    address: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    fullName: String,
    creation: { type: Date, default: () => new Date() },
  },
  { collection: 'account', versionKey: false },
);

export const Account = schema;

export const ACCOUNT = 'Account';

export const AuthorizationCodeModel = mongoose.model(ACCOUNT, Account);
