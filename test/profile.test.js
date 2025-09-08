import request from "supertest";
import app from "../src/app.js";

const userToken = process.env.TEST_USER_TOKEN;
if (!userToken) {
    throw new Error("TEST_USER_TOKEN tidak ada di .env!");
}

describe("Profile API", () => {
    it("GET /profile/me harus return data user (valid token)", async () => {
        const res = await request(app)
            .get("/profile/me")
            .auth(userToken, { type: "bearer" });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("clerkUserId");
    });

    it("PUT /profile/me harus bisa update data (valid token)", async () => {
        const res = await request(app)
            .put("/profile/me")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                displayName: "User Testing",
                preferences: { darkMode: true },
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({
            displayName: "User Testing",
            preferences: { darkMode: true },
        });
    });

    it("GET /profile/me dengan token invalid harus 401", async () => {
        const res = await request(app)
            .get("/profile/me")
            .auth("INVALID_TOKEN_123", { type: "bearer" });

        expect(res.statusCode).toBe(401);
    });

    it("PUT /profile/me dengan token invalid harus 401", async () => {
        const res = await request(app)
            .put("/profile/me")
            .set("Authorization", "Bearer INVALID_TOKEN_123")
            .send({
                displayName: "Harusnya gagal",
            });

        expect(res.statusCode).toBe(401);
    });
});
