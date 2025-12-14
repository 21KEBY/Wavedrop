import { api } from './api';

export const musiquesService = {
  // Récupérer toutes les musiques
  obtenirToutesLesMusiques: async () => {
    return api.get('/tracks');
  },

  // Récupérer une musique spécifique
  obtenirMusique: async (id) => {
    return api.get(`/tracks/${id}`);
  },

  // Rechercher des musiques
  rechercherMusiques: async (query) => {
    return api.get(`/tracks?search=${encodeURIComponent(query)}`);
  },

  // Récupérer toutes les playlists
  obtenirPlaylists: async () => {
    return api.get('/playlists');
  },

  // Créer une nouvelle playlist
  creerPlaylist: async (nom) => {
    return api.post('/playlists', { nom });
  },

  // Ajouter une musique à une playlist
  ajouterMusiqueAPlaylist: async (playlistId, musiqueId) => {
    return api.post(`/playlists/${playlistId}/add`, { trackId: musiqueId });
  },

  // Retirer une musique d'une playlist
  retirerMusiqueDPlaylist: async (playlistId, musiqueId) => {
    return api.delete(`/playlists/${playlistId}/remove/${musiqueId}`);
  },
};