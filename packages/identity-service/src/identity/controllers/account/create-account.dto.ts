import { IsEthereumAddress, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsEthereumAddress()
  address: string;

  @IsString()
  signature: string;
}
