require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

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
// LISTA DE VÍDEOS (SIMPLIFICADO)
// ==========================
const videos = [
   "https://drive.google.com/file/d/1ai6woPeAJKa2weM72BZJPcL3RhlOqV7K/view",
  "https://drive.google.com/file/d/1qcquC86pDeGvJW9xYp0muJRN1atj-qhB/view",
  "https://drive.google.com/file/d/1bJcORB48b05JpVZWaz4OBHCnwialGKGJ/view",
  "https://drive.google.com/file/d/1CS5GTlg14Or877hCbhqpBrkeoMYyszkB/view",
  "https://drive.google.com/file/d/1tPoaQeokkTttxjhj40XhNplbX95H5lU5/view",
  "https://drive.google.com/file/d/1qA8Co40qYzfboY3_7-HAhtkmGoyfEg_v/view",
  "https://drive.google.com/file/d/1zKvSxnfa_wTONVzHTQ5tYGHhTE0OUXSO/view",
  "https://drive.google.com/file/d/1pW2qcHezh3rfFgBCgOWt6UxjkBUflClB/view",
  "https://drive.google.com/file/d/19HUUUX4z6tgEhYSfxLe3SbE2BQuXODah/view",
  "https://drive.google.com/file/d/1LrwnzcXUKej28BDTk77xsWM2jKNaoSUl/view",
  "https://drive.google.com/file/d/1Nt2VLR1fLlfucXGLEgCCzrwy0WvLeKvK/view",
  "https://drive.google.com/file/d/1CrCdG7Ir84mZaCBCt__T73GD7NaG_7hp/view",
  "https://drive.google.com/file/d/1MnIQ0vQ7y5yOp28LUZ8y03BpqErZsaSg/view",
  "https://drive.google.com/file/d/1oHqftj8HwO5ZbfYwEid2P6hvAPXX5L1T/view",
  "https://drive.google.com/file/d/17-2IGwT49rcOiP8jGUt-9tQ0teimCjPM/view",
  "https://drive.google.com/file/d/1ydGXKuNQTbqTeR44ip1qXDeMs6Mi4MCE/view",
  "https://drive.google.com/file/d/1yOJnK_9O2EDmaQUCJzex-G-MJAYnp-Ai/view",
  "https://drive.google.com/file/d/1Vz0nwklDgiaNrEU08WR0uSY0RPmfl3Kd/view",
  "https://drive.google.com/file/d/1rjxWRsNMpAOdkEqz5xyG69r2QYoO8vps/view",
  "https://drive.google.com/file/d/1iukZLqJfbrOsJJFrfogYmwfS2s_-1IhI/view",
  "https://drive.google.com/file/d/1G-Ryc7RDitjF9WNayBXCBb5cvuH-h2WC/view",
  "https://drive.google.com/file/d/15xZ0nR9Guu6-dShndg7LX15yx3m3vxtZ/view",
  "https://drive.google.com/file/d/1hJI8J9CU8-GRsjPRQ0atJN2daGtJOat_/view",
  "https://drive.google.com/file/d/1187xwUFjhNywrmzfnueJmLBgYAJm_u_D/view",
  "https://drive.google.com/file/d/10v0CGLyS16Oq8TVqF9vWyVPQWe54Mn1h/view",
  "https://drive.google.com/file/d/1ImN9EwnbQLkrirahYwHrmd2fA19bppV7/view",
  "https://drive.google.com/file/d/1359VE_Xkv2xbpGq6-Ygv-JtNkbL3Dd8Z/view",
  "https://drive.google.com/file/d/1K5RLZhvQDP-LiTzNWFv4Xdg9UZxxFETS/view",
  "https://drive.google.com/file/d/16uHuI0EoU2TUotklagMoob1Lsawy6P9G/view",
  "https://drive.google.com/file/d/1y0m0e8UasEHc0XE9TS7YOcVft3iP0gaI/view",
  "https://drive.google.com/file/d/1Jx-XQHqqjbgH0giJ-EBfVRFYxeRvr9L7/view",
  "https://drive.google.com/file/d/1NApINlrQTubuYWLm6mJXNWrvt7GBA3_a/view",
  "https://drive.google.com/file/d/1yWx6wEbu6WXDfl8JexlZsqoLro3WjLom/view",
  "https://drive.google.com/file/d/1hNHW-5zQpFfTukkj5CTI_2RRu6pTl9yk/view",
  "https://drive.google.com/file/d/1Qx_FkICDyI-i-jIiK-OO5IR3GQfx-6un/view",
  "https://drive.google.com/file/d/1LHAbkz6niTx0ejKKEjSSs4x8AH1obG5A/view",
  "https://drive.google.com/file/d/1ZtDDQbHdw5qBDrtVVnxGnVE6EN_-_XsW/view",
  "https://drive.google.com/file/d/1jFAqevl-35hCWP12UGSvm_T7w35QzNn2/view",
  "https://drive.google.com/file/d/1JpXWbdVd6eDAo71B3Mt1hNxNGFR40Hdp/view",
  "https://drive.google.com/file/d/1vZw0I__8hv-Ww4sbluTd2Zlb3Vw3wyed/view",
  "https://drive.google.com/file/d/18XvsSIm6U0FKcVre5Se0jCXg28MyTmC6/view",
  "https://drive.google.com/file/d/127Xo5FkB7wTheJNiaJj7WJOtXGPrSk63/view",
  "https://drive.google.com/file/d/1FlEVDRy9uoseHFWvBLS3ieh6iFPA6SYW/view",
  "https://drive.google.com/file/d/1xpKXPgYzWlufUmn5AaVAdFHaLn0c45TI/view",
  "https://drive.google.com/file/d/19_HjX3wW_HgMisDlh_bpk5QpQ53EpM_f/view",
  "https://drive.google.com/file/d/1fR9sP3TNYQYe3tvZq_gxUtkEE2IbQ8GS/view",
  "https://drive.google.com/file/d/19nH1AAkfbEOQFUP3XW078DMIltly-qnQ/view",
  "https://drive.google.com/file/d/1aIknPGOd2ecgwq-AeEdiKHiPbvLYi0qY/view",
  "https://drive.google.com/file/d/1HLibYKNV_PWyX-af9DZg2hqUbgz3b7CC/view",
  "https://drive.google.com/file/d/1zMdT8dray99hKy1oHrMpBxclIzrrWAOr/view"
  // você pode continuar colocando aqui
];

app.get("/api/videos", (req, res) => {
  res.json(videos);
});

// ==========================
// LOGIN COM TIKTOK
// ==========================
app.get("/auth/tiktok", (req, res) => {
  const url =
    `https://www.tiktok.com/v2/auth/authorize/` +
    `?client_key=${CLIENT_KEY}` +
    `&scope=user.info.basic,video.publish` +
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
    res.status(500).json({ error: "Erro ao autenticar com TikTok" });
  }
});

// ==========================
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
