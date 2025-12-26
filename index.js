require("dotenv").config();
const express = require("express");
const { google } = require("googleapis");

const app = express();
const PORT = process.env.PORT || 3000;

// ============================
// GOOGLE AUTH (SEGURO)
// ============================
let drive = null;

try {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT não definido");
  }

  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

  // Corrige quebra de linha da private_key
  credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  drive = google.drive({ version: "v3", auth });

  console.log("✅ Google Drive conectado com sucesso");

} catch (err) {
  console.error("❌ ERRO AO INICIALIZAR GOOGLE DRIVE:");
  console.error(err.message);
}

// ============================
// HEALTH
// ============================
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ============================
// LISTAR PASTAS
// ============================
app.get("/api/folders", async (req, res) => {
  if (!drive) {
    return res.status(500).json({
      error: "Google Drive não inicializado",
    });
  }

  try {
    const parent = req.query.parent || "root";

    const response = await drive.files.list({
      q: `'${parent}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: "files(id, name)",
    });

    res.json(response.data.files);
  } catch (error) {
    console.error("Erro ao buscar pastas:", error);
    res.status(500).json({ error: "Erro ao buscar pastas" });
  }
});

// ============================
// LISTAR VÍDEOS
// ============================
app.get("/api/videos", async (req, res) => {
  if (!drive) {
    return res.status(500).json({
      error: "Google Drive não inicializado",
    });
  }

  const { folderId } = req.query;

  if (!folderId) {
    return res.status(400).json({ error: "folderId é obrigatório" });
  }

  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'video/' and trashed = false`,
      fields: "files(id, name, webViewLink)",
    });

    res.json(response.data.files);
  } catch (error) {
    console.error("Erro ao buscar vídeos:", error);
    res.status(500).json({ error: "Erro ao buscar vídeos" });
  }
});

// ============================
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
