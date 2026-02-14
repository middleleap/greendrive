#!/bin/bash
# Generate EC key pair for Tesla Fleet API registration
# Tesla requires an ECDSA P-256 public key for partner authentication

set -e

KEYS_DIR="./keys"
mkdir -p "$KEYS_DIR"

echo "Generating EC P-256 key pair for Tesla Fleet API..."

openssl ecparam -name prime256v1 -genkey -noout -out "$KEYS_DIR/private.pem"
openssl ec -in "$KEYS_DIR/private.pem" -pubout -out "$KEYS_DIR/public.pem"

echo ""
echo "Keys generated:"
echo "  Private: $KEYS_DIR/private.pem"
echo "  Public:  $KEYS_DIR/public.pem"
echo ""
echo "Upload public.pem to developer.tesla.com for your application."
