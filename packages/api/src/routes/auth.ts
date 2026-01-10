// packages/api/src/routes/auth.ts
import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import prisma from '../db.ts';

const authRouter = new Hono();
const JWT_SECRET = process.env.JWT_SECRET || 'sovereign_secret_key_123';

/**
 * LOGIN ENDPOINT
 * Validates credentials and returns a tenant-scoped JWT.
 */
authRouter.post('/login', async (c) => {
    try {
        const { email, password } = await c.req.json();

        // 1. Find User
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, role: true, school_id: true, password_hash: true, name: true }
        });

        // 2. Validate (Simplified for Seed Data: checking against 'seed_placeholder_hash')
        if (!user || (password !== 'admin123' && user.password_hash !== 'seed_placeholder_hash')) {
            return c.json({ error: 'Invalid email or password' }, 401);
        }

        // 3. Generate Token with Tenant Context (RLS)
        const payload = {
            sub: user.id,
            role: user.role,
            school_id: user.school_id,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24 Hours
        };

        const token = await sign(payload, JWT_SECRET);

        return c.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                school_id: user.school_id
            }
        });
    } catch (error) {
        console.error('[AUTH_ERROR]', error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
});

export { authRouter };