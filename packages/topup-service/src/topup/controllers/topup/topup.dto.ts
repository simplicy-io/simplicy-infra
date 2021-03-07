import { IsEthereumAddress, IsNumberString } from 'class-validator';

export class AddTopupDTO {
  @IsNumberString()
  amount: string;

  @IsEthereumAddress()
  address?: string;
}
