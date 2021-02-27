import { IsNumber, IsOptional, IsString } from 'class-validator';

export interface StripCardInterface {
  address_city: string;
  address_country: string;
  address_line1: string;
  address_line1_check: string;
  address_line2: string;
  address_state: string;
  address_zip: string;
  address_zip_check: string;
  brand: string;
  country: string;
  cvc_check: string;
  dynamic_last4: unknown;
  exp_month: number;
  exp_year: number;
  funding: string;
  id: string;
  last4: string;
  name: string;
  object: string;
}

export interface StripeTokenInterface {
  tokenization_method: null;
  client_ip: string;
  created: number;
  email: string;
  id: string;
  livemode: false;
  object: string;
  type: string;
  used: boolean;
  card: StripCardInterface;
}

export class AddTopupDTO {
  @IsString()
  id: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  stripeToken?: StripeTokenInterface;
}
