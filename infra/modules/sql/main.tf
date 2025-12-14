variable "rg_name" {}
variable "location" {}
variable "sql_server_name" {}
variable "sql_admin_user" {}

variable "sql_admin_password" {
  type      = string
  sensitive = true
}


resource "azurerm_mssql_server" "sql" {
  name                         = var.sql_server_name
  resource_group_name          = var.rg_name
  location                     = var.location
  administrator_login          = var.sql_admin_user
  administrator_login_password = var.sql_admin_password
  version                      = "12.0"
}

resource "azurerm_mssql_database" "db" {
  name      = "musicappdb"
  server_id = azurerm_mssql_server.sql.id
  sku_name  = "S0"
}

output "sql_fqdn" { value = azurerm_mssql_server.sql.fully_qualified_domain_name }
