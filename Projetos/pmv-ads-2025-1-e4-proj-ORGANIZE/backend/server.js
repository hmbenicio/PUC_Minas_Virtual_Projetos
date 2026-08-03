require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Usa a variável DATABASE_URL para conexão com o MongoDB
const mongoUri = process.env.DATABASE_URL || process.env.MONGO_URI;

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error("Erro ao conectar no MongoDB:", err));

app.use(express.json());

// Importa e usa as rotas de usuário
const usersRouter = require("./routes/userRoutes");
app.use("/organize/user", usersRouter);

// Porta configurável via variável de ambiente, padrão 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
