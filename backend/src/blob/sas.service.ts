import {
  BlobServiceClient,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";

// Nom du storage account injecté par App Service
const storageAccountName = process.env.STORAGE_ACCOUNT_NAME!;
if (!storageAccountName) {
  throw new Error("STORAGE_ACCOUNT_NAME is not defined");
}

// Client Blob via Managed Identity
const blobServiceClient = new BlobServiceClient(
  `https://${storageAccountName}.blob.core.windows.net`,
  new DefaultAzureCredential()
);

export const sasService = {

  // Génère un SAS temporaire en lecture seule
  async generateAudioSAS(containerName: string, blobName: string) {
    const startsOn = new Date();
    const expiresOn = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    // Clé de délégation utilisateur (Managed Identity)
    const userDelegationKey = await blobServiceClient.getUserDelegationKey(
      startsOn,
      expiresOn
    );

    const sas = generateBlobSASQueryParameters(
      {
        containerName,
        blobName,
        permissions: BlobSASPermissions.parse("r"),
        startsOn,
        expiresOn,
      },
      userDelegationKey,
      storageAccountName
    ).toString();

    return `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blobName}?${sas}`;
  },
};
