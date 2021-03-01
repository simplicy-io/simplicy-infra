import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import Web3 from 'web3';
import { ethers } from 'ethers';

export const ADDRESS_VERIFICATION = 'ADDRESS_VERIFICATION';

@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  web3 = new Web3(new Web3.providers.HttpProvider(environment.rpcUrl));
  ethers = new ethers.providers.Web3Provider(this.web3.eth.currentProvider);

  constructor() {}

  async createAccount() {
    const mnemonic = await ethers.utils.entropyToMnemonic(
      ethers.utils.randomBytes(16),
    );
    return ethers.Wallet.fromMnemonic(mnemonic);
  }

  signMessage(privateKey: string, message: string = ADDRESS_VERIFICATION) {
    return this.web3.eth.accounts.sign(message, privateKey);
  }
}
