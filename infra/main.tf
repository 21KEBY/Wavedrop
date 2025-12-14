# main.tf - utilise les modules locaux
module "acr" {
  source   = "./modules/acr"
  rg_name  = var.rg_name
  location = var.location
  acr_name = var.acr_name
}

module "storage" {
  source               = "./modules/storage"
  rg_name              = var.rg_name
  location             = var.location
  storage_account_name = var.storage_account_name
}

module "sql" {
  source             = "./modules/sql"
  rg_name            = var.rg_name
  location           = var.location
  sql_server_name    = var.sql_server_name
  sql_admin_user     = var.sql_admin_user
  sql_admin_password = var.sql_admin_password
}

module "appinsights" {
  source   = "./modules/appinsights"
  rg_name  = var.rg_name
  location = var.location
  ai_name  = "${var.app_name}-ai"
}

module "keyvault" {
  source             = "./modules/keyvault"
  rg_name            = var.rg_name
  location           = var.location
  keyvault_name      = var.keyvault_name
  sql_admin_password = var.sql_admin_password
}

module "appservice" {
  source           = "./modules/appservice"
  rg_name          = var.rg_name
  location         = var.location
  plan_name        = var.plan_name
  app_name         = var.app_name
  acr_login_server = module.acr.acr_login_server
  //Récupère l’URL du registre privé générée par le module ACR
  image_repository                = "music-backend"
  image_tag                       = "latest" # pipeline update le tag dans App Service (ou use latest)
  appinsights_instrumentation_key = module.appinsights.instrumentation_key

  sql_server_fqdn                 = module.sql.sql_fqdn
  sql_admin_user                  = var.sql_admin_user
  sql_admin_password_secret_uri   = module.keyvault.sql_admin_password_secret_uri
}
