import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { AccountAggregateService } from '../../aggregates/account-aggregate/account-aggregate.service';
import { CreateAccountDto } from './create-account.dto';
import { FetchAddressDto } from './fetch-address.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly aggregate: AccountAggregateService) {}

  @Post('v1/create')
  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  create(@Body() payload: CreateAccountDto, @Req() req) {
    return this.aggregate.create(payload, req?.token);
  }

  @Get('v1/fetch_account_by_phone')
  @UseGuards(TokenGuard)
  async fetchAccountByPhone(@Req() req) {
    return await this.aggregate.fetchAccountByPhone(req?.token);
  }

  @Get('v1/balance_of')
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  balanceOf(@Query() query: FetchAddressDto) {
    return this.aggregate.balanceOfAddress(query);
  }
}
