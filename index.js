require("dotenv").config();
const express = require("express");
const { google } = require("googleapis");

const app = express();
const PORT = process.env.PORT || 3000;

// ============================
// HEALTH CHECK (SEMPRE FUNCIONA)
// ============================
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ============================
// FUNÇÃO SEGURA PARA GOOGLE AUTH
// ============================
function getDriveClient() {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT não definida");
  }

  let credentials;

  try {
    credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
    credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");
  } catch (err) {
    console.error("Erro ao ler credenciais:", err);
    throw new Error("Credenciais inválidas");
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  return google.drive({ version: "v3", auth });
}

// ============================
// LISTAR PASTAS
// ============================
app.get("/api/folders", async (req, res) => {
  try {
    const drive = getDriveClient();
    const parent = req.query.parent || "root";

    const response = await drive.files.list({
      q: `'${parent}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: "files(id, name)",
    });

    res.json(response.data.files);
  } catch (error) {
    console.error("Erro ao listar pastas:", error);
    res.status(500).json({ error: error.message });
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

    const drive = getDriveClient();

    const response = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'video/' and trashed = false`,
      fields: "files(id, name, webViewLink)",
    });

    res.json(response.data.files);
  } catch (error) {
    console.error("Erro ao listar vídeos:", error);
    res.status(500).json({ error: error.message });
  }
});

// ============================
// START SERVER
// ============================
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
