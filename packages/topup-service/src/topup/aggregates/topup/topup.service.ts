import { BadRequestException, HttpService, Injectable } from '@nestjs/common';
import { from, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { StripeServiceService } from '../../../common/service/stripe-service/stripe-service.service';
import {
  SIMPLICY_STRIPE_DEFAULTS,
  SIMPLICY_STRIPE_ADDRESS_DEFAULTS,
} from '../../../constants/app-strings';
import {
  GET_EURO_BALANCE_ENDPOINT,
  TRANSFER_EURO_BALANCE_ENDPOINT,
} from '../../../constants/url-endpoints';
import { AddTopupDTO } from '../../../topup/controllers/topup/topup.dto';
import {
  ConfigService,
  BLOCKCHAIN_CLIENT_URL,
  WALLET_ADDRESS,
} from '../../../config/config.service';

@Injectable()
export class TopupService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly stripeService: StripeServiceService,
  ) {}

  getBalance() {
    const url = this.config.get(BLOCKCHAIN_CLIENT_URL);
    const params = {
      address: this.config.get(WALLET_ADDRESS),
    };
    return of({}).pipe(
      switchMap(obj => {
        return this.http.get(`${url}/${GET_EURO_BALANCE_ENDPOINT}`, { params });
      }),
      map(data => data.data),
      switchMap((balance: { balance: number }) => {
        return of({
          address: params.address,
          ...balance,
        });
      }),
      catchError(err => {
        return throwError('Failed to fetch user balance.');
      }),
    );
  }

  addTopup(payload: AddTopupDTO) {
    return of({}).pipe(
      switchMap(() => {
        const address = {
          line1: payload.stripeToken.card.address_line1,
          postal_code: payload.stripeToken.card.address_zip,
          city: payload.stripeToken.card.address_city,
          state: payload.stripeToken.card.address_state,
          country: payload.stripeToken.card.country,
        };

        Object.keys(address).forEach(key => {
          if (!address[key]) {
            address[key] = SIMPLICY_STRIPE_ADDRESS_DEFAULTS[key];
          }
        });

        return from(
          this.stripeService.stripe.charges.create({
            ...SIMPLICY_STRIPE_DEFAULTS,
            amount: payload.amount,
            source: payload.id,
            shipping: {
              name: payload.stripeToken.card.name,
              address,
            },
          }),
        );
      }),
      switchMap(response => {
        return this.addBlockchainMoney(
          JSON.stringify(payload.amount / 100),
          this.config.get(WALLET_ADDRESS),
        );
      }),
      catchError(err => {
        return throwError(new BadRequestException(err?.raw?.message || err));
      }),
    );
  }

  addBlockchainMoney(amount: string, address: string) {
    const url = `${this.config.get(
      BLOCKCHAIN_CLIENT_URL,
    )}/${TRANSFER_EURO_BALANCE_ENDPOINT}`;
    return this.http
      .post(url, { amount, address })
      .pipe(switchMap(success => of(true)));
  }
}
