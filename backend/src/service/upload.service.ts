import { blobService } from "../blob/blob.service";
import { uploadRepository } from "../reponsitory/upload.respository";

export const uploadService = {

  async uploadMusic(
    userId: number,
    title: string,
    artistName: string,
    audioFile: Express.Multer.File,
    coverFile?: Express.Multer.File
  ) {
    let audioUrl: string | undefined;
    let coverUrl: string | undefined;

    try {
      // 1. Upload audio sur Azure Blob
      audioUrl = await blobService.uploadAudio(audioFile);

      // 2. Upload cover (si fournie)
      if (coverFile) {
        coverUrl = await blobService.uploadCover(coverFile);
      }

      // 3. Enregistrement en base de données
      const track = await uploadRepository.createTrack({
        title,
        artistName,
        audioUrl,
        coverUrl,
        uploadedById: userId,
      });

      return track;
      
    } catch (error) {
      // En cas d'échec, supprimer les blobs uploadés
      console.error('Échec upload, nettoyage des blobs...');
      
      if (audioUrl) {
        await blobService.deleteBlob('audios', audioUrl).catch(console.error);
      }
      if (coverUrl) {
        await blobService.deleteBlob('covers', coverUrl).catch(console.error);
      }
      
      throw error;
    }
  },
};
