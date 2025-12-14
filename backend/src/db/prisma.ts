import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// Création de l'adapter pour SQLite avec better-sqlite3
const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});

// Création d'une seule instance de Prisma avec l'adapter
const prisma = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
});

// Export par défaut ET nommé
export default prisma;
export { prisma };
