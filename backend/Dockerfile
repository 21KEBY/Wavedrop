FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY src ./src
COPY tsconfig.json ./
ENV DATABASE_URL="sqlserver://sql-wavedrop-001.database.windows.net:1433;database=wavedrop-db;user=waveadmin;password=SuperStrongPassword!123;encrypt=true;trustServerCertificate=false;connectionTimeout=30"
RUN npx prisma generate
RUN npm run build
ENV NODE_ENV=production
CMD ["node", "dist/app.js"]
