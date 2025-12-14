import { prisma } from "../db/prisma.ts";

export const uploadRepository = {

  // Création d'une musique en base
  createTrack(data: {
    title: string;
    artistName: string;
    audioUrl: string;
    coverUrl?: string;
    uploadedById: number;
  }) {
    return prisma.track.create({
      data: {
        title: data.title,
        artistName: data.artistName,
        audioUrl: data.audioUrl,
        coverUrl: data.coverUrl,
        isUserUpload: true,
        uploadedById: data.uploadedById,
      },
    });
  },
};
