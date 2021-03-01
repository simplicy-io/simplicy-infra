import {
  BadRequestException,
  HttpService,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { from, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { AccountService } from '../../entities/account/account.service';
import { CreateAccountDto } from '../../controllers/account/create-account.dto';
import { FetchAddressDto } from '../../controllers/account/fetch-address.dto';
import {
  BLOCKCHAIN_CLIENT_URL,
  ConfigService,
} from '../../../config/config.service';
import {
  VERIFY_ADDRESS_ENDPOINT,
  BALANCE_OF_ENDPOINT,
} from '../../../constants/url-endpoints';
import { TokenCache } from '../../../auth/entities/token-cache/token-cache.interface';

@Injectable()
export class AccountAggregateService {
  constructor(
    private readonly account: AccountService,
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  create(payload: CreateAccountDto, token: TokenCache) {
    return from(
      this.account.findOne({
        phone: token?.phoneNumber,
        email: token?.email,
      }),
    ).pipe(
      switchMap(existingAccount => {
        if (existingAccount) {
          return throwError(
            new BadRequestException({
              phone: token?.phoneNumber,
              email: token?.email,
              accountExists: true,
            }),
          );
        }
        const url =
          this.config.get(BLOCKCHAIN_CLIENT_URL) + VERIFY_ADDRESS_ENDPOINT;
        return this.http
          .post(url, {
            address: payload.address,
            signature: payload.signature,
          })
          .pipe(
            map(res => res.data),
            switchMap(data => {
              if (data.isVerified) {
                return from(
                  this.account.save({
                    ...payload,
                    phone: token?.phoneNumber,
                    email: token?.email,
                    fullName: token.name,
                  }),
                );
              }
              return throwError(
                new BadRequestException('ACCOUNT_VERIFICATION_FAILED'),
              );
            }),
          );
      }),
    );
  }

  async fetchAccountByPhone(token: TokenCache) {
    if (!token?.phoneNumberVerified) {
      throw new BadRequestException('UNVERIFIED_PHONE');
    }

    if (!token?.emailVerified) {
      throw new BadRequestException('UNVERIFIED_EMAIL');
    }

    const account = await this.account.findOne({
      phone: token?.phoneNumber,
    });

    if (!account) {
      throw new NotFoundException({
        phone: token?.phoneNumber,
      });
    }

    return account;
  }

  balanceOfAddress(params: FetchAddressDto) {
    return this.http
      .get(this.config.get(BLOCKCHAIN_CLIENT_URL) + BALANCE_OF_ENDPOINT, {
        params,
      })
      .pipe(map(res => res.data));
  }
}
