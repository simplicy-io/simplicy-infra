import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TopupService } from '../../aggregates/topup/topup.service';
import { AddTopupDTO } from './topup.dto';

@Controller('topup')
export class TopupController {
  constructor(private readonly topupService: TopupService) {}

  @Get('v1/get_balance')
  getBalance() {
    return this.topupService.getBalance();
  }

  @Post('v1/add')
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  addTopup(@Body() payload: AddTopupDTO) {
    return this.topupService.addTopup(payload);
  }
}
