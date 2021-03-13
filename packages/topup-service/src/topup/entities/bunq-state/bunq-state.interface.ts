import { Document } from 'mongoose';
import { Account } from '../../../auth/entities/token-cache/token-cache.interface';

export interface BunqState extends Document {
  uuid?: string;
  id?: number;
  created?: string;
  updated?: string;
  time_expiry?: string;
  monetary_account_id?: number;
  status?: string;
  type?: string;
  alias_monetary_account?: AliasMonetaryAccount;
  bunqme_tab_share_url?: string;
  bunqme_tab_entry?: BunqMeTabEntry;
  bunqme_tab_entries?: BunqMeTabEntry[];
  result_inquiries?: any[];
  account?: Account;
  amount?: string;
}

export interface BunqMeTabEntry {
  uuid?: string;
  created?: string;
  updated?: string;
  amount_inquired?: AmountInquired;
  status?: string;
  description?: string;
  alias?: AliasMonetaryAccount;
  redirect_url?: string;
  merchant_available?: MerchantAvailable[];
}

export interface MerchantAvailable {
  merchant_type?: string;
  available?: boolean;
}

export interface AmountInquired {
  currency?: string;
  value?: string;
}

export interface AliasMonetaryAccount {
  iban?: string;
  is_light?: boolean;
  display_name?: string;
  avatar?: Avatar;
  label_user?: LabelUser;
  country?: string;
}

export interface LabelUser {
  uuid?: string;
  display_name?: string;
  country?: string;
  avatar?: Avatar;
  public_nick_name?: string;
}

export interface Avatar {
  uuid?: string;
  image?: Image[];
  anchor_uuid?: any;
  style?: string;
}

export interface Image {
  attachment_public_uuid?: string;
  height?: number;
  width?: number;
  content_type?: string;
}
