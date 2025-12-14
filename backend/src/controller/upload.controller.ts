import { Response } from "express";
import { uploadService } from "../service/upload.service";
import { ConnectionRequest } from "../middleware/connection.middleware";

export const uploadController = {

  async upload(req: ConnectionRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { title, artistName } = req.body;

      // Normalize multer's req.files which can be Express.Multer.File[] or { [fieldname: string]: Express.Multer.File[] }
      const files = req.files as
        | Express.Multer.File[]
        | { [fieldname: string]: Express.Multer.File[] }
        | undefined;

      let audioFile: Express.Multer.File | undefined;
      let coverFile: Express.Multer.File | undefined;

      if (Array.isArray(files)) {
        audioFile = files.find((f) => f.fieldname === "audio");
        coverFile = files.find((f) => f.fieldname === "cover");
      } else {
        audioFile = files?.["audio"]?.[0];
        coverFile = files?.["cover"]?.[0];
      }

      if (!audioFile) {
        return res.status(400).json({
          error: "Fichier audio obligatoire",
        });
      }

      const track = await uploadService.uploadMusic(
        userId,
        title,
        artistName,
        audioFile,
        coverFile
      );

      return res.status(201).json(track);
    } catch (error: any) {
      return res.status(400).json({
        error: error.message,
      });
    }
  },
};
