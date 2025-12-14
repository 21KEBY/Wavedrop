import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Home, ListMusic, User, LogOut, LogIn, UserPlus, Waves, Upload } from 'lucide-react';
import './BarreNavigation.css';

const BarreNavigation = () => {
  const { utilisateur, estConnecte, deconnexion } = useAuth();

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
          <Link to="/" className="nav-link">
            <Home size={20} />
            <span>Accueil</span>
          </Link>
          {estConnecte && (
            <>
              <Link to="/upload" className="nav-link">
                <Upload size={20} />
                <span>Upload</span>
              </Link>
              <Link to="/playlists" className="nav-link">
                <ListMusic size={20} />
                <span>Playlists</span>
              </Link>
              <Link to="/profil" className="nav-link">
                <User size={20} />
                <span>Profil</span>
              </Link>
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