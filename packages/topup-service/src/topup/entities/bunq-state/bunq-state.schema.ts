import * as mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    uuid: String,
    id: Number,
    created: String,
    updated: String,
    time_expiry: String,
    monetary_account_id: Number,
    status: String,
    type: String,
    alias_monetary_account: mongoose.Schema.Types.Mixed,
    bunqme_tab_share_url: String,
    bunqme_tab_entry: mongoose.Schema.Types.Mixed,
    bunqme_tab_entries: [mongoose.Schema.Types.Mixed],
    result_inquiries: [mongoose.Schema.Types.Mixed],
    account: mongoose.Schema.Types.Mixed,
    amount: String,
  },
  { collection: 'bunq_state', versionKey: false, strict: false },
);

export const BunqState = schema;

export const BUNQ_STATE = 'BunqState';
