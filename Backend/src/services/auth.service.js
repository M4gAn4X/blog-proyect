import jwt from "jsonwebtoken";
import { createUser, findUserByUsername } from "../models/users.model.js";
import { hashPassword, verifyPassword } from "../utils/password.js";

function signToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const err = new Error("Falta JWT_SECRET en el .env");
    err.statusCode = 500;
    throw err;
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || "1d";

  // payload: datos no sensibles (ej: username)
  // subject (sub): id del usuario
  return jwt.sign({ username: user.username }, secret, {
    subject: String(user.id),
    expiresIn,
  });
}

export async function register({ username, password, email = null, displayName = null }) {
  if (!username || !password) {
    const err = new Error("username y password son requeridos");
    err.statusCode = 400;
    throw err;
  }

  const existing = await findUserByUsername(username);
  if (existing) {
    const err = new Error("username ya existe");
    err.statusCode = 409;
    throw err;
  }

  const passwordHash = await hashPassword(password);

  const user = await createUser({
    username,
    email,
    displayName,
    passwordHash,
  });

  const token = signToken(user);
  return { user, token };
}

export async function login({ username, password }) {
  if (!username || !password) {
    const err = new Error("username y password son requeridos");
    err.statusCode = 400;
    throw err;
  }

  const user = await findUserByUsername(username);
  if (!user) {
    const err = new Error("credenciales inválidas");
    err.statusCode = 401;
    throw err;
  }

  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) {
    const err = new Error("credenciales inválidas");
    err.statusCode = 401;
    throw err;
  }

  const token = signToken(user);

  const safeUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    display_name: user.display_name,
  };

  return { user: safeUser, token };
}