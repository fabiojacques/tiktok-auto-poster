require("dotenv").config();
const express = require("express");
const { google } = require("googleapis");

const app = express();
const PORT = process.env.PORT || 3000;

// ============================
// VALIDAR ENV
// ============================
if (!process.env.GOOGLE_SERVICE_ACCOUNT) {
  console.error("❌ GOOGLE_SERVICE_ACCOUNT não definida");
  process.exit(1);
}

let credentials;

try {
  credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

  // Corrige quebra de linha do private_key
  credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");
} catch (err) {
  console.error("❌ Erro ao carregar credenciais:", err);
  process.exit(1);
}

// ============================
// Google Auth
// ============================
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

const drive = google.drive({ version: "v3", auth });

// ============================
// HEALTH CHECK
// ============================
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ============================
// LISTAR PASTAS
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
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar pastas" });
  }
});

// ============================
// LISTAR VÍDEOS
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
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar vídeos" });
  }
});

// ============================
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
