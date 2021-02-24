import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import Web3 from 'web3';
import { Transaction } from '@ethereumjs/tx';
import Common from '@ethereumjs/common';
import {
  ConfigService,
  MINTER_ADDRESS,
  MINTER_PRIVATE_KEY,
  PRIVATE_KEY,
} from '../../../config/config.service';
import { WEB3 } from '../../../common/web3js.provider';
import {
  CONTRACT_ADDRESS,
  OWNER_ADDRESS,
} from '../../../config/config.service';
import { EurcAddressDto } from '../../../contracts/controllers/euro/eurc-address.dto';

@Injectable()
export class EuroService implements OnModuleInit {
  public euro: any;
  constructor(
    @Inject(WEB3) private readonly web3: Web3,
    private readonly config: ConfigService,
  ) {}

  onModuleInit() {
    const erc20 = JSON.parse(
      readFileSync(join(process.cwd(), 'ERC20-abi.json'), 'utf-8'),
    );
    const euroAddress = this.config.get(CONTRACT_ADDRESS);
    const ownerAddress = this.config.get(OWNER_ADDRESS);
    this.euro = new this.web3.eth.Contract(erc20.abi, euroAddress, {
      from: ownerAddress,
    });
  }

  async getBalance(address: string) {
    try {
      const balance = await new Promise((resolve, reject) => {
        this.euro.methods.balanceOf(address).call((err, res) => {
          if (err) {
            reject(err);
          }
          return resolve(res);
        });
      });
      return { balance };
    } catch (error) {
      throw new InternalServerErrorException(error, error.toString());
    }
  }

  async getTotalSupply() {
    try {
      const totalSupply = await new Promise((resolve, reject) => {
        this.euro.methods.totalSupply().call((err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        });
      });
      return { totalSupply };
    } catch (error) {
      throw new InternalServerErrorException(error, error.toString());
    }
  }

  async getContractName() {
    try {
      const contractName = await new Promise((resolve, reject) => {
        this.euro.methods.name().call((err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        });
      });
      return { contractName };
    } catch (error) {
      throw new InternalServerErrorException(error, error.toString());
    }
  }

  async transferFromOwner(payload: EurcAddressDto) {
    const amountNumber = Number(payload.amount);
    if (Number.isNaN(amountNumber) || amountNumber <= 0) {
      throw new BadRequestException({ InvalidAmount: payload });
    }
    const amount = this.web3.utils.toBN(amountNumber);
    const ownerAddress = this.config.get(OWNER_ADDRESS);
    const euroAddress = this.config.get(CONTRACT_ADDRESS);
    try {
      const count = await this.web3.eth.getTransactionCount(ownerAddress);
      const rawTransaction = {
        from: ownerAddress,
        gasPrice: this.web3.utils.toHex(2 * 1e9),
        gasLimit: this.web3.utils.toHex(210000),
        to: euroAddress,
        value: '0x0',
        data: this.euro.methods.transfer(payload?.address, amount).encodeABI(),
        nonce: this.web3.utils.toHex(count),
      };
      const common = new Common({ chain: 'mainnet' });
      const transaction = new Transaction(rawTransaction, { common });
      const privateAddressHex = this.config.get(PRIVATE_KEY);
      const privateKey = Buffer.from(privateAddressHex, 'hex');
      const signedTx = transaction.sign(privateKey);
      const serializedTx = signedTx.serialize();
      this.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));

      return { transaction: serializedTx.toString('hex') };
    } catch (error) {
      throw new InternalServerErrorException(error, error.toString());
    }
  }

  async mint(payload: EurcAddressDto) {
    const amountNumber = Number(payload.amount);
    if (Number.isNaN(amountNumber) || amountNumber <= 0) {
      throw new BadRequestException({ InvalidAmount: payload });
    }
    const amount = this.web3.utils.toBN(amountNumber);
    const minterAddress = this.config.get(MINTER_ADDRESS);
    const euroAddress = this.config.get(CONTRACT_ADDRESS);
    try {
      const count = await this.web3.eth.getTransactionCount(minterAddress);
      const rawTransaction = {
        from: minterAddress,
        gasPrice: this.web3.utils.toHex(2 * 1e9),
        gasLimit: this.web3.utils.toHex(210000),
        to: euroAddress,
        value: '0x0',
        data: this.euro.methods.mint(payload?.address, amount).encodeABI(),
        nonce: this.web3.utils.toHex(count),
      };
      const common = new Common({ chain: 'mainnet' });
      const transaction = new Transaction(rawTransaction, { common });
      const privateAddressHex = this.config.get(MINTER_PRIVATE_KEY);
      const privateKey = Buffer.from(privateAddressHex, 'hex');
      const signedTx = transaction.sign(privateKey);
      const serializedTx = signedTx.serialize();
      this.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));

      return { transaction: serializedTx.toString('hex') };
    } catch (error) {
      throw new InternalServerErrorException(error.stack, error?.message);
    }
  }
}
