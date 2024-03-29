## NestJS Http Service

Service to interact with ERC contract

### Development Setup

#### Prerequisites

- NodeJS 14+ and npm
- Ganache

Start ganache

```shell
docker run \
  --name ganache-blockchain \
  -v $HOME/ganache-data:/data \
  -p 7545:7545 -d \
  trufflesuite/ganache-cli:latest -h 0.0.0.0 -p 7545 --db /data --networkId 43
```

Note: data will persist at location `~/ganache-data`. Remove it to reset things.

rRun migrations from https://github.com/simplicy-io/eurc-eth.

```shell
git clone https://github.com/simplicy-io/eurc-eth.git && cd eurc-eth
yarn
cp secrets.json.example secrets.json
yarn truffle migrate --network development
```

Install dependencies

```shell
npm install
```

Copy `env-example` file to `.env` and make following changes

- `RPC_URI`, set it to provide url, e.g. for ganache http://127.0.0.1:8545
- `OWNER_ADDRESS`, set it to the address of contract owner
- `PRIVATE_KEY`, set it to the private hex key of owner
- `CONTRACT_ADDRESS`, set it to the contract address
- `MINTER_ADDRESS`, set it to the address of token minter
- `MINTER_PRIVATE_KEY`, set it to the private hex key of token minter
- `BURNER_ADDRESS`, set it to the address of token burner
- `BURNER_PRIVATE_KEY`, set it to the private hex key of token burner

Start the application for development

```shell
npm run start:debug
```

### Production Setup

- Container Runtime

```shell
docker-compose up -d
```

Note:
- This example sets `RPC_URL` to ganache running on docker host.
- Change the environment variables in `.env` file as per the network.


### Build container image

```shell
docker build -t docker.simplicy.io/blockchain-client:latest .
```

### Endpoints

Refer the rout `/api-docs` and `/api-docs-json` for Swagger / Open API.
