require("dotenv").config();
const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================
// SERVIR ARQUIVOS ESTÁTICOS
// ==========================
app.use(express.static(path.join(__dirname, "public")));

// ==========================
// CONFIG TIKTOK
// ==========================
const CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
const CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;
const REDIRECT_URI = process.env.TIKTOK_REDIRECT_URI;

// ==========================
// HEALTH
// ==========================
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ==========================
// LISTA DE VÍDEOS
// ==========================
const videos = [
  "https://drive.google.com/file/d/1ai6woPeAJKa2weM72BZJPcL3RhlOqV7K/view",
  "https://drive.google.com/file/d/1qcquC86pDeGvJW9xYp0muJRN1atj-qhB/view",
  "https://drive.google.com/file/d/1bJcORB48b05JpVZWaz4OBHCnwialGKGJ/view"
  // (pode continuar...)
];

app.get("/api/videos", (req, res) => {
  res.json(videos);
});

// ==========================
// LOGIN TIKTOK
// ==========================
app.get("/auth/tiktok", (req, res) => {
  if (!CLIENT_KEY || !REDIRECT_URI) {
    return res.status(500).json({
      error: "CLIENT_KEY ou REDIRECT_URI não configurados",
    });
  }

  const url =
    `https://www.tiktok.com/v2/auth/authorize/` +
    `?client_key=${CLIENT_KEY}` +
    `&scope=user.info.basic,video.list` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&state=geniun`;

  res.redirect(url);
});

// ==========================
// CALLBACK TIKTOK
// ==========================
app.get("/auth/tiktok/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({
      error: "Código de autorização não recebido",
    });
  }

  try {
    const response = await axios.post(
      "https://open.tiktokapis.com/v2/oauth/token/",
      {
        client_key: CLIENT_KEY,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      message: "Autenticado com sucesso!",
      data: response.data,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({
      error: "Erro ao autenticar com TikTok",
      details: err.response?.data || err.message,
    });
  }
});

// ==========================
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
