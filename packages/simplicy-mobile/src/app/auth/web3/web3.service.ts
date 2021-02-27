import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import Web3 from 'web3';

export const ADDRESS_VERIFICATION = 'ADDRESS_VERIFICATION';

@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  web3 = new Web3(new Web3.providers.HttpProvider(environment.rpcUrl));

  constructor() {}

  createAccount() {
    return this.web3.eth.accounts.create();
  }

  signMessage(privateKey: string, message: string = ADDRESS_VERIFICATION) {
    return this.web3.eth.accounts.sign(message, privateKey);
  }
}
