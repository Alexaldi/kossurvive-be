import { Router } from "express";

const router = Router();

// Dummy route for authentication check
router.get("/", (req, res) => {
    res.json({ msg: "Auth route working" });
});

export default router;