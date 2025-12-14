variable "rg_name" {}
variable "location" {}
variable "keyvault_name" {}

variable "sql_admin_password" {
  type      = string
  sensitive = true
}
variable "webapp_principal_id" {
  type        = string
  description = "Principal ID de l'App Service (Managed Identity)"
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

resource "azurerm_key_vault_access_policy" "webapp_policy" {
  key_vault_id = azurerm_key_vault.kv.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = var.webapp_principal_id

  secret_permissions = ["Get", "List"]
}

// Give the currently authenticated principal (Terraform / az CLI) permissions to manage secrets
resource "azurerm_key_vault_access_policy" "terraform_user" {
  key_vault_id = azurerm_key_vault.kv.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = data.azurerm_client_config.current.object_id

  secret_permissions = ["Get", "List", "Set", "Delete"]
}

output "sql_admin_password_secret_uri" {
  description = "URI du secret SQL dans le Key Vault"
  value       = azurerm_key_vault_secret.sql_password.id
}