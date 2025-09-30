const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000; // usa a porta do Render ou 3000 localmente

// Middlewares
app.use(cors()); // permite que qualquer frontend envie requisições
app.use(bodyParser.json());

// Caminho do arquivo pendentes.json
const pendentesPath = path.join(__dirname, "pendentes.json");

// Responder preflight OPTIONS (necessário para POST com JSON)
app.options("/backend/pendentes", (req, res) => res.sendStatus(200));

// GET pendentes
app.get("/backend/pendentes", (req, res) => {
  let pendentes = [];
  if (fs.existsSync(pendentesPath)) {
    try {
      pendentes = JSON.parse(fs.readFileSync(pendentesPath));
    } catch (err) {
      console.error("Erro ao ler pendentes.json:", err);
    }
  }
  res.json(pendentes);
});

// POST pendente
app.post("/backend/pendentes", (req, res) => {
  const novo = req.body;

  // Validação simples
  if (!novo || !novo.nome || !novo.idade) {
    return res.status(400).json({ message: "Pendente inválido" });
  }

  let pendentes = [];
  if (fs.existsSync(pendentesPath)) {
    try {
      pendentes = JSON.parse(fs.readFileSync(pendentesPath));
    } catch (err) {
      console.error("Erro ao ler pendentes.json:", err);
    }
  }

  pendentes.push(novo);

  try {
    fs.writeFileSync(pendentesPath, JSON.stringify(pendentes, null, 2));
  } catch (err) {
    console.error("Erro ao salvar pendentes.json:", err);
    return res.status(500).json({ message: "Erro ao salvar pendente" });
  }

  res.status(201).json({ message: "Pendente adicionado!", data: novo });
});

// Inicia servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
