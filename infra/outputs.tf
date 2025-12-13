output "acr_login_server" {
  value = module.acr.acr_login_server
}

output "app_default_hostname" {
  value = module.appservice.app_default_hostname
}

output "storage_account_name" {
  value = module.storage.storage_account_name
}

output "sql_fqdn" {
  value = module.sql.sql_fqdn
}
