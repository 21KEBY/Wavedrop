import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Home, ListMusic, User, LogOut, LogIn, UserPlus, Waves, Upload } from 'lucide-react';
import './BarreNavigation.css';

const BarreNavigation = () => {
  const { utilisateur, estConnecte, deconnexion } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="barre-navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <div className="logo-icon">
            <Waves size={32} strokeWidth={2.5} />
          </div>
          <h1>Wavedrop</h1>
        </Link>

        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            <Home size={20} />
            <span>Accueil</span>
          </Link>
          {estConnecte && (
            <>
              <Link to="/upload" className={`nav-link ${isActive('/upload') ? 'active' : ''}`}>
                <Upload size={20} />
                <span>Upload</span>
              </Link>
              <Link to="/playlists" className={`nav-link ${isActive('/playlists') ? 'active' : ''}`}>
                <ListMusic size={20} />
                <span>Mes Playlists</span>
              </Link>
              <Link to="/profil" className={`nav-link ${isActive('/profil') ? 'active' : ''}`}>
                <User size={20} />
                <span>Profil</span>
              </Link>
            </>
          )}
        </div>

        <div className="nav-auth">
          {estConnecte ? (
            <>
              <div className="user-info">
                <div className="user-avatar">
                  {utilisateur?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="user-email">{utilisateur?.email}</span>
              </div>
              <button onClick={deconnexion} className="btn-deconnexion">
                <LogOut size={18} />
                <span>Déconnexion</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/connexion" className="btn-connexion">
                <LogIn size={18} />
                <span>Connexion</span>
              </Link>
              <Link to="/inscription" className="btn-inscription">
                <UserPlus size={18} />
                <span>Inscription</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default BarreNavigation;