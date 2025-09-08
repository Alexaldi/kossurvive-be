export function requireRole(...roles) {
    return (req, res, next) => {
        try {
            const userRole = req.auth?.sessionClaims?.metadata?.role || "user";
            if (!roles.includes(userRole)) {
                return res.status(403).json({ error: "Forbidden: Insufficient role" });
            }
            next();
        } catch (error) {
            console.error("requireRole error:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };
}
