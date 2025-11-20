# Mini Spotify Cloud – README

## 🎧 Présentation du projet

Mini Spotify Cloud est une application web permettant d’écouter des musiques libres de droits, avec les fonctionnalités essentielles d’une plateforme de streaming musical. Le but est de créer une application Cloud complète et automatisée répondant aux exigences du cours de Cloud Computing.

Ce projet est conçu pour :

* Déployer une application Cloud complète
* Utiliser l’IaC pour toute l’infrastructure
* Mettre en place une CI/CD complète (tests + déploiement infra et app)
* Utiliser plusieurs ressources Cloud (compute, storage, database, etc.)
* Produire un projet reproductible par l’enseignant

---

## 🧩 Fonctionnalités principales

* Lecture de musiques libres de droits
* Système de playlist simplifié
* Compte utilisateur basique (inscription / connexion)
* Interface web simple (React ou autre framework web)
* API backend pour gérer les musiques, playlists, utilisateurs
* Stockage des fichiers audio dans le Cloud
* Interface claire et ergonomique
<img width="923" height="683" alt="image" src="https://github.com/user-attachments/assets/a3a542ed-c805-4cca-b2e0-76fffe38accb" />

---

## 🏗️ Architecture Cloud (résumé)

* **Frontend** : hébergé via un service Cloud (S3 + CloudFront / Vercel / autre)
* **Backend API** : conteneur Docker déployé sur un service Cloud (ECS / Cloud Run / App Service)
* **Base de données** : PostgreSQL / MySQL / Cloud SQL / RDS
* **Stockage audio** : Object Storage (AWS S3, Azure Blob, GCP Cloud Storage)
* **IaC** : Terraform
* **CI/CD** : GitHub Actions (ou GitLab CI)

L’enseignant doit pouvoir reconstruire l’infrastructure en lançant simplement :

```
terraform init
terraform apply
```

Et la CI/CD doit déployer automatiquement dès qu’un commit est push.

---

## 🚀 Installation & Lancement (local)

### 1. Cloner le projet

```
git clone <repo>
cd mini-spotify-cloud
```

### 2. Variables d’environnement

Créer un fichier `.env` basé sur `.env.example` et y renseigner :

* Credentials Cloud
* Variables API
* URL base de données

### 3. Lancer le backend

```
docker compose up --build
```

### 4. Lancer le frontend

Selon framework choisi :

```
npm install
npm run dev
```

---

## ☁️ Déploiement Cloud via CI/CD

### Pipeline (exemple GitHub Actions) :

* Lint + tests backend et frontend
* Build des conteneurs
* Push des images sur un registry Cloud
* Déploiement via Terraform (infra)
* Mise à jour automatique du backend et du frontend

Le pipeline doit être déclenché sur :

* `main` → déploiement production
* `dev` → environnement de test

---

## 📦 Infrastructure as Code (IaC)

Le répertoire `infra/` contient :

* Les modules Terraform
* La configuration du réseau
* La configuration des services Cloud
* Les variables nécessaires

L’enseignant doit pouvoir modifier :

* Les noms des buckets/ressources
* Les identifiants du projet Cloud

Mais la structure doit rester stable et entièrement automatisée.

---

## 📚 Documentation

Le projet inclut :

* Ce README complet
* Un document "Fonctionnalités" détaillant l'application
* Un document "Architecture & Choix techniques" pour l’enseignant
* Un document "Répartition du travail" pour le groupe

---

## 👥 Équipe

Projet réalisé par un groupe de 4 étudiants dans le cadre du cours Cloud Computing – Junia ISEN.

---

## 🧠 Remarques importantes (exigences du professeur)

* Le projet doit utiliser plusieurs ressources Cloud
* Le déploiement doit être entièrement reproductible
* Le code doit être compris par le groupe (pas 100% IA)
* Un bonus de créativité est disponible

---

## ⭐ Bonus possibles

Pour gagner +5 points, on peut ajouter :

* Un mode radio (lecture aléatoire)
* Un système de recommandations basique
* Un mini-player flottant
* Un design original

---

## 📄 Licence

Musiques utilisées : libres de droits.
Projet académique non destiné à un usage commercial.
