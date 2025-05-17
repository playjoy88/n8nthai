import { PrismaClient, User, PlanType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export interface CreateUserData {
    username: string;
    email: string;
    password: string;
    plan: PlanType;
}

export interface UserWithoutPassword {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    plan: PlanType;
    isActive: boolean;
    expiresAt: Date | null;
    isSuspended: boolean;
    lastLoginAt: Date | null;
}

// Remove password from user object for security
const excludePassword = (user: User): UserWithoutPassword => {
    const { passwordHash, resetToken, resetTokenExpiresAt, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

export const userService = {
    // Create a new user
    async createUser(data: CreateUserData): Promise<UserWithoutPassword> {
        const { username, email, password, plan } = data;
        
        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        });
        
        if (existingUser) {
            if (existingUser.email === email) {
                throw new Error('อีเมลนี้ถูกใช้งานแล้ว');
            } else {
                throw new Error('ชื่อผู้ใช้นี้ถูกใช้งานแล้ว');
            }
        }
        
        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);
        
        // Calculate expiration date based on plan (7 days for free trial)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
        
        // Create user in database
        const user = await prisma.user.create({
            data: {
                username,
                email,
                passwordHash,
                plan,
                expiresAt: plan === 'free' ? expiresAt : null, // Only set expiration for free trial
                isActive: true
            }
        });
        
        return excludePassword(user);
    },
    
    // Find user by email
    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email }
        });
    },
    
    // Find user by ID
    async findById(id: string): Promise<UserWithoutPassword | null> {
        const user = await prisma.user.findUnique({
            where: { id }
        });
        
        if (!user) {
            return null;
        }
        
        return excludePassword(user);
    },
    
    // Verify user password
    async verifyPassword(user: User, password: string): Promise<boolean> {
        return bcrypt.compare(password, user.passwordHash);
    },
    
    // Update last login time
    async updateLastLogin(userId: string): Promise<void> {
        await prisma.user.update({
            where: { id: userId },
            data: { lastLoginAt: new Date() }
        });
    }
};
