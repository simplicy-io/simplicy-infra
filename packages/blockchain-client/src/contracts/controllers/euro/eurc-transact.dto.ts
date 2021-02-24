import { IsEthereumAddress, IsNumberString } from 'class-validator';

export class EurcTransactDto {
  @IsEthereumAddress()
  address: string;

  @IsNumberString()
  amount: string;
}
