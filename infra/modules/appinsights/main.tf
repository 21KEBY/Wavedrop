variable "rg_name" {}
variable "location" {}
variable "ai_name" {}

resource "azurerm_application_insights" "ai" {
  name                = var.ai_name
  location            = var.location
  resource_group_name = var.rg_name
  application_type    = "web"
}

output "instrumentation_key" {
  value = azurerm_application_insights.ai.instrumentation_key
}
