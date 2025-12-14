import { api } from './api';
import { mockMusiquesService } from './mockData';

// MODE DÉVELOPPEMENT : Utiliser les données fictives
const MODE_DEV = true;

export const musiquesService = MODE_DEV ? mockMusiquesService : {
  obtenirToutesLesMusiques: async () => {
    return api.get('/tracks');
  },

  obtenirMusique: async (id) => {
    return api.get(`/tracks/${id}`);
  },

  rechercherMusiques: async (query) => {
    return api.get(`/tracks?search=${encodeURIComponent(query)}`);
  },

  obtenirPlaylists: async () => {
    return api.get('/playlists');
  },

  creerPlaylist: async (nom) => {
    return api.post('/playlists', { nom });
  },

  ajouterMusiqueAPlaylist: async (playlistId, musiqueId) => {
    return api.post(`/playlists/${playlistId}/add`, { trackId: musiqueId });
  },

  retirerMusiqueDPlaylist: async (playlistId, musiqueId) => {
    return api.delete(`/playlists/${playlistId}/remove/${musiqueId}`);
  },

  uploadMusique: async (formData) => {
    return api.postFormData('/tracks/upload', formData);
  },
};