# 🎵 Wavedrop - Frontend

Application web de streaming musical avec gestion de playlists.

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Modifier .env avec l'URL de votre API backend
```

## 💻 Développement

```bash
# Lancer l'application en mode développement
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 📋 Prérequis

- Node.js 14+
- npm ou yarn
- Backend API démarré sur `http://localhost:5000`

## 🏗️ Structure du projet

```
src/
├── components/      # Composants réutilisables
│   ├── Auth/       # Connexion, Inscription
│   ├── Lecteur/    # Lecteur audio
│   ├── Musiques/   # Liste et cartes de musiques
│   ├── Navigation/ # Barre de navigation
│   └── Playlists/  # Gestion des playlists
├── context/        # Contextes React (Auth, Lecteur)
├── hooks/          # Hooks personnalisés
├── pages/          # Pages de l'application
├── services/       # Services API
└── styles/         # Styles CSS
```

## 🔧 Configuration

### Variables d'environnement

- `REACT_APP_API_URL` : URL de l'API backend (défaut: `http://localhost:5000/api`)

## 📡 API Backend requise

Le backend doit fournir les endpoints suivants :

### Authentification
- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion
- `GET /auth/me` - Utilisateur connecté

### Musiques
- `GET /tracks` - Liste des musiques
- `GET /tracks/:id` - Détail d'une musique
- `GET /tracks?search=query` - Recherche

### Playlists
- `GET /playlists` - Liste des playlists
- `POST /playlists` - Créer une playlist
- `POST /playlists/:id/add` - Ajouter une musique
- `DELETE /playlists/:id/remove/:trackId` - Retirer une musique

## 🎨 Fonctionnalités

✅ Authentification (Connexion/Inscription)  
✅ Lecture de musiques avec contrôles  
✅ Recherche de musiques  
✅ Gestion de playlists  
✅ Téléchargement de musiques  
✅ Lecteur persistant  
✅ Interface responsive  

## 📦 Build

```bash
# Créer une version de production
npm run build
```

## 👥 Auteurs

Projet réalisé dans le cadre du cours Cloud Computing - ISEN 2025/2026