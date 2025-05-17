import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/user-service';
import { createToken } from '@/lib/utils/jwt';

export async function POST(req: NextRequest) {
    try {
        // Parse the request body
        const data = await req.json();
        
        // Validate input
        if (!data.email || !data.password) {
            return NextResponse.json(
                { error: 'กรุณากรอกอีเมลและรหัสผ่าน' },
                { status: 400 }
            );
        }
        
        // Find the user by email
        const user = await userService.findByEmail(data.email);
        
        // Check if user exists
        if (!user) {
            return NextResponse.json(
                { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
                { status: 401 }
            );
        }
        
        // Check if the account is suspended
        if (user.isSuspended) {
            return NextResponse.json(
                { error: 'บัญชีของคุณถูกระงับ กรุณาติดต่อผู้ดูแลระบบ' },
                { status: 403 }
            );
        }
        
        // Verify password
        const isPasswordValid = await userService.verifyPassword(user, data.password);
        
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
                { status: 401 }
            );
        }
        
        // Update last login time
        await userService.updateLastLogin(user.id);
        
        // Generate JWT token
        const token = createToken({
            userId: user.id,
            email: user.email,
            username: user.username
        });
        
        // Get user instances (but not returning the full instances to the client)
        const { passwordHash, resetToken, resetTokenExpiresAt, ...userWithoutPassword } = user;
        
        // Return the user data and token
        return NextResponse.json({
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        
        // Generic error response
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ โปรดลองอีกครั้ง' },
            { status: 500 }
        );
    }
}
