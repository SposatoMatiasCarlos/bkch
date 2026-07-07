#!/usr/bin/env bash
set -e

# uso: ./deploy.sh sepolia
NETWORK=$1

if [ -z "$NETWORK" ]; then
  echo "Uso: ./deploy.sh <network>   (es: sepolia)"
  exit 1
fi

source .env

NETWORK_UPPER=$(echo "$NETWORK" | tr '[:lower:]' '[:upper:]')
RPC_URL_VAR="${NETWORK_UPPER}_RPC_URL"   # es: sepolia -> SEPOLIA_RPC_URL
RPC_URL=${!RPC_URL_VAR}

if [ -z "$RPC_URL" ]; then
  echo "Non trovo la variabile $RPC_URL_VAR nel tuo .env"
  exit 1
fi

forge script script/Deploy.sol:Deploy \
  --rpc-url $RPC_URL \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  -vvvv