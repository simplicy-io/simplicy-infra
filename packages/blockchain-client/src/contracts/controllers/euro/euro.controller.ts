import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EuroService } from '../../aggregates/euro/euro.service';
import { EurcAddressDto } from './eurc-address.dto';

@Controller('euro')
export class EuroController {
  constructor(private readonly euro: EuroService) {}

  @Get('balance_of')
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  async balance(@Query() params: EurcAddressDto) {
    return await this.euro.getBalance(params.address);
  }

  @Get('total_supply')
  async totalSupply() {
    return await this.euro.getTotalSupply();
  }

  @Get('contract_name')
  async contractName() {
    return await this.euro.getContractName();
  }

  @Post('transfer_from_owner')
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  async transferFromOwner(@Body() payload: EurcAddressDto) {
    return await this.euro.transferFromOwner(payload);
  }

  @Post('mint')
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  async mint(@Body() payload: EurcAddressDto) {
    return await this.euro.mint(payload);
  }
}
