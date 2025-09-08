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

// Routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

// Error handler khusus Clerk
app.use((err, req, res, next) => {
    if (err && err.code === "unauthorized") {
        return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    }
    next(err);
});

export default app;