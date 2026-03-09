// (Documentação automaticamente gerada pelo Copilot)
require("dotenv").config();

const { app, connectDB } = require("./src/app");

const port = process.env.PORT || 3000;
const retryDelayMs = 5000;

/**
 * Inicia o servidor HTTP na porta configurada por ambiente.
 */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

/**
 * Tenta conectar no MongoDB e agenda nova tentativa em caso de falha.
 * @returns {Promise<void>}
 */
async function startMongoConnection() {
  try {
    await connectDB();
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection failed");
    console.error(error.message);
    setTimeout(startMongoConnection, retryDelayMs);
  }
}

startMongoConnection();
