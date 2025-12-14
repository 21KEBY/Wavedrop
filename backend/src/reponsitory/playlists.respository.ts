import { prisma } from "../db/prisma.ts";

export const playlistsRepository = {

  // Création d'une playlist
  createPlaylist(userId: number, name: string) {
    return prisma.playlist.create({
      data: {
        name,
        userId,
      },
    });
  },

  // Suppression d'une playlist
  deletePlaylist(playlistId: number, userId: number) {
    return prisma.playlist.deleteMany({
      where: {
        id: playlistId,
        userId, // sécurité : seul le propriétaire peut supprimer
      },
    });
  },

  // Récupérer toutes les playlists d'un utilisateur
  getUserPlaylists(userId: number) {
    return prisma.playlist.findMany({
      where: { userId },
      include: {
        tracks: {
          include: {
            track: true,
          },
        },
      },
    });
  },

  // Ajouter une musique à une playlist
  addTrackToPlaylist(playlistId: number, trackId: number) {
    return prisma.playlistTrack.create({
      data: {
        playlistId,
        trackId,
      },
    });
  },

  // Retirer une musique d'une playlist
  removeTrackFromPlaylist(playlistId: number, trackId: number) {
    return prisma.playlistTrack.deleteMany({
      where: {
        playlistId,
        trackId,
      },
    });
  },
};
