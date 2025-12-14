import express from "express";
import cors from "cors";
import authRoutes from "./routes/inscription.routes.ts";
import connectionRoutes from "./routes/connection.routes.ts";
import tracksRoutes from "./routes/tracks.routes.ts";
import uploadRoutes from "./routes/upload.routes.ts";
import playlistsRoutes from "./routes/playlists.routes.ts";
import streamingRoutes from "./routes/streaming.routes.ts";
const app = express();

app.use(express.json());
app.use(cors());

// Routes auth
app.use("/auth", authRoutes);
app.use("/connection", connectionRoutes);
app.use("/tracks", tracksRoutes);
app.use("/upload", uploadRoutes);
app.use("/playlists", playlistsRoutes);
app.use("/streaming", streamingRoutes);

app.listen(3000, () => {
  console.log("API running on port 3000");
});
