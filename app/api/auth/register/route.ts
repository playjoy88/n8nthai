import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/user-service';
import { instanceService } from '@/lib/services/instance-service';
import { createToken } from '@/lib/utils/jwt';
import { PlanType } from '@prisma/client';

export async function POST(req: NextRequest) {
    try {
        // Parse the request body
        const data = await req.json();
        
        // Validate input
        if (!data.username || !data.email || !data.password || !data.confirmPassword) {
            return NextResponse.json(
                { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
                { status: 400 }
            );
        }
        
        // Check if passwords match
        if (data.password !== data.confirmPassword) {
            return NextResponse.json(
                { error: 'รหัสผ่านไม่ตรงกัน' },
                { status: 400 }
            );
        }
        
        // Validate plan
        const plan = data.plan || 'free';
        if (!['free', 'basic', 'pro', 'enterprise'].includes(plan)) {
            return NextResponse.json(
                { error: 'แผนไม่ถูกต้อง' },
                { status: 400 }
            );
        }
        
        // Create the user
        const user = await userService.createUser({
            username: data.username,
            email: data.email,
            password: data.password,
            plan: plan as PlanType
        });
        
        // Create an n8n instance for the user
        const instance = await instanceService.createInstance(user.id);
        
        // Generate JWT token
        const token = createToken({
            userId: user.id,
            email: user.email,
            username: user.username
        });
        
        // Return the user data (excluding password) and token
        return NextResponse.json({
            user,
            instance: {
                id: instance.id,
                subdomain: instance.subdomain,
                status: instance.status,
                url: `https://${instance.subdomain}.${process.env.INSTANCE_BASE_DOMAIN || 'n8n.yourdomain.com'}`
            },
            token
        }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle known errors with appropriate messages
        if (error instanceof Error) {
            if (error.message.includes('ถูกใช้งานแล้ว')) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 409 }
                );
            }
        }
        
        // Generic error response
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการลงทะเบียน โปรดลองอีกครั้ง' },
            { status: 500 }
        );
    }
}
