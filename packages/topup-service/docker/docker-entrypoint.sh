#!/bin/bash

function checkEnv() {
  if [[ -z "$NODE_ENV" ]]; then
    export NODE_ENV=production
  fi
  if [[ -z "$STRIPE_PUBLIC_KEY" ]]; then
    echo "STRIPE_PUBLIC_KEY is not set"
    exit 1
  fi
  if [[ -z "$STRIPE_SECRET_KEY" ]]; then
    echo "STRIPE_SECRET_KEY is not set"
    exit 1
  fi
  if [[ -z "$WALLET_ADDRESS" ]]; then
    echo "WALLET_ADDRESS is not set"
    exit 1
  fi
  if [[ -z "$BLOCKCHAIN_CLIENT_URL" ]]; then
    echo "BLOCKCHAIN_CLIENT_URL is not set"
    exit 1
  fi
}

function configureServer() {
  if [ ! -f .env ]; then
    envsubst '${NODE_ENV}
      ${STRIPE_PUBLIC_KEY}
      ${STRIPE_SECRET_KEY}
      ${WALLET_ADDRESS}
      ${BLOCKCHAIN_CLIENT_URL} \
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
