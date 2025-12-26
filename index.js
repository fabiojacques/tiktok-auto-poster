const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// ⚠️ SUA API KEY DO GOOGLE (coloque no Railway)
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// ID da pasta raiz do Drive
const ROOT_FOLDER_ID = "12pp9vYLhUlkNOir8NFQbv0c2rwixrQsQ";

// ============================
// HEALTH CHECK
// ============================
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ============================
// LISTAR SUBPASTAS
// ============================
app.get("/api/folders", async (req, res) => {
  try {
    const parent = req.query.parent || ROOT_FOLDER_ID;

    const url = `https://www.googleapis.com/drive/v3/files?q='${parent}'+in+parents+and+mimeType='application/vnd.google-apps.folder'+and+trashed=false&fields=files(id,name)&supportsAllDrives=true&includeItemsFromAllDrives=true&key=${GOOGLE_API_KEY}`;

    const response = await axios.get(url);

    res.json(response.data.files);
  } catch (err) {
    console.error("Erro ao buscar pastas:", err.response?.data || err.message);
    res.status(500).json({ error: "Erro ao buscar pastas" });
  }
});

// ============================
// LISTAR VÍDEOS
// ============================
app.get("/api/videos", async (req, res) => {
  try {
    const folderId = req.query.folderId;

    if (!folderId) {
      return res.status(400).json({ error: "folderId é obrigatório" });
    }

    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType contains 'video/'&fields=files(id,name,webViewLink)&supportsAllDrives=true&includeItemsFromAllDrives=true&key=${GOOGLE_API_KEY}`;

    const response = await axios.get(url);

    res.json(response.data.files);
  } catch (err) {
    console.error("Erro ao buscar vídeos:", err.response?.data || err.message);
    res.status(500).json({ error: "Erro ao buscar vídeos" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
