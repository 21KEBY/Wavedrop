import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Home, ListMusic, User, LogOut, LogIn, UserPlus, Waves, Upload } from 'lucide-react';
import './BarreNavigation.css';

const BarreNavigation = () => {
  const { utilisateur, estConnecte, deconnexion } = useAuth();

  return (
    <nav className="barre-navigation">
      <div className="nav-container">
        <div className="nav-logo">
          <div className="logo-icon">
            <Waves size={32} strokeWidth={2.5} />
          </div>
          <h1>Wavedrop</h1>
        </div>

        <div className="nav-links">
          <a href="/" className="nav-link">
            <Home size={20} />
            <span>Accueil</span>
          </a>
          {estConnecte && (
            <>
              <a href="/upload" className="nav-link">
                <Upload size={20} />
                <span>Upload</span>
              </a>
              <a href="/playlists" className="nav-link">
                <ListMusic size={20} />
                <span>Playlists</span>
              </a>
              <a href="/profil" className="nav-link">
                <User size={20} />
                <span>Profil</span>
              </a>
            </>
          )}
        </div>

        <div className="nav-auth">
          {estConnecte ? (
            <>
              <span className="user-email">{utilisateur?.email}</span>
              <button onClick={deconnexion} className="btn-deconnexion">
                <LogOut size={18} />
                <span>Déconnexion</span>
              </button>
            </>
          ) : (
            <>
              <a href="/connexion" className="btn-connexion">
                <LogIn size={18} />
                <span>Connexion</span>
              </a>
              <a href="/inscription" className="btn-inscription">
                <UserPlus size={18} />
                <span>Inscription</span>
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default BarreNavigation;