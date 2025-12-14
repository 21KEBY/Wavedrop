import { playlistsRepository } from "../reponsitory/playlists.respository.ts";

export const playlistsService = {

  // Création playlist
  create(userId: number, name: string) {
    if (!name) {
      throw new Error("Nom de playlist obligatoire");
    }
    return playlistsRepository.createPlaylist(userId, name);
  },

  // Suppression playlist
  delete(userId: number, playlistId: number) {
    return playlistsRepository.deletePlaylist(playlistId, userId);
  },

  // Liste des playlists utilisateur
  getAll(userId: number) {
    return playlistsRepository.getUserPlaylists(userId);
  },

  // Ajout musique
  addTrack(playlistId: number, trackId: number) {
    return playlistsRepository.addTrackToPlaylist(playlistId, trackId);
  },

  // Suppression musique
  removeTrack(playlistId: number, trackId: number) {
    return playlistsRepository.removeTrackFromPlaylist(playlistId, trackId);
  },
};
