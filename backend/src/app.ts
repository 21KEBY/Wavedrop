import express from "express";
import cors from "cors";
import authRoutes from "./routes/inscription.routes";
import connectionRoutes from "./routes/connection.routes";
import tracksRoutes from "./routes/tracks.routes";
import uploadRoutes from "./routes/upload.routes";
import playlistsRoutes from "./routes/playlists.routes";
import streamingRoutes from "./routes/streaming.routes";
const app = express();

app.use(express.json());
app.use(cors());

// Routes auth
app.use("/auth", authRoutes);
app.use("/connection", connectionRoutes);
app.use("/tracks", tracksRoutes);
app.use("/upload", uploadRoutes);
app.use("/playlists", playlistsRoutes);
app.use("/tracks", streamingRoutes);

app.listen(3000, () => {
  console.log("API running on port 3000");
});
