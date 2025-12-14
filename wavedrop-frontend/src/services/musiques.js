import { api } from './api';
import { mockMusiquesService } from './mockData';

// MODE DÉVELOPPEMENT : Utiliser les données fictives
const MODE_DEV = false;

export const musiquesService = MODE_DEV ? mockMusiquesService : {
  obtenirToutesLesMusiques: async () => {
    // Backend: GET /tracks/connected (route protégée - affiche musiques publiques + uploads user)
    const tracks = await api.get('/tracks/connected');
    // Transformer les données backend → frontend
    return tracks.map(track => ({
      id: track.id,
      titre: track.title,
      artiste: track.artistName || 'Artiste inconnu',
      duree: track.duration || 0,
      urlCover: track.coverUrl,
      urlAudio: track.audioUrl,
      isUserUpload: track.isUserUpload
    }));
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
    return api.post('/playlists', { name: nom });  // Backend attend "name"
  },

  supprimerPlaylist: async (playlistId) => {
    // Backend: DELETE /playlists/:id
    return api.delete(`/playlists/${playlistId}`);
  },

  renommerPlaylist: async (playlistId, nouveauNom) => {
    // Backend: PUT /playlists/:id
    return api.put(`/playlists/${playlistId}`, { name: nouveauNom });
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