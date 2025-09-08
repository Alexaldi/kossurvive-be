// middlewares/requireApiAuth.js
import { getAuth } from "@clerk/express";

export const requireApiAuth = (req, res, next) => {
    try {
        const auth = getAuth(req);

        if (!auth || !auth.userId) {
            return res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
        }

        // simpen auth di req biar gampang dipakai di controller
        req.auth = auth;

        next();
    } catch (error) {
        console.error("requireApiAuth error:", error);
        return res.status(401).json({ error: "Unauthorized" });
    }
};
