import { Global, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { STRIPE_API_VERSION } from '../../../constants/app-strings';
import Stripe from 'stripe';

@Injectable()
@Global()
export class StripeServiceService implements OnModuleInit {
  public stripe: Stripe;

  constructor() {}

  async onModuleInit() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: STRIPE_API_VERSION,
      maxNetworkRetries: 1,
      telemetry: true,
    });
    await this.stripe.balance
      .retrieve()
      .then(success =>
        Logger.log('Stripe Initialized Successfully', 'Stripe Connection'),
      )
      .catch(success =>
        Logger.error('Stripe Connection Failed', '', 'Stripe Connection'),
      );
  }
}
