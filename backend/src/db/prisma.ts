// backend/server/config/prisma.js
import * as Prisma from "@prisma/client";

// Création d'une seule instance de Prisma
const prisma = new Prisma.PrismaClient();

// Export par défaut ET nommé
export default prisma;
export { prisma };
