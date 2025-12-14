import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './Profil.css';

const Profil = () => {
  const { utilisateur, deconnexion } = useAuth();
  const navigate = useNavigate();

  const handleDeconnexion = () => {
    deconnexion();
    navigate('/connexion');
  };

  return (
    <div className="profil-page">
      <div className="profil-container">
        <div className="profil-header">
          <div className="profil-avatar">
            {utilisateur?.email?.charAt(0).toUpperCase() || '👤'}
          </div>
          <h1>Mon Profil</h1>
        </div>

        <div className="profil-content">
          <div className="profil-section">
            <h2>Informations du compte</h2>
            <div className="info-group">
              <label>Email</label>
              <div className="info-value">{utilisateur?.email}</div>
            </div>
            <div className="info-group">
              <label>Membre depuis</label>
              <div className="info-value">
                {utilisateur?.dateCreation
                  ? new Date(utilisateur.dateCreation).toLocaleDateString('fr-FR')
                  : 'Aujourd\'hui'}
              </div>
            </div>
          </div>

          <div className="profil-section">
            <h2>Actions</h2>
            <button onClick={handleDeconnexion} className="btn-deconnexion-profil">
              🚪 Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;