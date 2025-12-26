const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// Rota raiz (teste)
app.get("/", (req, res) => {
  res.send("🚀 TikTok Auto Poster rodando com sucesso!");
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
