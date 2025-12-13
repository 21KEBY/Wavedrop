# 🎵 Wavedrop – Frontend

Wavedrop est une application web de streaming musical permettant d’écouter des morceaux, gérer des playlists et télécharger des musiques via une interface moderne et responsive.

## 🚀 Installation

### 1. Cloner le dépôt

git clone https://github.com/21KEBY/Wavedrop.git
cd Wavedrop/wavedrop-frontend


### 2. Installer les dépendances

npm install
ou
yarn install


### 3. Configurer l’environnement

cp .env.example .env

Dans le fichier `.env`, définir l’URL de l’API backend :
REACT_APP_API_URL=http://localhost:5000/api

Adaptez cette valeur si le backend tourne sur une autre URL ou un autre port.

## 📋 Prérequis

- Node.js 14 ou supérieur installé sur la machine
- npm ou yarn
- API backend Wavedrop démarrée (par défaut sur `http://localhost:5000`) exposant les routes REST décrites ci‑dessous

## 💻 Lancement en développement

Pour démarrer l’application frontend en mode développement :

npm start
ou
yarn start


L’application sera accessible sur `http://localhost:3000`. Toute modification du code dans `src/` déclenche un rechargement automatique de la page.

## 🏗️ Structure du projet

src/
components/ # Composants réutilisables de l'interface
  Auth/ # Formulaires de connexion / inscription
  Lecteur/ # Lecteur audio (play/pause, suivant, etc.)
  Musiques/ # Liste, cartes et détails de musiques
  Navigation/ # Barre de navigation et menus
  Playlists/ # Création et gestion des playlists
context/ # Contextes React (authentification, lecteur audio)
hooks/ # Hooks personnalisés (ex : gestion de l'état du player)
pages/ # Pages principales (Accueil, Playlists, Profil, etc.)
services/ # Appels à l’API backend (auth, tracks, playlists)
styles/ # Styles globaux et composants stylés


Cette structure sépare clairement les responsabilités : logique métier côté services, affichage côté components/pages, et état global via les contextes.

## 🔧 Configuration

### Variables d’environnement

- `REACT_APP_API_URL` : URL de base de l’API backend (par défaut `http://localhost:5000/api`)

Veiller à redémarrer le serveur de développement après toute modification des variables d’environnement.

## 📡 API backend attendue

Le frontend Wavedrop consomme une API REST qui doit fournir au minimum les endpoints suivants :

### Authentification

- `POST /auth/register` – Inscription d’un nouvel utilisateur
- `POST /auth/login` – Connexion et récupération du token d’authentification
- `GET /auth/me` – Récupération des informations de l’utilisateur connecté

### Musiques

- `GET /tracks` – Liste de toutes les musiques
- `GET /tracks/:id` – Détail d’une musique
- `GET /tracks?search=query` – Recherche par titre, artiste, etc.

### Playlists

- `GET /playlists` – Liste des playlists de l’utilisateur
- `POST /playlists` – Création d’une nouvelle playlist
- `POST /playlists/:id/add` – Ajout d’une musique à une playlist
- `DELETE /playlists/:id/remove/:trackId` – Suppression d’une musique d’une playlist

Les services frontend (`src/services/`) utilisent ces routes pour toutes les actions d’authentification, de lecture et de gestion de playlists.

## 🎨 Fonctionnalités du frontend

- Authentification (inscription, connexion, gestion de l’utilisateur courant)
- Exploration et lecture de musiques avec contrôles (play/pause, suivant, précédent)
- Recherche de musiques via barre de recherche
- Création et gestion de playlists (ajout/retrait de morceaux)
- Téléchargement de musiques depuis l’interface
- Lecteur audio persistant entre les pages
- Interface responsive adaptée aux écrans desktop et mobiles

## 📦 Build et déploiement

Pour générer une version optimisée pour la production :

npm run build
ou
yarn build


Un dossier `build/` sera créé avec les fichiers statiques prêts à être servis par un serveur web (Nginx, service de hosting statique, etc.).

## 👥 Auteurs

Projet réalisé dans le cadre du cours **Cloud Computing – ISEN 2025/2026**.  
Frontend développé par l’équipe Wavedrop (promotion 2025/2026).
