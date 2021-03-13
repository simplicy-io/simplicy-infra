import {
  BadRequestException,
  HttpService,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { forkJoin, from, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { TRANSFER_EURO_BALANCE_ENDPOINT } from '../../../constants/url-endpoints';
import { AddTopupDTO } from '../../../topup/controllers/topup/topup.dto';
import {
  ConfigService,
  BLOCKCHAIN_CLIENT_URL,
  BUNQ_USER_ID,
  BUNQ_MONETARY_ACCOUNT_ID,
} from '../../../config/config.service';
import { BunqService } from '../../../common/service/bunq/bunq.service';
import {
  INVALID_ADDRESS,
  INVALID_BUNQ_ID,
  PLEASE_RUN_SETUP,
} from '../../../constants/messages';
import { TokenCache } from '../../../auth/entities/token-cache/token-cache.interface';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { BunqStateService } from '../../entities/bunq-state/bunq-state.service';
import { BunqState } from '../../entities/bunq-state/bunq-state.interface';

@Injectable()
export class TopupService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly bunq: BunqService,
    private readonly settings: ServerSettingsService,
    private readonly bunqState: BunqStateService,
  ) {}

  addTopupForUser(payload: AddTopupDTO, token: TokenCache) {
    if (token?.account?.address !== payload.address) {
      throw new UnauthorizedException(INVALID_ADDRESS);
    }
    return this.addTopup(payload);
  }

  addTopup(payload: AddTopupDTO) {
    const userId = this.config.get(BUNQ_USER_ID);
    const monetaryAccountId = this.config.get(BUNQ_MONETARY_ACCOUNT_ID);
    const uuid = uuidv4();
    return forkJoin({
      settings: from(this.settings.find()),
      bunqState: from(this.bunqState.save({ uuid })),
    }).pipe(
      switchMap(({ settings, bunqState }) => {
        if (!settings) {
          return throwError(new BadRequestException(PLEASE_RUN_SETUP));
        }
        return from(
          this.bunq.bunqClient.api.bunqMeTabs.post(
            Number(userId),
            Number(monetaryAccountId),
            `Simplicy Topup for address ${payload?.address}`,
            {
              value: payload.amount,
              currency: 'EUR',
            },
            {
              redirect_url: `${settings.appURL}/api/success/${bunqState.uuid}`,
            },
          ),
        ).pipe(
          switchMap(res => {
            if (res?.length === 1) {
              const id = res[0];
              return forkJoin({
                bunqState: from(
                  this.bunqState.updateOne(
                    { uuid },
                    { $set: { id: id?.Id?.id } },
                  ),
                ),
                bunqRes: from(
                  this.bunq.bunqClient.api.bunqMeTabs.get(
                    Number(userId),
                    Number(monetaryAccountId),
                    id?.Id?.id,
                  ),
                ),
              });
            }
            return throwError(new BadRequestException(INVALID_BUNQ_ID));
          }),
          switchMap(({ bunqRes }) => {
            if (bunqRes?.BunqMeTab) {
              return from(
                this.bunqState.updateOne(
                  { uuid },
                  {
                    $set: {
                      ...bunqRes?.BunqMeTab,
                      account: { address: payload.address },
                      amount: payload.amount,
                    },
                  },
                ),
              ).pipe(map(out => bunqRes?.BunqMeTab));
            }
            return throwError(new BadRequestException(INVALID_BUNQ_ID));
          }),
        );
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

  async topupSuccess(uuid: string) {
    const state = await this.bunqState.findOne({ uuid });
    const userId = this.config.get(BUNQ_USER_ID);
    const monetaryAccountId = this.config.get(BUNQ_MONETARY_ACCOUNT_ID);
    if (state?.id) {
      const res: BunqState = await this.bunq.bunqClient.api.bunqMeTabs.get(
        Number(userId),
        Number(monetaryAccountId),
        state.id,
      );

      if (res?.result_inquiries?.length) {
        await state.remove();
        await this.mintMoney(state.amount, state.account.address).toPromise();
      }
    }
  }
}
