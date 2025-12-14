import { prisma } from "../db/prisma";

export const tracksRepository = {

  // 🔓 Récupère UNIQUEMENT les musiques publiques
  // Utilisé pour l'accueil quand l'utilisateur n'est PAS connecté
  getPublicTracks() {
    return prisma.track.findMany({
      where: {
        isUserUpload: false, // musiques déjà présentes sur la plateforme
      },
      orderBy: {
        createdAt: "desc", // les plus récentes en premier
      },
    });
  },

  // 🔐 Récupère les musiques visibles par un utilisateur connecté
  // → musiques publiques + musiques uploadées par l'utilisateur
  getTracksForUser(userId: number) {
    return prisma.track.findMany({
      where: {
        OR: [
          { isUserUpload: false }, // musiques publiques
          { uploadedById: userId } // musiques personnelles
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
};
