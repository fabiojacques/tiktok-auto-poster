const express = require("express");
const { google } = require("googleapis");

const app = express();
const PORT = process.env.PORT || 3000;

// Google Drive usando API KEY
const drive = google.drive({
  version: "v3",
  auth: process.env.GOOGLE_API_KEY,
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Listar pastas públicas
app.get("/api/folders", async (req, res) => {
  try {
    const parent = req.query.parent || "root";

    const response = await drive.files.list({
      q: `'${parent}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: "files(id, name)",
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });

    res.json(response.data.files);
  } catch (error) {
    console.error("Erro Drive:", error.message);
    res.status(500).json({ error: "Erro ao buscar pastas" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
