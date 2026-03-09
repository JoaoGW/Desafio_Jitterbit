// (Documentação automaticamente gerada pelo Copilot)
const mongoose = require("mongoose");

// Schema basico de usuario para login e geracao de token.
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", UserSchema);
