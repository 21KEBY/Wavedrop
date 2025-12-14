variable "rg_name" {}
variable "location" {}
variable "keyvault_name" {}

variable "sql_admin_password" {
  type      = string
  sensitive = true
}

data "azurerm_client_config" "current" {}

resource "azurerm_key_vault" "kv" {
  name                     = var.keyvault_name
  location                 = var.location
  resource_group_name      = var.rg_name
  tenant_id                = data.azurerm_client_config.current.tenant_id
  sku_name                 = "standard"
  purge_protection_enabled = false
}

resource "azurerm_key_vault_secret" "sql_password" {
  name         = "sql-admin-password"
  value        = var.sql_admin_password
  key_vault_id = azurerm_key_vault.kv.id
}
