import React, { useState } from 'react';
import { usePlaylists } from '../../hooks/usePlaylists';
import { useAudio } from '../../hooks/useAudio';
import './EditeurPlaylist.css';

const EditeurPlaylist = ({ playlist }) => {
  const { retirerMusique } = usePlaylists();
  const { jouer } = useAudio();
  const [afficherConfirmation, setAfficherConfirmation] = useState(null);

  const handleRetirerMusique = async (musiqueId) => {
    try {
      await retirerMusique(playlist.id, musiqueId);
      setAfficherConfirmation(null);
    } catch (error) {
      alert('Erreur lors de la suppression de la musique');
    }
  };

  const handleJouerPlaylist = () => {
    if (playlist.musiques && playlist.musiques.length > 0) {
      jouer(playlist.musiques[0], playlist.musiques);
    }
  };

  const formatDuree = (secondes) => {
    const minutes = Math.floor(secondes / 60);
    const secs = Math.floor(secondes % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (!playlist) {
    return <div className="editeur-vide">Sélectionnez une playlist</div>;
  }

  return (
    <div className="editeur-playlist">
      <div className="editeur-header">
        <h2>{playlist.nom}</h2>
        <div className="editeur-stats">
          <span>{playlist.musiques?.length || 0} musiques</span>
          {playlist.musiques && playlist.musiques.length > 0 && (
            <button onClick={handleJouerPlaylist} className="btn-jouer-tout">
              ▶️ Tout jouer
            </button>
          )}
        </div>
      </div>

      <div className="editeur-liste">
        {!playlist.musiques || playlist.musiques.length === 0 ? (
          <div className="liste-vide">
            <p>Cette playlist est vide</p>
            <p className="texte-aide">Ajoutez des musiques depuis la bibliothèque</p>
          </div>
        ) : (
          playlist.musiques.map((musique, index) => (
            <div key={musique.id} className="editeur-item">
              <div className="item-numero">{index + 1}</div>
              
              <div className="item-cover">
                {musique.urlCover ? (
                  <img src={musique.urlCover} alt={musique.titre} />
                ) : (
                  <div className="cover-placeholder">🎵</div>
                )}
              </div>

              <div className="item-info">
                <h4>{musique.titre}</h4>
                <p>{musique.artiste}</p>
              </div>

              <div className="item-duree">
                {formatDuree(musique.duree)}
              </div>

              <div className="item-actions">
                <button
                  onClick={() => jouer(musique, playlist.musiques)}
                  className="btn-jouer"
                  title="Jouer"
                >
                  ▶️
                </button>
                <button
                  onClick={() => setAfficherConfirmation(musique.id)}
                  className="btn-retirer"
                  title="Retirer de la playlist"
                >
                  🗑️
                </button>
              </div>

              {afficherConfirmation === musique.id && (
                <div className="confirmation-overlay">
                  <div className="confirmation-box">
                    <p>Retirer cette musique de la playlist ?</p>
                    <div className="confirmation-actions">
                      <button
                        onClick={() => handleRetirerMusique(musique.id)}
                        className="btn-confirmer"
                      >
                        Oui
                      </button>
                      <button
                        onClick={() => setAfficherConfirmation(null)}
                        className="btn-annuler"
                      >
                        Non
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EditeurPlaylist;