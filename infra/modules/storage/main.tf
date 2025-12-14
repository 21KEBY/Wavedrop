variable "rg_name" {}
variable "location" {}
variable "storage_account_name" {}

resource "azurerm_storage_account" "sa" {
  name                     = var.storage_account_name
  resource_group_name      = var.rg_name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  min_tls_version          = "TLS1_2"
}

resource "azurerm_storage_container" "audio" {
  name                  = "audio"
  storage_account_name  = azurerm_storage_account.sa.name
  container_access_type = "private"
}

output "storage_account_name" { value = azurerm_storage_account.sa.name }
