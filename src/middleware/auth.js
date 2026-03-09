// (Documentação automaticamente gerada pelo Copilot)
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret";

/**
 * Middleware de autenticacao JWT.
 * Valida o token do cabecalho Authorization e disponibiliza o usuario em req.user.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns {import("express").Response|void}
 */
module.exports = function auth(req, res, next) {
  // Pega o header Authorization da requisicao
  const authHeader = req.headers.authorization;

  // Valida se veio no formato Bearer token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token nao informado." });
  }

  // Separa so o token (sem o Bearer)
  const token = authHeader.split(" ")[1];

  try {
    // Verifica se o token eh valido com a chave secreta
    const decoded = jwt.verify(token, JWT_SECRET);

    // Salva os dados decodificados para usar nas proximas rotas
    req.user = decoded;
    return next();
  } catch (error) {
    // Se der erro na validacao, token eh invalido
    return res.status(401).json({ message: "Token invalido." });
  }
};
