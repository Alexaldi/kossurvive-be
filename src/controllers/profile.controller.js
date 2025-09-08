import { clerkClient } from "@clerk/clerk-sdk-node";
import prisma from "../lib/prisma.js";

export const getmyProfile = async (req, res) => {
    try {
        const clerkUserId = req.auth?.userId;
        // ambil role dari token clerk
        let roleFromToken = req.auth?.sessionClaims?.metadata?.role;

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
    try {
        const auth = req.auth;
        const clerkUserId = auth.userId;

        const { displayName, preferences } = req.body; // sesuai schema prisma
        let role = auth.sessionClaims?.metadata?.role;

        // fallback ke Clerk API jika role kosong
        if (!role) {
            const clerkUser = await clerkClient.users.getUser(clerkUserId);
            role = clerkUser.publicMetadata?.role || "user";
        }

        // gunakan upsert, bukan findUnique + update/create
        const profile = await prisma.userProfile.upsert({
            where: { clerkUserId },
            update: { displayName, preferences, role },
            create: { clerkUserId, displayName, preferences, role },
        });

        res.json(profile);
    } catch (error) {
        console.error("upsertMyProfile error:", error);
        res.status(500).json({ error: error.message });
    }
};