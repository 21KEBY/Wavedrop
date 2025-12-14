import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export interface ConnectionRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const requireConnection = (
  req: ConnectionRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
};
