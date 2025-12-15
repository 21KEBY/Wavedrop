import { prisma } from "../db/prisma";
import { sasService } from "../blob/sas.service";

export const streamingService = {

  async getStreamingUrl(trackId: number) {
    // 1. Récupération de la musique en base
    const track = await prisma.track.findUnique({
      where: { id: trackId },
    });

    if (!track) {
      throw new Error("Musique introuvable");
    }

    // 2. Extraction du nom du fichier depuis l'URL Azure
    const url = new URL(track.audioUrl);
    const containerName = url.pathname.split("/")[1];
    const blobName = url.pathname.split("/").slice(2).join("/");

    // 3. Génération du lien SAS
    return sasService.generateAudioSAS(containerName, blobName);
  },
};
