#!/bin/bash


OWNER=$(dfx identity get-principal)

# Inisialisasi token di mainnet
dfx canister --network ic call token initializeToken "(
  record {
    \"principal\" = principal \"$OWNER\";
    initialSupply = 100_000_000_000_000_000 : nat;
    tokenSymbol = \"TPY\";
    tokenLogo = \"\";
    tokenName = \"Tepay Token\";
  },
)"

echo "Token initialized successfully on mainnet"
