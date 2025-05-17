import jwt from 'jsonwebtoken';

// Get JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

interface JwtPayload {
    userId: string;
    email: string;
    username: string;
}

// Create a JWT token for the user
export function createToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRY
    });
}

// Verify a JWT token
export function verifyToken(token: string): JwtPayload {
    try {
        const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
        return payload;
    } catch (error) {
        throw new Error('Invalid token');
    }
}

// Create a refresh token
export function createRefreshToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: '7d'
    });
}
