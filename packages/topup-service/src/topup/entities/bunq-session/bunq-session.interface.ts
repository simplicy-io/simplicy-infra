import { Document } from 'mongoose';

export interface BunqSession extends Document {
  key?: string;
  value?: any;
}
