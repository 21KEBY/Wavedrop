import { blobService } from "../blob/blob.service.ts";
import { uploadRepository } from "../reponsitory/upload.respository.ts";

export const uploadService = {

  async uploadMusic(
    userId: number,
    title: string,
    artistName: string,
    audioFile: Express.Multer.File,
    coverFile?: Express.Multer.File
  ) {
    // 1. Upload audio sur Azure Blob
    const audioUrl = await blobService.uploadAudio(audioFile);

    // 2. Upload cover (si fournie)
    let coverUrl: string | undefined;
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
  },
};
