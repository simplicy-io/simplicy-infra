## NestJS Http Service

Service to interact with ERC contract

### Development Setup

#### Prerequisites

- NodeJS 12+ and npm

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
docker run --name erc-client -d \
  -e "RPC_URI=http://172.17.0.1:7545" \
  -e "PRIVATE_KEY=707d322470dbdc3c35a1642b77d94f5ee6b2adf32fec55503a9b9314888bb7ab" \
  -e "CONTRACT_ADDRESS=0xa86f49f07a65F55D580777627E281217B18ec38c" \
  -e "OWNER_ADDRESS=0x339F1F7C8682b114C7BDc642b83d30855b20cb72" \
  -p "8000:8000" \
  docker.simplicy.io/blockchain-client:latest
```

Note:
- This example sets `RPC_URL` to ganache running on docker host.
- Change the `PRIVATE_KEY`, `CONTRACT_ADDRESS` and `OWNER_ADDRESS` as per the network.


### Build container image

```shell
docker build -t docker.simplicy.io/blockchain-client:latest .
```

### Endpoints

Refer the rout `/api-docs` and `/api-docs-json` for Swagger / Open API.