resource "azurerm_app_service_plan" "plan" {
  name                = var.plan_name
  location            = var.location
  resource_group_name = var.rg_name
  kind                = "Linux"
  reserved            = true
  sku {
    tier = "PremiumV2"
    size = "P1v2"
  }
}

resource "azurerm_app_service" "webapp" {
  name                = var.app_name
  location            = var.location
  resource_group_name = var.rg_name
  app_service_plan_id = azurerm_app_service_plan.plan.id

  identity {
    type = "SystemAssigned"
  }

  site_config {
    linux_fx_version                     = "DOCKER|${var.acr_login_server}/${var.image_repository}:${var.image_tag}"
    acr_use_managed_identity_credentials = true
  }

  app_settings = {
    #Monitoring
    "APPINSIGHTS_INSTRUMENTATIONKEY"      = var.appinsights_instrumentation_key
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    #SQL
    SQL_SERVER         = module.sql.sql_fqdn
    SQL_ADMIN_USER     = var.sql_admin_user
    SQL_ADMIN_PASSWORD = "@Microsoft.KeyVault(SecretUri=${module.keyvault.sql_admin_password_secret_uri})"
  }
}

output "app_default_hostname" { value = azurerm_app_service.webapp.default_site_hostname }
output "web_app_principal_id" { value = azurerm_app_service.webapp.identity[0].principal_id }
