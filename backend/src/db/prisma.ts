import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaMssql } from '@prisma/adapter-mssql';

// Parser l'URL de connexion SQL Server
const dbUrl = process.env.DATABASE_URL!;
const serverMatch = dbUrl.match(/sqlserver:\/\/([^:;]+):(\d+)/);
const dbMatch = dbUrl.match(/database=([^;]+)/);
const userMatch = dbUrl.match(/user=([^;]+)/);
const passwordMatch = dbUrl.match(/password=([^;]+)/);

if (!serverMatch || !dbMatch || !userMatch || !passwordMatch) {
  throw new Error(`Invalid DATABASE_URL format: ${dbUrl}`);
}

// Configuration pour l'adapter (format tedious)
const config = {
  server: serverMatch[1],
  authentication: {
    type: 'default' as const,
    options: {
      userName: userMatch[1],
      password: passwordMatch[1],
    },
  },
  options: {
    database: dbMatch[1],
    port: parseInt(serverMatch[2]),
    encrypt: true,
    trustServerCertificate: false,
  },
};

// Créer l'adapter avec la config
const adapter = new PrismaMssql(config);

const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Export par défaut ET nommé
export default prisma;
export { prisma };
