# Wavedrop - Plateforme de Streaming Musical sur Azure

**Groupe 19 - Wavedrop**

Application complète de streaming musical déployée sur Microsoft Azure avec architecture multi-services.

## 🌐 URLs de l'Application

- **Frontend** : https://stwavedrop001.z1.web.core.windows.net
- **Backend API** : https://wave-drop-var.azurewebsites.net
- **Health Check** : https://wave-drop-var.azurewebsites.net/health

## Architecture Azure

- **App Service** : Backend Node.js/Express avec Docker
- **Azure SQL Database** : Base de données relationnelle (utilisateurs, playlists, tracks)
- **Azure Blob Storage** : Stockage des fichiers audio et covers (2 containers)
- **Azure Container Registry** : Registry Docker privé
- **Key Vault** : Gestion sécurisée des secrets
- **Application Insights** : Monitoring et télémétrie
- **Managed Identity** : Authentification sécurisée entre services

## Prérequis

### Outils requis
- **Azure CLI** : `az --version` >= 2.50.0
- **Terraform** : >= 1.5.0
- **Docker** : >= 20.10
- **Node.js** : >= 18.x
- **Git** : pour cloner le repository

### Compte Azure
- Souscription Azure active
- Droits Contributor sur la souscription
- Service Principal configuré (voir section Configuration)

## Configuration Initiale

### 1. Cloner le repository
```bash
git clone https://github.com/21KEBY/Wavedrop.git
cd Wavedrop
```

### 2. Créer un Service Principal Azure
```bash
az login
az account set --subscription "YOUR_SUBSCRIPTION_ID"

az ad sp create-for-rbac --name "wavedrop-sp" \
  --role Contributor \
  --scopes /subscriptions/YOUR_SUBSCRIPTION_ID \
  --sdk-auth > azure-credentials.json
```

Sauvegarder le JSON généré (nécessaire pour GitHub Actions).

### 3. Configurer les variables Terraform
Copier et éditer `infra/terraform.tfvars` :
```hcl
location = "switzerlandnorth"
rg_name  = "rg-wavedrop-prod"

sql_server_name      = "sql-wavedrop-prod"
sql_database_name    = "wavedrop-db"
sql_admin_user       = "waveadmin"
sql_admin_password   = "CHANGE_ME_STRONG_PASSWORD"

acr_name             = "acrwavedrop"  # Doit être unique globalement
storage_account_name = "stwavedrop"   # Doit être unique globalement
keyvault_name        = "kv-wavedrop"  # Doit être unique globalement
app_name             = "app-wavedrop" # Doit être unique globalement
plan_name            = "plan-wavedrop"
```

**Important** : Les noms `acr_name`, `storage_account_name`, `keyvault_name` et `app_name` doivent être **uniques à l'échelle mondiale Azure**.

## Déploiement Infrastructure (Terraform)

### 1. Initialiser le backend Terraform
```bash
cd infra
bash ../scripts/bootstrap-tf-backend.sh
```

Vérifier que le backend Azure est créé, puis mettre à jour `infra/backend.tf` si nécessaire.

### 2. Initialiser Terraform
```bash
terraform init
terraform validate
```

### 3. Vérifier le plan
```bash
terraform plan
```

Examiner les ressources qui seront créées (~15 ressources).

### 4. Déployer l'infrastructure
```bash
terraform apply -auto-approve
```

Durée estimée : 5-10 minutes.

### 5. Récupérer les outputs
```bash
terraform output
```

Noter les valeurs suivantes :
- `acr_login_server` : URL du Container Registry
- `app_default_hostname` : URL de l'App Service
- `storage_account_name` : Nom du Storage Account
- `sql_fqdn` : FQDN du serveur SQL

## Configuration Backend

### 1. Créer le fichier .env
Dans `backend/`, copier `.env.example` vers `.env` et configurer :
```bash
cd ../backend
cp .env.example .env
```

Éditer `.env` :
```env
# Production
NODE_ENV=production
PORT=8080

# Base de données (récupéré depuis terraform output)
DATABASE_URL="sqlserver://waveadmin:PASSWORD@sql-wavedrop-prod.database.windows.net:1433;database=wavedrop-db;encrypt=true"

# JWT
JWT_SECRET="GENERATE_STRONG_RANDOM_SECRET_HERE"

# Azure Storage (récupéré depuis portal ou terraform)
AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=stwavedrop;AccountKey=...;EndpointSuffix=core.windows.net"
STORAGE_ACCOUNT_NAME="stwavedrop"

# Frontend URL (récupéré depuis App Service)
FRONTEND_URL="https://YOUR_FRONTEND_URL"
```

### 2. Appliquer les migrations Prisma
```bash
npm install
npx prisma migrate deploy
npx prisma generate
```

### 3. Tester localement (optionnel)
```bash
npm start
```

Vérifier que l'API répond sur http://localhost:8080

## Configuration Frontend

### 1. Créer le fichier .env
Dans `wavedrop-frontend/` :
```bash
cd ../wavedrop-frontend
cp .env.example .env
```

Éditer `.env` :
```env
REACT_APP_API_URL=https://app-wavedrop.azurewebsites.net
```

### 2. Build de production
```bash
npm install
npm run build
```

Le frontend doit être hébergé séparément (Azure Static Web Apps, Storage Static Website, ou autre CDN).

## Déploiement via GitHub Actions

### 1. Configurer les GitHub Secrets
Dans Settings > Secrets > Actions, ajouter :

```
AZURE_CREDENTIALS      : Contenu du fichier azure-credentials.json
ACR_NAME              : acrwavedrop (votre nom ACR)
APP_NAME              : app-wavedrop (votre nom App Service)
```

### 2. Variables d'environnement dans App Service
Aller dans Azure Portal > App Service > Configuration > Application settings :

```
NODE_ENV=production
JWT_SECRET=your_secret_here
FRONTEND_URL=https://your-frontend-url
STORAGE_ACCOUNT_NAME=stwavedrop
DATABASE_URL=@Microsoft.KeyVault(SecretUri=...)  # Déjà configuré par Terraform
```

### 3. Activer Managed Identity pour Storage
```bash
WEBAPP_PRINCIPAL_ID=$(az webapp identity show -g rg-wavedrop-prod -n app-wavedrop --query principalId -o tsv)

STORAGE_ACCOUNT_ID=$(az storage account show -g rg-wavedrop-prod -n stwavedrop --query id -o tsv)

az role assignment create \
  --assignee $WEBAPP_PRINCIPAL_ID \
  --role "Storage Blob Data Contributor" \
  --scope $STORAGE_ACCOUNT_ID
```

### 4. Push vers GitHub
```bash
git add .
git commit -m "Configuration production"
git push origin main
```

Le workflow GitHub Actions se déclenche automatiquement :
1. Build de l'image Docker
2. Push vers ACR
3. Déploiement sur App Service
4. Tests smoke

## Vérification du Déploiement

### 1. Vérifier l'App Service
```bash
curl https://app-wavedrop.azurewebsites.net/health
```

Doit retourner 200 OK.

### 2. Vérifier les logs
```bash
az webapp log tail -g rg-wavedrop-prod -n app-wavedrop
```

### 3. Tester les endpoints API
```bash
# Health check
curl https://app-wavedrop.azurewebsites.net/health

# Inscription
curl -X POST https://app-wavedrop.azurewebsites.net/auth/inscription \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"Test1234"}'
```

### 4. Vérifier le Storage
```bash
az storage container list --account-name stwavedrop --auth-mode login
```

Doit afficher les containers `audio` et `covers`.

## Surveillance et Monitoring

### Application Insights
- Accéder à Azure Portal > Application Insights
- Consulter les métriques : requêtes, performances, erreurs
- Configurer des alertes sur les seuils critiques

### Logs
```bash
# Logs en temps réel
az webapp log tail -g rg-wavedrop-prod -n app-wavedrop

# Télécharger les logs
az webapp log download -g rg-wavedrop-prod -n app-wavedrop
```

## Maintenance

### Nettoyage des blobs orphelins
```bash
cd backend
npm run clean-orphans
```

### Mise à jour de l'application
1. Modifier le code
2. Commit et push vers `main`
3. GitHub Actions se charge du déploiement automatique

### Backup de la base de données
```bash
az sql db export \
  -s sql-wavedrop-prod \
  -n wavedrop-db \
  -g rg-wavedrop-prod \
  -u waveadmin \
  -p PASSWORD \
  --storage-key-type StorageAccessKey \
  --storage-key STORAGE_KEY \
  --storage-uri https://stwavedrop.blob.core.windows.net/backups/backup.bacpac
```

## Troubleshooting

### Erreur de connexion SQL
- Vérifier que le firewall SQL autorise Azure Services
- Vérifier la chaîne DATABASE_URL dans App Settings

### Images Docker non accessibles
```bash
# Vérifier l'authentification ACR
az acr login --name acrwavedrop

# Vérifier les images
az acr repository list --name acrwavedrop
```

### Erreur Managed Identity
```bash
# Vérifier les rôles assignés
az role assignment list --assignee $WEBAPP_PRINCIPAL_ID
```

### CORS errors
Vérifier dans `backend/src/app.ts` que `FRONTEND_URL` est correctement configuré.

## Coûts Estimés

Configuration actuelle (région Switzerland North) :
- **App Service Plan S1** : ~60 EUR/mois
- **Azure SQL Database Basic** : ~5 EUR/mois
- **Storage Account** : ~0.02 EUR/GB/mois
- **Application Insights** : ~2 EUR/mois (premiers 5GB gratuits)
- **Container Registry Basic** : ~5 EUR/mois

**Total estimé** : ~75-80 EUR/mois

## Support

Pour toute question ou problème :
- Consulter la documentation Azure : https://docs.microsoft.com/azure
- Vérifier les logs Application Insights
- Consulter les issues GitHub du projet

## Licence

Projet académique - ISEN 2025/2026

