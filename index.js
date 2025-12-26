const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// 👉 COLE SUA API KEY AQUI
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// ============================
// HEALTH CHECK
// ============================
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ============================
// LISTAR PASTAS DO DRIVE (PÚBLICO)
// ============================
app.get("/api/folders", async (req, res) => {
  try {
    const parent = req.query.parent || "root";

    const url = `https://www.googleapis.com/drive/v3/files?q='${parent}'+in+parents+and+mimeType='application/vnd.google-apps.folder'&fields=files(id,name)&key=${GOOGLE_API_KEY}`;

    const response = await axios.get(url);

    res.json(response.data.files);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Erro ao buscar pastas" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
