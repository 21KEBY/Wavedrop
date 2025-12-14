resource "azurerm_service_plan" "plan" {
  name                = var.plan_name
  location            = var.location
  resource_group_name = var.rg_name
 
 os_type = "Linux"
 sku_name = "S1"
}

resource "azurerm_linux_web_app" "webapp" {
  name                = var.app_name
  location            = var.location
  resource_group_name = var.rg_name
  service_plan_id = azurerm_service_plan.plan.id

  identity {
    type = "SystemAssigned"
  }

  site_config {
    container_registry_use_managed_identity = true
  }

  app_settings = {
    # Monitoring
    "APPINSIGHTS_INSTRUMENTATIONKEY"      = var.appinsights_instrumentation_key
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"

    # SQL connection (Key Vault reference used in the string)
    DATABASE_URL = "sqlserver://${var.sql_admin_user}:@Microsoft.KeyVault(SecretUri=${var.sql_admin_password_secret_uri})@${var.sql_server_fqdn}:1433;database=${var.sql_database_name};encrypt=true"
  }
}

output "app_default_hostname" {
  value = "${var.app_name}.azurewebsites.net"
}

output "web_app_principal_id" {
  value = azurerm_linux_web_app.webapp.identity[0].principal_id
}