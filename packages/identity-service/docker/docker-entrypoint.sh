#!/bin/bash

function checkEnv() {
  if [[ -z "$NODE_ENV" ]]; then
    export NODE_ENV=production
  fi
  if [[ -z "$BLOCKCHAIN_CLIENT_URL" ]]; then
    echo "BLOCKCHAIN_CLIENT_URL is not set"
    exit 1
  fi
  if [[ -z "$JWKS_ENDPOINT" ]]; then
    echo "JWKS_ENDPOINT is not set"
    exit 1
  fi
  if [[ -z "$DB_HOST" ]]; then
    echo "DB_HOST is not set"
    exit 1
  fi
  if [[ -z "$DB_NAME" ]]; then
    echo "DB_NAME is not set"
    exit 1
  fi
  if [[ -z "$DB_USER" ]]; then
    echo "DB_USER is not set"
    exit 1
  fi
  if [[ -z "$DB_PASSWORD" ]]; then
    echo "DB_PASSWORD is not set"
    exit 1
  fi
  if [[ -z "$MONGO_URI_PREFIX" ]]; then
    export MONGO_URI_PREFIX=mongodb
  fi
}

function configureServer() {
  if [ ! -f .env ]; then
    envsubst '${NODE_ENV}
      ${BLOCKCHAIN_CLIENT_URL}
      ${JWKS_ENDPOINT}
      ${DB_HOST}
      ${DB_NAME}
      ${DB_USER}
      ${DB_PASSWORD}
      ${MONGO_URI_PREFIX}' < docker/env.tmpl > .env
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
