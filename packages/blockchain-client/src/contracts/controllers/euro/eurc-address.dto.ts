import { IsEthereumAddress, IsNumberString, IsOptional } from 'class-validator';

export class EurcAddressDto {
  @IsEthereumAddress()
  address: string;

  @IsNumberString()
  @IsOptional()
  amount: string;
}
