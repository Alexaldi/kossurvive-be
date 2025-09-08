// src/lib/generatedToken.js
import { clerkClient } from "@clerk/clerk-sdk-node";

export async function generateToken(req, res) {
    try {
        const { sessionId, template } = req.body;

        if (!sessionId) {
            return res.status(400).json({ error: "sessionId is required" });
        }

        let token;
        if (template) {
            // Generate token pakai template
            const tokenResponse = await clerkClient.sessions.getToken(sessionId, template);
            token = tokenResponse.jwt;
        } else {
            // Generate default session token
            const tokenResponse = await clerkClient.sessions.createSessionToken(sessionId);
            token = tokenResponse.jwt;
        }

        res.json({
            message: "Token generated successfully",
            token,
        });
    } catch (err) {
        console.error("❌ generateToken error:", err.message);
        res.status(500).json({ error: err.message });
    }
}
