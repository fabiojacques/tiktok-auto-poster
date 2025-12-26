const express = require("express");
const { google } = require("googleapis");

const app = express();
const PORT = process.env.PORT || 3000;

// ============================
// Google Auth
// ============================
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

const drive = google.drive({ version: "v3", auth });

// ============================
// ROTA PRINCIPAL
// ============================
app.get("/", (req, res) => {
  res.send("🚀 TikTok Auto Poster rodando com sucesso!");
});

// ============================
// HEALTH CHECK
// ============================
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ============================
// LISTAR PASTAS DO DRIVE
// ============================
app.get("/api/folders", async (req, res) => {
  try {
    const parentFolderId = req.query.parent; // opcional

    const q = parentFolderId
      ? `'${parentFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
      : `mimeType = 'application/vnd.google-apps.folder' and trashed = false`;

    const response = await drive.files.list({
      q,
      fields: "files(id, name)",
    });

    res.json(response.data.files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar pastas" });
  }
});

// ============================
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
