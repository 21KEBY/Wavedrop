import React, { useState } from 'react';
import { usePlaylists } from '../hooks/usePlaylists';
import EditeurPlaylist from '../components/Playlists/EditeurPlaylist';
import { Plus, Music2 } from 'lucide-react';
import './MesPlaylists.css';

const MesPlaylists = () => {
  const { playlists, chargement, creerPlaylist } = usePlaylists();
  const [playlistSelectionnee, setPlaylistSelectionnee] = useState(null);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [nomNouvellePlaylist, setNomNouvellePlaylist] = useState('');
  const [erreur, setErreur] = useState('');

  const handleCreerPlaylist = async (e) => {
    e.preventDefault();
    setErreur('');

    if (!nomNouvellePlaylist.trim()) {
      setErreur('Le nom de la playlist ne peut pas être vide');
      return;
    }

    try {
      await creerPlaylist(nomNouvellePlaylist);
      setNomNouvellePlaylist('');
      setAfficherFormulaire(false);
    } catch (error) {
      setErreur('Erreur lors de la création de la playlist');
    }
  };

  const handleSelectionnerPlaylist = (playlist) => {
    setPlaylistSelectionnee(playlist);
  };

  if (chargement) {
    return (
      <div className="playlists-page">
        <div className="playlists-chargement">
          <div className="spinner"></div>
          <p>Chargement de vos playlists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="playlists-page">
      <div className="playlists-container">
        <aside className="playlists-sidebar">
          <div className="sidebar-header">
            <h2>Mes Playlists</h2>
            <button
              onClick={() => setAfficherFormulaire(!afficherFormulaire)}
              className="btn-nouvelle-playlist"
              title="Créer une playlist"
            >
              <Plus size={20} />
            </button>
          </div>

          {afficherFormulaire && (
            <form onSubmit={handleCreerPlaylist} className="formulaire-playlist">
              {erreur && <div className="formulaire-erreur">{erreur}</div>}
              <input
                type="text"
                placeholder="Nom de la playlist"
                value={nomNouvellePlaylist}
                onChange={(e) => setNomNouvellePlaylist(e.target.value)}
                className="input-nom-playlist"
                autoFocus
              />
              <div className="formulaire-actions">
                <button type="submit" className="btn-creer">Créer</button>
                <button
                  type="button"
                  onClick={() => {
                    setAfficherFormulaire(false);
                    setNomNouvellePlaylist('');
                    setErreur('');
                  }}
                  className="btn-annuler-form"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}

          <div className="liste-playlists">
            {!playlists || playlists.length === 0 ? (
              <div className="playlists-vide">
                <Music2 size={48} className="icon-vide" />
                <p>Aucune playlist</p>
                <p className="texte-aide">Créez votre première playlist !</p>
              </div>
            ) : (
              playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  onClick={() => handleSelectionnerPlaylist(playlist)}
                  className={`playlist-item ${
                    playlistSelectionnee?.id === playlist.id ? 'active' : ''
                  }`}
                >
                  <div className="playlist-icon">
                    <Music2 size={24} />
                  </div>
                  <div className="playlist-info">
                    <h3>{playlist.nom}</h3>
                    <p>{playlist.musiques?.length || 0} musiques</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        <main className="playlists-content">
          {playlistSelectionnee ? (
            <EditeurPlaylist playlist={playlistSelectionnee} />
          ) : (
            <div className="playlists-placeholder">
              <Music2 size={64} className="icon-placeholder" />
              <h2>Sélectionnez une playlist</h2>
              <p>Choisissez une playlist dans la liste pour la modifier</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MesPlaylists;