#!/bin/bash

function checkEnv() {
  if [[ -z "$NODE_ENV" ]]; then
    export NODE_ENV=production
  fi
  if [[ -z "$RPC_URI" ]]; then
    echo "RPC_URI is not set"
    exit 1
  fi
  if [[ -z "$PRIVATE_KEY" ]]; then
    echo "PRIVATE_KEY is not set"
    exit 1
  fi
  if [[ -z "$CONTRACT_ADDRESS" ]]; then
    echo "CONTRACT_ADDRESS is not set"
    exit 1
  fi
  if [[ -z "$OWNER_ADDRESS" ]]; then
    echo "OWNER_ADDRESS is not set"
    exit 1
  fi
  if [[ -z "$MINTER_ADDRESS" ]]; then
    echo "MINTER_ADDRESS is not set"
    exit 1
  fi
  if [[ -z "$MINTER_PRIVATE_KEY" ]]; then
    echo "MINTER_PRIVATE_KEY is not set"
    exit 1
  fi
  if [[ -z "$BURNER_ADDRESS" ]]; then
    echo "BURNER_ADDRESS is not set"
    exit 1
  fi
  if [[ -z "$BURNER_PRIVATE_KEY" ]]; then
    echo "BURNER_PRIVATE_KEY is not set"
    exit 1
  fi
}

function configureServer() {
  if [ ! -f .env ]; then
    envsubst '${NODE_ENV}
      ${RPC_URI}
      ${PRIVATE_KEY}
      ${CONTRACT_ADDRESS}
      ${OWNER_ADDRESS}
      ${MINTER_ADDRESS}
      ${MINTER_PRIVATE_KEY}
      ${BURNER_ADDRESS}
      ${BURNER_PRIVATE_KEY}' \
      < docker/env.tmpl > .env
  fi
}

if [ "$1" = 'start' ]; then
  # Validate if DB_HOST is set.
  checkEnv
  # Configure server
  configureServer
  # Start server
  node dist/main.js
fi

exec "$@"
