// (Documentação automaticamente gerada pelo Copilot)
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
// Chave usada para assinar e validar o token JWT
const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret";

/**
 * Registra um novo usuario com senha criptografada.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<import("express").Response>}
 */
router.post("/register", async (req, res) => {
  try {
    // Pega os dados de cadastro do body
    const { username, password } = req.body || {};

    // Valida campos obrigatorios
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Campos obrigatorios: username e password." });
    }

    // Verifica se ja existe usuario com esse username
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(409).json({ message: "Usuario ja existe." });
    }

    // Criptografa a senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);

    // Salva novo usuario no banco
    await User.create({ username, password: hashedPassword });

    return res.status(201).json({ message: "Usuario criado com sucesso." });
  } catch (error) {
    // Erro generico no cadastro
    return res
      .status(500)
      .json({ message: "Erro ao registrar usuario", error: error.message });
  }
});

/**
 * Autentica o usuario e retorna um token JWT valido por 1 hora.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<import("express").Response>}
 */
router.post("/login", async (req, res) => {
  try {
    // Pega credenciais enviadas no body
    const { username, password } = req.body || {};

    // Valida campos obrigatorios
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Campos obrigatorios: username e password." });
    }

    // Busca usuario pelo username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Credenciais invalidas." });
    }

    // Compara senha informada com senha salva (hash)
    const passwordOk = await bcrypt.compare(password, user.password);
    if (!passwordOk) {
      return res.status(401).json({ message: "Credenciais invalidas." });
    }

    // Gera token JWT com dados basicos do usuario
    const token = jwt.sign(
      { id: user._id.toString(), username: user.username },
      JWT_SECRET,
      // Token expira em 1 hora
      { expiresIn: "1h" },
    );

    return res.status(200).json({ token });
  } catch (error) {
    // Erro generico no login
    return res
      .status(500)
      .json({ message: "Erro ao fazer login", error: error.message });
  }
});

module.exports = router;
