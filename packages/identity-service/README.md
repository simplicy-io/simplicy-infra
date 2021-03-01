## NestJS Http Service

Topup service to add money in you simplicy wallet

### Development Setup

#### Prerequisites

- NodeJS 14+ and npm

Install dependencies

```shell
npm install
```

Copy `env-example` file to `.env` and make following changes

- `STRIPE_PUBLIC_KEY`, set it to provide stripe public key, eg. pk_test_KEY
- `STRIPE_SECRET_KEY`, set it to provide stripe private key, eg. sk_test_KEY
- `WALLET_ADDRESS`, set it to provide default ganache address, eg. 0xaF21c7211e86732Cf08F9d5A79e6B2a1216c5366
- `BLOCKCHAIN_CLIENT_URL`, set it to provide blockchain client url,eg. http://localhost:8000


Start the application for development

```shell
npm run start:debug
```

### Production Setup

- Container Runtime

```shell
docker-compose up -d
```


### Build container image

```shell
docker build -t docker.simplicy.io/identity-service:latest .
```

### Endpoints

Refer the rout `/api-docs` and `/api-docs-json` for Swagger / Open API.
