import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LecteurProvider } from './context/LecteurContext';
import { useAuth } from './hooks/useAuth';

// Composants
import BarreNavigation from './components/Navigation/BarreNavigation';
import BarreLecteur from './components/Lecteur/BarreLecteur';

// Pages
import Connexion from './pages/Connexion';
import Inscription from './pages/Inscription';
import Accueil from './pages/Accueil';
import MesPlaylists from './pages/MesPlaylists';
import Profil from './pages/Profil';
import UploadMusique from './pages/UploadMusique';

import './App.css';

// Composant pour protéger les routes
const RouteProtegee = ({ children }) => {
  const { estConnecte, chargement } = useAuth();

  if (chargement) {
    return (
      <div className="chargement-page">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return estConnecte ? children : <Navigate to="/connexion" />;
};

// Composant pour rediriger si déjà connecté
const RoutePublique = ({ children }) => {
  const { estConnecte, chargement } = useAuth();

  if (chargement) {
    return (
      <div className="chargement-page">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return !estConnecte ? children : <Navigate to="/" />;
};

// Composant Layout
const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <BarreNavigation />
      <main className="app-content">{children}</main>
    </div>
  );
};

function AppContent() {
  const { estConnecte } = useAuth();
  
  return (
    <>
      <Routes>
        {/* Routes publiques */}
        <Route
          path="/connexion"
          element={
            <RoutePublique>
              <Connexion />
            </RoutePublique>
          }
        />
        <Route
          path="/inscription"
          element={
            <RoutePublique>
              <Inscription />
            </RoutePublique>
          }
        />

        {/* Routes protégées */}
        <Route
          path="/"
          element={
            <RouteProtegee>
              <Layout>
                <Accueil />
              </Layout>
            </RouteProtegee>
          }
        />
        <Route
          path="/upload"
          element={
            <RouteProtegee>
              <Layout>
                <UploadMusique />
              </Layout>
            </RouteProtegee>
          }
        />
        <Route
          path="/playlists"
          element={
            <RouteProtegee>
              <Layout>
                <MesPlaylists />
              </Layout>
            </RouteProtegee>
          }
        />
        <Route
          path="/profil"
          element={
            <RouteProtegee>
              <Layout>
                <Profil />
              </Layout>
            </RouteProtegee>
          }
        />

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {estConnecte && <BarreLecteur />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <LecteurProvider>
          <AppContent />
        </LecteurProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;