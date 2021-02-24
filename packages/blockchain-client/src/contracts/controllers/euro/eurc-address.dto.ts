import { IsEthereumAddress, IsNumberString } from 'class-validator';

export class EurcAddressDto {
  @IsEthereumAddress()
  address: string;

  @IsNumberString()
  amount: string;
}
