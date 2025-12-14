variable "location" {
  type    = string
  default = "switzerlandnorth"
}

variable "rg_name" {
  type    = string
  default = "rg-wave-drop"
}

variable "acr_name" {
  type = string
  default= "wavedropacr"  
}

variable "storage_account_name" {
  type = string
}

variable "sql_server_name" {
  type = string
}

variable "sql_admin_user" {
  type    = string
  default = "waveadmin"
}

variable "sql_admin_password" {
  type        = string
  sensitive   = true
  description = "Mot de passe admin SQL"
}

variable "app_name" {
  type    = string
  default = "wave-drop-var"
}

variable "plan_name" {
  type    = string
  default = "wave-drop-plan"
}

variable "keyvault_name" {
  type        = string
  description = "Nom du Key Vault (unique dans le RG ou subscription)"
  default     = "kv-wave-drop" # ou laisse vide et fournis via tfvars / pipeline
}