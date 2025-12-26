require("dotenv").config();
const express = require("express");
const { google } = require("googleapis");

const app = express();
const PORT = process.env.PORT || 3000;

// ============================
// GOOGLE AUTH (CORRETO)
// ============================
let drive;

try {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT não definido");
  }

  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

  // Corrige quebras de linha da private_key
  credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");

  const auth = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ["https://www.googleapis.com/auth/drive.readonly"]
  );

  drive = google.drive({
    version: "v3",
    auth,
  });

  console.log("✅ Google Drive conectado com sucesso");
} catch (err) {
  console.error("❌ Erro ao iniciar Google Drive:", err.message);
}

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
    if (!drive) {
      return res.status(500).json({ error: "Google Drive não inicializado" });
    }

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

// ============================
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
