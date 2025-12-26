require("dotenv").config();
const express = require("express");
const { google } = require("googleapis");

const app = express();
const PORT = process.env.PORT || 3000;

// ============================
// GOOGLE AUTH (SAFE VERSION)
// ============================
let credentials;

try {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT) {
    throw new Error("Variável GOOGLE_SERVICE_ACCOUNT não encontrada.");
  }

  credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

  // Corrige quebras de linha da private_key
  credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");

} catch (error) {
  console.error("❌ ERRO AO CARREGAR GOOGLE_SERVICE_ACCOUNT");
  console.error(error);
  process.exit(1);
}

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

const drive = google.drive({
  version: "v3",
  auth,
});

// ============================
// HEALTH CHECK
// ============================
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ============================
// LISTAR PASTAS (ROOT OU SUBPASTA)
// ============================
app.get("/api/folders", async (req, res) => {
  try {
    const parent = req.query.parent || "root";

    const response = await drive.files.list({
      q: `'${parent}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: "files(id, name)",
    });

    res.json(response.data.files);
  } catch (error) {
    console.error("❌ Erro ao buscar pastas:", error);
    res.status(500).json({ error: "Erro ao buscar pastas" });
  }
});

// ============================
// LISTAR VÍDEOS DA PASTA
// ============================
app.get("/api/videos", async (req, res) => {
  try {
    const { folderId } = req.query;

    if (!folderId) {
      return res.status(400).json({ error: "folderId é obrigatório" });
    }

    const response = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'video/' and trashed = false`,
      fields: "files(id, name, webViewLink)",
    });

    res.json(response.data.files);
  } catch (error) {
    console.error("❌ Erro ao buscar vídeos:", error);
    res.status(500).json({ error: "Erro ao buscar vídeos" });
  }
});

// ============================
// START SERVER
// ============================
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
