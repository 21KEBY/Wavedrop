#!/usr/bin/env bash
set -euo pipefail

# Variables à personnaliser (doivent être globalement uniques pour storage)
RG="rg-mini-spotify"
LOCATION="switzerlandnorth"
TF_STORAGE_ACCOUNT="stwavedrop001"
TF_CONTAINER="tfstate"

echo "Création RG & Storage pour backend Terraform..."
az group create -n $RG -l $LOCATION

az storage account create \
  -n $TF_STORAGE_ACCOUNT \
  -g $RG -l $LOCATION \
  --sku Standard_LRS \
  --kind StorageV2

az storage container create \
  --name $TF_CONTAINER \
  --account-name $TF_STORAGE_ACCOUNT

echo "Terminé. Storage account: $TF_STORAGE_ACCOUNT container: $TF_CONTAINER"
echo "Mets à jour infra/backend.tf avec ces valeurs avant terraform init."
