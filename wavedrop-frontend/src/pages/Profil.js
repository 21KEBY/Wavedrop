import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useAudio } from '../hooks/useAudio';
import { 
  User, 
  Music, 
  ListMusic, 
  Clock,
  TrendingUp,
  Award,
  Settings,
  LogOut
} from 'lucide-react';
import api from '../services/api';
import './Profil.css';

const Profil = () => {
  const { utilisateur, deconnexion } = useAuth();
  const { musiqueActuelle } = useAudio();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalMusiques: 0,
    totalPlaylists: 0,
    tempsEcoute: 0,
    derniereActivite: null
  });
  const [mesMusiques, setMesMusiques] = useState([]);

  useEffect(() => {
    chargerStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chargerStats = async () => {
    try {
      // Charger les playlists
      const playlists = await api.get('/playlists');
      
      // Charger toutes les musiques pour compter celles de l'utilisateur
      const musiques = await api.get('/musiques');
      const mesMusiquesFiltered = musiques.filter(m => m.utilisateurId === utilisateur?.id);
      
      setMesMusiques(mesMusiquesFiltered);
      
      // Calculer le temps total de mes musiques
      const tempsTotal = mesMusiquesFiltered.reduce((acc, m) => acc + (m.duree || 0), 0);
      
      setStats({
        totalMusiques: mesMusiquesFiltered.length,
        totalPlaylists: playlists.length,
        tempsEcoute: Math.floor(tempsTotal / 60), // en minutes
        derniereActivite: new Date()
      });
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  const handleDeconnexion = () => {
    deconnexion();
    navigate('/connexion');
  };

  const formatDuree = (minutes) => {
    const heures = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (heures > 0) {
      return `${heures}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const getMemberTime = () => {
    if (!utilisateur?.dateCreation) return "Nouveau membre";
    const date = new Date(utilisateur.dateCreation);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} jours`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} mois`;
    return `${Math.floor(diffDays / 365)} an${Math.floor(diffDays / 365) > 1 ? 's' : ''}`;
  };

  return (
    <div className="profil-page">
      <div className="profil-container">
        {/* Header avec avatar et infos principales */}
        <div className="profil-header">
          <div className="profil-avatar-large">
            <User size={64} />
          </div>
          <div className="profil-header-info">
            <span className="profil-badge">PROFIL</span>
            <h1 className="profil-nom">{utilisateur?.email?.split('@')[0] || 'Utilisateur'}</h1>
            <p className="profil-email">{utilisateur?.email}</p>
            <div className="profil-stats-mini">
              <span>{stats.totalPlaylists} playlist{stats.totalPlaylists > 1 ? 's' : ''}</span>
              <span>•</span>
              <span>{stats.totalMusiques} musique{stats.totalMusiques > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* Statistiques en cartes */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{background: 'rgba(29, 185, 84, 0.1)'}}>
              <Music size={24} style={{color: 'var(--accent-primary)'}} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Musiques uploadées</p>
              <h3 className="stat-value">{stats.totalMusiques}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{background: 'rgba(62, 146, 204, 0.1)'}}>
              <ListMusic size={24} style={{color: 'var(--accent-blue)'}} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Playlists créées</p>
              <h3 className="stat-value">{stats.totalPlaylists}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{background: 'rgba(139, 92, 246, 0.1)'}}>
              <Clock size={24} style={{color: 'var(--accent-purple)'}} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Durée totale</p>
              <h3 className="stat-value">{formatDuree(stats.tempsEcoute)}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{background: 'rgba(255, 165, 0, 0.1)'}}>
              <Award size={24} style={{color: 'var(--warning)'}} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Membre depuis</p>
              <h3 className="stat-value">{getMemberTime()}</h3>
            </div>
          </div>
        </div>

        {/* Lecture en cours */}
        {musiqueActuelle && (
          <div className="profil-section now-playing">
            <div className="section-header-profil">
              <TrendingUp size={20} />
              <h2>En cours de lecture</h2>
            </div>
            <div className="now-playing-card">
              {musiqueActuelle.urlCover ? (
                <img src={musiqueActuelle.urlCover} alt={musiqueActuelle.titre} className="now-playing-cover" />
              ) : (
                <div className="now-playing-cover-placeholder">
                  <Music size={32} />
                </div>
              )}
              <div className="now-playing-info">
                <h3>{musiqueActuelle.titre}</h3>
                <p>{musiqueActuelle.artiste}</p>
              </div>
            </div>
          </div>
        )}

        {/* Mes dernières musiques */}
        {mesMusiques.length > 0 && (
          <div className="profil-section">
            <div className="section-header-profil">
              <Music size={20} />
              <h2>Mes dernières musiques</h2>
            </div>
            <div className="recent-tracks">
              {mesMusiques.slice(0, 5).map((musique) => (
                <div key={musique.id} className="recent-track-item">
                  {musique.urlCover ? (
                    <img src={musique.urlCover} alt={musique.titre} className="recent-track-cover" />
                  ) : (
                    <div className="recent-track-cover-placeholder">
                      <Music size={16} />
                    </div>
                  )}
                  <div className="recent-track-info">
                    <p className="recent-track-title">{musique.titre}</p>
                    <p className="recent-track-artist">{musique.artiste}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="profil-actions">
          <button className="btn-action-profil btn-secondary">
            <Settings size={20} />
            <span>Paramètres</span>
          </button>
          <button onClick={handleDeconnexion} className="btn-action-profil btn-danger">
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profil;