#!/usr/bin/env bash
set -e

# uso: ./deploy.sh sepolia
NETWORK=$1

if [ -z "$NETWORK" ]; then
  echo "Uso: ./deploy.sh <network>   (es: sepolia)"
  exit 1
fi

source .env

RPC_URL_VAR="${NETWORK^^}_RPC_URL"   # es: sepolia -> SEPOLIA_RPC_URL
RPC_URL=${!RPC_URL_VAR}

if [ -z "$RPC_URL" ]; then
  echo "Non trovo la variabile $RPC_URL_VAR nel tuo .env"
  exit 1
fi

forge script script/Deploy.sol:Deploy \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  -vvvv # max verbosity (per debug)