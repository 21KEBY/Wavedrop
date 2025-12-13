# Assigne le role AcrPull à l'identité system-assigned de l'App Service
resource "azurerm_role_assignment" "acr_pull" {
  scope                = module.acr.acr_id
  role_definition_name = "AcrPull"
  principal_id         = module.appservice.web_app_principal_id
}
