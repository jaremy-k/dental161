#!/bin/sh
set -e

CERT_PATH="${1:-/etc/ssl/certs/russian_trusted_ca.pem}"

curl -fsSL "https://gu-st.ru/content/lending/russian_trusted_root_ca_pem.crt" -o /tmp/russian_trusted_root_ca.pem
curl -fsSL "https://gu-st.ru/content/lending/russian_trusted_sub_ca_pem.crt" -o /tmp/russian_trusted_sub_ca.pem
cat /tmp/russian_trusted_root_ca.pem /tmp/russian_trusted_sub_ca.pem > "$CERT_PATH"
rm /tmp/russian_trusted_root_ca.pem /tmp/russian_trusted_sub_ca.pem

echo "Russian Trusted CA bundle: $CERT_PATH"
