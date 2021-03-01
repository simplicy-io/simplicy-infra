import { Document } from 'mongoose';

export interface TokenCache extends Document {
  accessToken: string;
  refreshToken: string;
  uuid: string;
  active: boolean;
  exp: number;
  sub: string;
  email: string;
  emailVerified: boolean;
  phoneNumber: string;
  phoneNumberVerified: boolean;
  name: string;
  scope: string[];
  roles: string[];
  clientId: string;
  trustedClient: number;
}
