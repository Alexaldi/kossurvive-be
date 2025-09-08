import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { getmyProfile, upsertMyProfile } from "../controllers/profile.controller.js";
import { requireApiAuth } from "../middlewares/requireApiAuth.js";

const router = Router();

router.get("/", (_req, res) => {
    res.json({ ok: true, message: "Profile route is working" });
});

// GET → baca profil user (sinkron Clerk ↔ DB)
router.get("/me", requireApiAuth, getmyProfile);


// PUT → update profil user (nama, preferensi, dll)
router.put("/me", requireApiAuth, upsertMyProfile);

export default router;
