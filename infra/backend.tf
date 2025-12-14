terraform {
  required_version = ">= 1.3.0"

  backend "azurerm" {
    resource_group_name  = "rg-wave-drop"         # ressource group stockant le state terraform
    storage_account_name = "stwavedrop"      # storage account contenant le fichier de state
    container_name       = "tfstate"                 # nom du container ou se trouve le state 
    key                  = "wavedrop.tfstate.key" # nom du fichier de state 
  }
}
