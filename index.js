require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rota principal (teste)
app.get('/', (req, res) => {
  res.send('🚀 TikTok Auto Poster rodando com sucesso!');
});

// Health check (importante pro Railway)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Porta dinâmica (Railway usa isso)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando na porta ${PORT}`);
});
