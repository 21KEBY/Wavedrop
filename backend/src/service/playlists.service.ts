import { playlistsRepository } from "../reponsitory/playlists.respository";

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

  // Renommer playlist
  update(userId: number, playlistId: number, name: string) {
    if (!name) {
      throw new Error("Nom de playlist obligatoire");
    }
    return playlistsRepository.updatePlaylistName(playlistId, userId, name);
  },

  // Liste des playlists utilisateur
  getAll(userId: number) {
    return playlistsRepository.getUserPlaylists(userId);
  },

  // Ajout musique
  async addTrack(playlistId: number, trackId: number) {
    // Vérifier si la musique est déjà dans la playlist
    const exists = await playlistsRepository.trackExistsInPlaylist(playlistId, trackId);
    if (exists) {
      throw new Error("Cette musique est déjà dans la playlist");
    }
    return playlistsRepository.addTrackToPlaylist(playlistId, trackId);
  },

  // Suppression musique
  removeTrack(playlistId: number, trackId: number) {
    return playlistsRepository.removeTrackFromPlaylist(playlistId, trackId);
  },
};
