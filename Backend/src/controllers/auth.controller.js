import { login, register } from "../services/auth.service.js";

export async function registerController(req, res, next) {
  try {
    const { username, password, email, displayName } = req.body;
    const result = await register({ username, password, email, displayName });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function loginController(req, res, next) {
  try {
    const { username, password } = req.body;
    const result = await login({ username, password });
    res.json(result);
  } catch (err) {
    next(err);
  }
}