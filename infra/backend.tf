terraform {
  required_version = ">= 1.3.0"

  backend "azurerm" {
    resource_group_name  = "rg-mini-spotify"
    storage_account_name = "stwavedrop001"
    container_name       = "tfstate"
    key                  = "wavedrop.tfstate.key"
  }
}
