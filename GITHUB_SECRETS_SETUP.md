# Configuration GitHub Secrets

Ce guide explique comment configurer les secrets nécessaires pour le CI/CD dans GitHub Actions.

## Secrets requis

### 1. AZURE_CREDENTIALS

C'est le Service Principal Azure qui permet à GitHub Actions d'interagir avec votre souscription Azure.

#### Création du Service Principal

```bash
# Se connecter à Azure
az login

# Définir la souscription
az account set --subscription "YOUR_SUBSCRIPTION_ID"

# Créer le Service Principal
az ad sp create-for-rbac \
  --name "wavedrop-github-sp" \
  --role Contributor \
  --scopes /subscriptions/YOUR_SUBSCRIPTION_ID \
  --sdk-auth > azure-credentials.json
```

Le fichier `azure-credentials.json` contient :
```json
{
  "clientId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  "clientSecret": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "subscriptionId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  "tenantId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```

⚠️ **IMPORTANT** : Ne JAMAIS commit ce fichier ! Il est dans `.gitignore`.

#### Ajouter à GitHub

1. Aller dans votre repository GitHub
2. Settings > Secrets and variables > Actions
3. Cliquer sur "New repository secret"
4. Name: `AZURE_CREDENTIALS`
5. Value: Copier-coller **tout le contenu** du fichier `azure-credentials.json`
6. Cliquer "Add secret"

### 2. ACR_NAME

Le nom de votre Azure Container Registry (sans le `.azurecr.io`).

#### Récupérer le nom

```bash
# Lister vos ACR
az acr list --query "[].name" -o table

# Ou depuis Terraform
cd infra
terraform output acr_login_server
# Exemple de sortie: acrwavedrop001.azurecr.io
# Le nom est: acrwavedrop001
```

#### Ajouter à GitHub

1. Settings > Secrets and variables > Actions
2. New repository secret
3. Name: `ACR_NAME`
4. Value: `acrwavedrop001` (votre nom ACR)
5. Add secret

### 3. APP_NAME

Le nom de votre App Service Azure.

#### Récupérer le nom

```bash
# Lister vos App Services
az webapp list --query "[].name" -o table

# Ou depuis Terraform
cd infra
terraform output app_default_hostname
# Exemple de sortie: app-wavedrop.azurewebsites.net
# Le nom est: app-wavedrop
```

#### Ajouter à GitHub

1. Settings > Secrets and variables > Actions
2. New repository secret
3. Name: `APP_NAME`
4. Value: `app-wavedrop` (votre nom App Service)
5. Add secret

## Vérification

Une fois les 3 secrets configurés, vous devriez voir dans Settings > Secrets :

```
AZURE_CREDENTIALS    Set    Updated XXX
ACR_NAME            Set    Updated XXX
APP_NAME            Set    Updated XXX
```

## Test du workflow

### Push vers GitHub

```bash
git add .
git commit -m "Configure CI/CD"
git push origin main
```

### Vérifier l'exécution

1. Aller dans l'onglet "Actions" de votre repository
2. Cliquer sur le workflow "CI/CD Terraform & App"
3. Vérifier que tous les jobs passent au vert

### En cas d'erreur

#### Erreur d'authentification Azure

```
Error: AADSTS7000215: Invalid client secret
```

**Solution** : Régénérer le Service Principal et mettre à jour AZURE_CREDENTIALS

```bash
az ad sp create-for-rbac --name "wavedrop-github-sp" --role Contributor --scopes /subscriptions/YOUR_SUBSCRIPTION_ID --sdk-auth
```

#### Erreur ACR introuvable

```
Error: Cannot find Azure Container Registry
```

**Solution** : Vérifier que ACR_NAME correspond exactement au nom dans Azure

```bash
az acr list --query "[].name" -o table
```

#### Erreur App Service introuvable

```
Error: Cannot find App Service
```

**Solution** : Vérifier que APP_NAME correspond exactement

```bash
az webapp list --query "[].name" -o table
```

## Variables d'environnement App Service

Les variables d'environnement de l'App Service doivent être configurées dans Azure Portal :

1. Azure Portal > App Services > Votre App
2. Configuration > Application settings
3. Ajouter :

```
NODE_ENV=production
JWT_SECRET=YOUR_STRONG_JWT_SECRET
FRONTEND_URL=https://your-frontend-url
STORAGE_ACCOUNT_NAME=stwavedrop001
```

⚠️ La variable `DATABASE_URL` est déjà configurée par Terraform avec Key Vault.

## Déploiement manuel

Pour déclencher un déploiement manuel sans push :

1. GitHub > Actions
2. Sélectionner "CI/CD Terraform & App"
3. Cliquer "Run workflow"
4. Sélectionner branch "main"
5. Cliquer "Run workflow"

Cela exécutera aussi `infra-apply` (Terraform apply).

## Sécurité

### Rotation des secrets

Il est recommandé de régénérer régulièrement le Service Principal :

```bash
# Supprimer l'ancien
az ad sp delete --id "wavedrop-github-sp"

# En créer un nouveau
az ad sp create-for-rbac --name "wavedrop-github-sp" --role Contributor --scopes /subscriptions/YOUR_SUBSCRIPTION_ID --sdk-auth

# Mettre à jour AZURE_CREDENTIALS dans GitHub
```

### Principe du moindre privilège

Au lieu de `Contributor` sur toute la souscription, vous pouvez restreindre au Resource Group :

```bash
RG_ID=$(az group show -n rg-wavedrop-prod --query id -o tsv)

az ad sp create-for-rbac \
  --name "wavedrop-github-sp" \
  --role Contributor \
  --scopes $RG_ID \
  --sdk-auth
```

## Support

Pour toute question sur les secrets GitHub Actions :
- https://docs.github.com/en/actions/security-guides/encrypted-secrets
- https://docs.microsoft.com/en-us/azure/developer/github/connect-from-azure

---

**Dernière mise à jour** : Décembre 2025
