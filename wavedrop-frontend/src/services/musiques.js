import { api } from './api';
import { mockMusiquesService } from './mockData';

// MODE DÉVELOPPEMENT : Utiliser les données fictives
const MODE_DEV = false;

export const musiquesService = MODE_DEV ? mockMusiquesService : {
  obtenirToutesLesMusiques: async () => {
    // Backend: GET /tracks/public (route publique)
    return api.get('/tracks/public');
  },

  obtenirMusique: async (id) => {
    return api.get(`/tracks/${id}`);
  },

  rechercherMusiques: async (query) => {
    return api.get(`/tracks?search=${encodeURIComponent(query)}`);
  },

  obtenirPlaylists: async () => {
    // Backend: GET /playlists (route protégée)
    return api.get('/playlists');
  },

  creerPlaylist: async (nom) => {
    // Backend: POST /playlists
    return api.post('/playlists', { nom });
  },

  ajouterMusiqueAPlaylist: async (playlistId, musiqueId) => {
    // Backend: POST /playlists/:id/tracks
    return api.post(`/playlists/${playlistId}/tracks`, { trackId: musiqueId });
  },

  retirerMusiqueDPlaylist: async (playlistId, musiqueId) => {
    // Backend: DELETE /playlists/:id/tracks/:trackId
    return api.delete(`/playlists/${playlistId}/tracks/${musiqueId}`);
  },

  uploadMusique: async (formData) => {
    // Backend: POST /upload (route protégée, FormData)
    return api.postFormData('/upload', formData);
  },
};