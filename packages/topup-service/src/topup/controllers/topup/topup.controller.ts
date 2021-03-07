import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TopupService } from '../../aggregates/topup/topup.service';
import { AddTopupDTO } from './topup.dto';

@Controller('topup')
export class TopupController {
  constructor(private readonly topupService: TopupService) {}

  @Post('v1/add')
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  addTopup(@Body() payload: AddTopupDTO) {
    return this.topupService.addTopup(payload);
  }
}
