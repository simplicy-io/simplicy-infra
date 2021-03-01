import { IsEthereumAddress } from 'class-validator';

export class FetchAddressDto {
  @IsEthereumAddress()
  address: string;
}
