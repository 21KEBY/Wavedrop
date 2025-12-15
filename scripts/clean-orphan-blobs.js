// Script pour supprimer les blobs Azure orphelins (non référencés en DB)
import { PrismaClient } from '@prisma/client';
import { BlobServiceClient } from '@azure/storage-blob';
import dotenv from 'dotenv';

dotenv.config({ path: '../backend/.env' });

const prisma = new PrismaClient();
const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

async function cleanOrphanBlobs() {
  console.log('Recherche des blobs orphelins...\n');

  // 1. Récupérer toutes les URLs en DB
  const tracks = await prisma.track.findMany({
    select: { audioUrl: true, coverUrl: true }
  });

  const usedAudioUrls = new Set(tracks.map(t => t.audioUrl));
  const usedCoverUrls = new Set(tracks.filter(t => t.coverUrl).map(t => t.coverUrl));

  console.log(`${usedAudioUrls.size} fichiers audio référencés en DB`);
  console.log(`${usedCoverUrls.size} fichiers cover référencés en DB\n`);

  // 2. Nettoyer container 'audios'
  const audioContainer = blobServiceClient.getContainerClient('audios');
  let audioOrphans = 0;

  for await (const blob of audioContainer.listBlobsFlat()) {
    const blobUrl = `https://${process.env.STORAGE_ACCOUNT_NAME}.blob.core.windows.net/audios/${blob.name}`;
    
    if (!usedAudioUrls.has(blobUrl)) {
      console.log(`  Suppression audio orphelin: ${blob.name}`);
      await audioContainer.deleteBlob(blob.name);
      audioOrphans++;
    }
  }

  // 3. Nettoyer container 'covers'
  const coverContainer = blobServiceClient.getContainerClient('covers');
  let coverOrphans = 0;

  for await (const blob of coverContainer.listBlobsFlat()) {
    const blobUrl = `https://${process.env.STORAGE_ACCOUNT_NAME}.blob.core.windows.net/covers/${blob.name}`;
    
    if (!usedCoverUrls.has(blobUrl)) {
      console.log(`  Suppression cover orphelin: ${blob.name}`);
      await coverContainer.deleteBlob(blob.name);
      coverOrphans++;
    }
  }

  console.log(`\nNettoyage terminé:`);
  console.log(`   - ${audioOrphans} fichiers audio supprimés`);
  console.log(`   - ${coverOrphans} fichiers cover supprimés`);

  await prisma.$disconnect();
}

cleanOrphanBlobs().catch(console.error);
