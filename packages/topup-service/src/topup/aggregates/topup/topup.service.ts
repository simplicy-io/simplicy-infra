import { BadRequestException, HttpService, Injectable } from '@nestjs/common';
import { from, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { TRANSFER_EURO_BALANCE_ENDPOINT } from '../../../constants/url-endpoints';
import { AddTopupDTO } from '../../../topup/controllers/topup/topup.dto';
import {
  ConfigService,
  BLOCKCHAIN_CLIENT_URL,
  BUNQ_USER_ID,
  BUNQ_MONETARY_ACCOUNT_ID,
} from '../../../config/config.service';
import { BunqService } from '../../../common/service/bunq/bunq.service';

@Injectable()
export class TopupService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly bunq: BunqService,
  ) {}

  addTopup(payload: AddTopupDTO) {
    const userId = this.config.get(BUNQ_USER_ID);
    const monetaryAccountId = this.config.get(BUNQ_MONETARY_ACCOUNT_ID);
    return of({}).pipe(
      switchMap(() => {
        return from(
          this.bunq.bunqClient.api.bunqMeTabs.post(
            Number(userId),
            Number(monetaryAccountId),
            'Simplicy Topup',
            {
              value: payload.amount,
              currency: 'EUR',
            },
            // { redirect_url: 'https://9f173363d7c7.ngrok.io/api/webhook/boom' }
          ),
        );
      }),
      switchMap(res => {
        if (res?.length === 1) {
          const id = res[0];
          return from(
            this.bunq.bunqClient.api.bunqMeTabs.get(
              Number(userId),
              Number(monetaryAccountId),
              id?.Id?.id,
            ),
          );
        }
      }),
      catchError(err => {
        return throwError(new BadRequestException(err?.raw?.message || err));
      }),
    );
  }

  mintMoney(amount: string, address: string) {
    const url = `${this.config.get(
      BLOCKCHAIN_CLIENT_URL,
    )}/${TRANSFER_EURO_BALANCE_ENDPOINT}`;
    return this.http
      .post(url, { amount, address })
      .pipe(switchMap(success => of(true)));
  }
}
