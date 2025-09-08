import { Router } from "express";
import { requireRole } from "../middlewares/role.middleware.js";
import { generateToken } from "../lib/generatedToken.js";
import { requireApiAuth } from "../middlewares/requireApiAuth.js";

const router = Router();

// Basic route → cuma cek token valid
router.get("/me", requireApiAuth, (req, res) => {
    res.json({ auth: req.auth });
});

// Admin-only
router.get("/admin", requireApiAuth, requireRole("admin"), (req, res) => {
    res.json({ message: "Welcome Admin!", role: req.auth.sessionClaims.metadata.role });
});

// User-only
router.get("/user", requireApiAuth, requireRole("user"), (req, res) => {
    res.json({ message: "Welcome User!", role: req.auth.sessionClaims.metadata.role });
});


export default router;