import { IsEthereumAddress, IsString } from 'class-validator';

export class ValidateAddressDto {
  @IsEthereumAddress()
  address: string;

  @IsString()
  signature: string;
}
