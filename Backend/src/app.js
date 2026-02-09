import express from "express";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

// monta las rutas de auth bajo /auth
app.use("/auth", authRoutes);

// middleware de errores siempre al final
app.use(errorHandler);

export default app;