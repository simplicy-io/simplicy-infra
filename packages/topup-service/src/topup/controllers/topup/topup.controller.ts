import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { TopupService } from '../../aggregates/topup/topup.service';
import { AddTopupDTO } from './topup.dto';

@Controller('topup')
export class TopupController {
  constructor(private readonly topupService: TopupService) {}

  @Post('v1/add')
  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  addTopup(@Body() payload: AddTopupDTO, @Req() req) {
    return this.topupService.addTopupForUser(payload, req.token);
  }

  @Get('success/:uuid')
  async topupSuccess(@Param('uuid') uuid: string, @Res() res) {
    await this.topupService.topupSuccess(uuid);
    return res.redirect('https://www.simplicy.io/thank-you');
  }
}
