import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";

import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Clerk middleware -> semua request bawa context auth
app.use(clerkMiddleware());

// Healthcheck
app.get("/health", (_req, res) => res.json({ ok: true }));

// Routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

export default app;