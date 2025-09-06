import { clerkClient } from "@clerk/clerk-sdk-node";
import { prisma } from "../lib/prisma.js";

export const getmyProfile = async (req, res) => {
    try {
        const clerkUserId = req.auth?.userId;
        if (!clerkUserId) return res.status(401).json({ error: "Unauthorized" });

        // ambil role dari token clerk
        let roleFromToken = req.auth?.sessionClaim?.metadata?.role;

        // fallback ke clerk api jika token tidak ada role
        if (!roleFromToken) {
            const clerkUser = await clerkClient.users.getUser(clerkUserId);
            roleFromToken = clerkUser.publicMetadata?.role || "user";
        }

        //cek apakah user profile sudah ada di db
        let profile = await prisma.userProfile.findUnique({
            where: { clerkUserId }
        });

        //jika belum ada, buat baru
        if (!profile) {
            profile = await prisma.userProfile.create({
                data: { clerkUserId, role: roleFromToken }
            });
        }
        //kalau ada, update role jika berbeda
        else if (profile.role !== roleFromToken) {
            profile = await prisma.userProfile.update({
                where: { clerkUserId },
                data: { role: roleFromToken }
            });
        }

        res.json(profile);
    } catch (error) {
        console.error("getMyprofile error:", error);
        res.status(500).json({ error: error.massage })
    }
}

export const upsertMyProfile = async (req, res) => {

}