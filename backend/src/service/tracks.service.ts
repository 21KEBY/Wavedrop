import { tracksRepository } from "../reponsitory/tracks.respository";

export const tracksService = {

  // Accueil PUBLIC
  // Utilisé quand aucun utilisateur n'est connecté
  getPublicHome() {
    return tracksRepository.getPublicTracks();
  },

  // Accueil CONNECTÉ
  // Utilisé quand un utilisateur est authentifié
  getConnectedHome(userId: number) {
    return tracksRepository.getTracksForUser(userId);
  },
};
