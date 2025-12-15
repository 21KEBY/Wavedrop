import React, { useState } from 'react';
import { usePlaylists } from '../../hooks/usePlaylists';
import { useAudio } from '../../hooks/useAudio';
import { Trash2, Edit2 } from 'lucide-react';
import './EditeurPlaylist.css';

const EditeurPlaylist = ({ playlist, onPlaylistSupprimee, onPlaylistModifiee }) => {
  const { retirerMusique, supprimerPlaylist, renommerPlaylist } = usePlaylists();
  const { jouer } = useAudio();
  const [afficherConfirmation, setAfficherConfirmation] = useState(null);
  const [afficherConfirmationSuppression, setAfficherConfirmationSuppression] = useState(false);
  const [modeRenommage, setModeRenommage] = useState(false);
  const [nouveauNom, setNouveauNom] = useState('');
  const [musiquesLocales, setMusiquesLocales] = useState([]);
  
  // Mapper les données backend vers frontend
  const musiques = musiquesLocales.length > 0 ? musiquesLocales : (playlist.tracks?.map(pt => ({
    id: pt.track.id,
    titre: pt.track.title,
    artiste: pt.track.artistName || 'Artiste inconnu',
    duree: pt.track.duration || 0,
    urlCover: pt.track.coverUrl,
    urlAudio: pt.track.audioUrl
  })) || []);

  // Initialiser musiques locales au chargement
  React.useEffect(() => {
    if (playlist.tracks) {
      const mapped = playlist.tracks.map(pt => ({
        id: pt.track.id,
        titre: pt.track.title,
        artiste: pt.track.artistName || 'Artiste inconnu',
        duree: pt.track.duration || 0,
        urlCover: pt.track.coverUrl,
        urlAudio: pt.track.audioUrl
      }));
      setMusiquesLocales(mapped);
    }
  }, [playlist.tracks]);

  const handleRetirerMusique = async (musiqueId) => {
    try {
      // Mise à jour immédiate de l'UI avec prevState
      setMusiquesLocales(prev => prev.filter(m => m.id !== musiqueId));
      setAfficherConfirmation(null);
      // Appel backend
      await retirerMusique(playlist.id, musiqueId);
      // Notifier le parent pour rafraîchir
      if (onPlaylistModifiee) onPlaylistModifiee();
    } catch (error) {
      // En cas d'erreur, recharger depuis playlist.tracks
      if (playlist.tracks) {
        const mapped = playlist.tracks.map(pt => ({
          id: pt.track.id,
          titre: pt.track.title,
          artiste: pt.track.artistName || 'Artiste inconnu',
          duree: pt.track.duration || 0,
          urlCover: pt.track.coverUrl,
          urlAudio: pt.track.audioUrl
        }));
        setMusiquesLocales(mapped);
      }
      alert('Erreur lors de la suppression de la musique');
    }
  };

  const handleJouerPlaylist = () => {
    if (musiques && musiques.length > 0) {
      jouer(musiques[0], musiques);
    }
  };

  const handleSupprimerPlaylist = async () => {
    try {
      await supprimerPlaylist(playlist.id);
      setAfficherConfirmationSuppression(false);
      // Notifier le parent que la playlist a été supprimée
      if (onPlaylistSupprimee) onPlaylistSupprimee();
    } catch (error) {
      alert('Erreur lors de la suppression de la playlist');
    }
  };

  const handleRenommer = async () => {
    if (!nouveauNom.trim()) {
      alert('Le nom ne peut pas être vide');
      return;
    }
    try {
      await renommerPlaylist(playlist.id, nouveauNom);
      setModeRenommage(false);
      setNouveauNom('');
      // Notifier le parent pour rafraîchir
      if (onPlaylistModifiee) onPlaylistModifiee();
    } catch (error) {
      alert('Erreur lors du renommage de la playlist');
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
        <div className="header-titre">
          <h2>{playlist.name}</h2>
          <div className="header-actions">
            <button 
              onClick={() => {
                setModeRenommage(true);
                setNouveauNom(playlist.name);
              }}
              className="btn-renommer-playlist"
              title="Renommer la playlist"
            >
              <Edit2 size={18} />
            </button>
            <button 
              onClick={() => setAfficherConfirmationSuppression(true)}
              className="btn-supprimer-playlist"
              title="Supprimer la playlist"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        <div className="editeur-stats">
          <span>{musiques.length} musiques</span>
          {musiques.length > 0 && (
            <button onClick={handleJouerPlaylist} className="btn-jouer-tout">
              ▶️ Tout jouer
            </button>
          )}
        </div>
      </div>

      <div className="editeur-liste">
        {musiques.length === 0 ? (
          <div className="liste-vide">
            <p>Cette playlist est vide</p>
            <p className="texte-aide">Ajoutez des musiques depuis la bibliothèque</p>
          </div>
        ) : (
          musiques.map((musique, index) => (
            <div key={musique.id} className="editeur-item">
              <div className="item-numero">{index + 1}</div>
              
              <div className="item-cover">
                {musique.urlCover ? (
                  <img src={musique.urlCover} alt={musique.titre} />
                ) : (
                  <div className="cover-placeholder">♪</div>
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
                  onClick={() => jouer(musique, musiques)}
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
                  ×
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

      {afficherConfirmationSuppression && (
        <div className="confirmation-overlay">
          <div className="confirmation-box">
            <h3>Supprimer la playlist ?</h3>
            <p>Cette action est irréversible.</p>
            <div className="confirmation-actions">
              <button
                onClick={handleSupprimerPlaylist}
                className="btn-confirmer btn-danger"
              >
                Supprimer
              </button>
              <button
                onClick={() => setAfficherConfirmationSuppression(false)}
                className="btn-annuler"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {modeRenommage && (
        <div className="confirmation-overlay">
          <div className="confirmation-box">
            <h3>Renommer la playlist</h3>
            <input
              type="text"
              value={nouveauNom}
              onChange={(e) => setNouveauNom(e.target.value)}
              className="input-renommer"
              placeholder="Nouveau nom"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleRenommer();
              }}
            />
            <div className="confirmation-actions">
              <button
                onClick={handleRenommer}
                className="btn-confirmer"
              >
                Renommer
              </button>
              <button
                onClick={() => {
                  setModeRenommage(false);
                  setNouveauNom('');
                }}
                className="btn-annuler"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditeurPlaylist;