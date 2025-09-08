// test/auth.test.js
import request from "supertest";
import app from "../src/app.js";

const userToken = process.env.TEST_USER_TOKEN;
const adminToken = process.env.TEST_ADMIN_TOKEN;

describe("Auth API", () => {
    it("GET /auth/me harus return auth data", async () => {
        const res = await request(app)
            .get("/auth/me")
            .auth(userToken, { type: "bearer" });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("auth");
    });

    describe("Role-based Access Control", () => {
        it("✅ User can access /auth/user", async () => {
            const res = await request(app)
                .get("/auth/user")
                .auth(userToken, { type: "bearer" });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Welcome User!");
        });

        it("❌ Admin cannot access /auth/user", async () => {
            const res = await request(app)
                .get("/auth/user")
                .auth(adminToken, { type: "bearer" }); // FIXED: pakai adminToken

            expect(res.status).toBe(403);
            expect(res.body.error).toMatch("Forbidden: Insufficient role");

        });

        it("✅ Admin can access /auth/admin", async () => {
            const res = await request(app)
                .get("/auth/admin")
                .auth(adminToken, { type: "bearer" });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Welcome Admin!");
        });

        it("❌ User cannot access /auth/admin", async () => {
            const res = await request(app)
                .get("/auth/admin")
                .auth(userToken, { type: "bearer" }); // FIXED: pakai userToken

            expect(res.status).toBe(403);
            expect(res.body.error).toBe("Forbidden: Insufficient role");
        });
    });
});
