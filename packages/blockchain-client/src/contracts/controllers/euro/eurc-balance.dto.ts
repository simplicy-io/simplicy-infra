import { IsEthereumAddress } from 'class-validator';

export class EurcBalanceDto {
  @IsEthereumAddress()
  address: string;
}
