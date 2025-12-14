import { BlobServiceClient } from "@azure/storage-blob";
import { v4 as uuid } from "uuid";

// Connexion Azure Blob
const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING!
);

// Conteneurs Azure
const audioContainer = "audios";
const imageContainer = "covers";

export const blobService = {

  // Upload du fichier audio
  async uploadAudio(file: { buffer: Buffer; originalname: string }) {
    const containerClient =
      blobServiceClient.getContainerClient(audioContainer);

    await containerClient.createIfNotExists();

    const blobName = `${uuid()}-${file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(file.buffer);

    return blockBlobClient.url;
  },

  // Upload de l'image de couverture (optionnelle)
  async uploadCover(file: { buffer: Buffer; originalname: string }) {
    const containerClient =
      blobServiceClient.getContainerClient(imageContainer);

    await containerClient.createIfNotExists();

    const blobName = `${uuid()}-${file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(file.buffer);

    return blockBlobClient.url;
  },
};
