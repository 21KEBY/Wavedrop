import React, { useState } from 'react';
import { useAudio } from '../../hooks/useAudio';
import { usePlaylists } from '../../hooks/usePlaylists';
import { Play, Pause, Download, Music, ListPlus, Check } from 'lucide-react';
import ModaleNotification from '../Modale/ModaleNotification';
import './CarteMusicale.css';

const CarteMusicale = ({ musique }) => {
  const { jouer, musiqueActuelle, estEnLecture, pause, telecharger } = useAudio();
  const { playlists, ajouterMusique } = usePlaylists();
  const [afficherMenuPlaylist, setAfficherMenuPlaylist] = useState(false);
  const [notification, setNotification] = useState(null);

  const estEnCoursDeJouer = musiqueActuelle?.id === musique.id && estEnLecture;

  // Vérifier si la musique est dans une playlist
  const musiqueEstDansPlaylist = (playlistId) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return false;
    
    return playlist.tracks?.some(pt => pt.track?.id === musique.id);
  };

  const handleClick = () => {
    if (estEnCoursDeJouer) {
      pause();
    } else {
      jouer(musique);
    }
  };

  const formatDuree = (secondes) => {
    const minutes = Math.floor(secondes / 60);
    const secs = Math.floor(secondes % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAjouterAPlaylist = async (playlistId) => {
    try {
      await ajouterMusique(playlistId, musique.id);
      setAfficherMenuPlaylist(false);
      setNotification({
        type: 'success',
        message: 'Musique ajoutée à la playlist !'
      });
    } catch (error) {
      setAfficherMenuPlaylist(false);
      // Si l'erreur vient du backend (409 = déjà dans la playlist)
      if (error.response?.status === 409) {
        setNotification({
          type: 'warning',
          message: 'Cette musique est déjà dans la playlist'
        });
      } else {
        setNotification({
          type: 'error',
          message: 'Erreur lors de l\'ajout à la playlist'
        });
      }
    }
  };

  const fermerNotification = () => {
    setNotification(null);
  };

  return (
    <div className={`carte-musicale ${estEnCoursDeJouer ? 'en-lecture' : ''}`}>
      <div className="carte-cover">
        {musique.urlCover ? (
          <img src={musique.urlCover} alt={musique.titre} />
        ) : (
          <div className="cover-placeholder">
            <Music size={32} />
          </div>
        )}
        <button className="btn-play" onClick={handleClick}>
          {estEnCoursDeJouer ? <Pause size={20} /> : <Play size={20} />}
        </button>
      </div>

      <div className="carte-info">
        <h3 className="carte-titre">{musique.titre}</h3>
        <p className="carte-artiste">{musique.artiste}</p>
        <p className="carte-duree">{formatDuree(musique.duree)}</p>
      </div>

      <div className="carte-actions">
        <button 
          className="btn-ajouter-playlist" 
          onClick={() => setAfficherMenuPlaylist(!afficherMenuPlaylist)}
          title="Ajouter à une playlist"
        >
          <ListPlus size={20} />
        </button>
        <button 
          className="btn-telecharger" 
          onClick={() => telecharger(musique)}
          title="Télécharger"
        >
          <Download size={20} />
        </button>

        {afficherMenuPlaylist && playlists.length > 0 && (
          <div className="menu-playlists">
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => handleAjouterAPlaylist(playlist.id)}
                className={`menu-playlist-item ${musiqueEstDansPlaylist(playlist.id) ? 'dans-playlist' : ''}`}
              >
                <span>{playlist.name}</span>
                {musiqueEstDansPlaylist(playlist.id) && (
                  <Check size={18} className="icone-check" />
                )}
              </button>
            ))}
          </div>
        )}

        {afficherMenuPlaylist && playlists.length === 0 && (
          <div className="menu-playlists">
            <p className="menu-vide">Aucune playlist disponible</p>
          </div>
        )}
      </div>

      {notification && (
        <ModaleNotification
          type={notification.type}
          message={notification.message}
          onClose={fermerNotification}
        />
      )}
    </div>
  );
};

export default CarteMusicale;
