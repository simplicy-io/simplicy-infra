import { Document } from 'mongoose';

export interface Account extends Document {
  address?: string;
  email?: string;
  phone?: string;
  fullName?: string;
  creation?: Date;
}
