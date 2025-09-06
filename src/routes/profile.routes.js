import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.json({ msg: "Profile route working" });
});

export default router;
