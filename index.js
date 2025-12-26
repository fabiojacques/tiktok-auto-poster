const express = require("express");
const { listFolders, listVideos } = require("./services/googleDrive");

const app = express();
const PORT = process.env.PORT || 3000;

// Rota raiz (teste)
app.get("/", (req, res) => {
  res.send("🚀 TikTok Auto Poster rodando!");
});

// Lista pastas (nichos)
app.get("/api/folders", async (req, res) => {
  try {
    const folders = await listFolders();
    res.json(folders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar pastas" });
  }
});

// Lista vídeos de uma pasta
app.get("/api/videos", async (req, res) => {
  const { folderId } = req.query;

  if (!folderId) {
    return res.status(400).json({ error: "folderId é obrigatório" });
  }

  try {
    const videos = await listVideos(folderId);
    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar vídeos" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
