import express from "express";
import cors from "cors";
import authRoutes from "./routes/inscription.routes";
import connectionRoutes from "./routes/connection.routes";
import tracksRoutes from "./routes/tracks.routes";
import uploadRoutes from "./routes/upload.routes";
import playlistsRoutes from "./routes/playlists.routes";
import streamingRoutes from "./routes/streaming.routes";
import downloadRoutes from "./routes/download.routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'development' 
    ? true  // Dev: accepte tous les origins (localhost:XXXX)
    : process.env.FRONTEND_URL,  // Prod: URL Azure uniquement
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes auth
app.use("/auth", authRoutes);
app.use("/connection", connectionRoutes);
app.use("/tracks", tracksRoutes);
app.use("/upload", uploadRoutes);
app.use("/playlists", playlistsRoutes);
app.use("/streaming", streamingRoutes);
app.use("/download", downloadRoutes);

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
