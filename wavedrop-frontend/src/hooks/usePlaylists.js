import { useState, useEffect } from 'react';
import { musiquesService } from '../services/musiques';

export const usePlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  const chargerPlaylists = async () => {
    try {
      setChargement(true);
      const data = await musiquesService.obtenirPlaylists();
      setPlaylists(data);
      setErreur(null);
    } catch (error) {
      console.error('Erreur lors du chargement des playlists:', error);
      setErreur(error.message);
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerPlaylists();
  }, []);

  const creerPlaylist = async (nom) => {
    try {
      const nouvellePlaylist = await musiquesService.creerPlaylist(nom);
      setPlaylists([...playlists, nouvellePlaylist]);
      return nouvellePlaylist;
    } catch (error) {
      console.error('Erreur lors de la création de la playlist:', error);
      throw error;
    }
  };

  const ajouterMusique = async (playlistId, musiqueId) => {
    try {
      await musiquesService.ajouterMusiqueAPlaylist(playlistId, musiqueId);
      await chargerPlaylists(); // Recharger pour mettre à jour
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la musique:', error);
      throw error;
    }
  };

  const retirerMusique = async (playlistId, musiqueId) => {
    try {
      await musiquesService.retirerMusiqueDPlaylist(playlistId, musiqueId);
      await chargerPlaylists(); // Recharger pour mettre à jour
    } catch (error) {
      console.error('Erreur lors du retrait de la musique:', error);
      throw error;
    }
  };

  return {
    playlists,
    chargement,
    erreur,
    chargerPlaylists,
    creerPlaylist,
    ajouterMusique,
    retirerMusique,
  };
};

// Export par défaut aussi pour plus de compatibilité
export default usePlaylists;