variable "rg_name" {}
variable "location" {}
variable "sql_server_name" {}
variable "sql_admin_user" {}

variable "sql_admin_password" {
  type      = string
  sensitive = true
}
variable "sql_database_name" {
  type        = string
  description = "Nom de la base de données Azure SQL"
}

resource "azurerm_mssql_server" "server" {
  name                         = var.sql_server_name
  resource_group_name          = var.rg_name
  location                     = var.location
  administrator_login          = var.sql_admin_user
  administrator_login_password = var.sql_admin_password
  version                      = "12.0"
}

resource "azurerm_mssql_database" "db" {
  name      = var.sql_database_name
  server_id = azurerm_mssql_server.server.id
  sku_name  = "Basic"
}

resource "azurerm_mssql_firewall_rule" "allow_azure" {
  name             = "AllowAzureServices"
  server_id        = azurerm_mssql_server.server.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

output "sql_fqdn" { value = azurerm_mssql_server.server.fully_qualified_domain_name }
output "database_name" {
  value = azurerm_mssql_database.db.name
}