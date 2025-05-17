import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/jwt';
import { instanceService } from '@/lib/services/instance-service';

export async function POST(req: NextRequest) {
    try {
        // Get the authorization header
        const authHeader = req.headers.get('authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'ไม่ได้รับอนุญาต (token ไม่ถูกต้อง)' },
                { status: 401 }
            );
        }
        
        // Extract the token
        const token = authHeader.split(' ')[1];
        
        // Verify token
        const payload = verifyToken(token);
        
        // Parse the request body
        const data = await req.json();
        
        if (!data.instanceId || !data.action) {
            return NextResponse.json(
                { error: 'กรุณาระบุ Instance และ Action ที่ต้องการ' },
                { status: 400 }
            );
        }
        
        // Validate the action
        if (!['start', 'stop', 'restart', 'delete'].includes(data.action)) {
            return NextResponse.json(
                { error: 'Action ไม่ถูกต้อง (start, stop, restart, delete เท่านั้น)' },
                { status: 400 }
            );
        }
        
        // Get the instance to check if it belongs to the user
        const instance = await instanceService.getInstance(data.instanceId);
        
        if (!instance) {
            return NextResponse.json(
                { error: 'ไม่พบ Instance ที่ระบุ' },
                { status: 404 }
            );
        }
        
        if (instance.userId !== payload.userId) {
            return NextResponse.json(
                { error: 'ไม่ได้รับอนุญาตให้จัดการ Instance นี้' },
                { status: 403 }
            );
        }
        
        // Control the instance
        const updatedInstance = await instanceService.controlInstance(data.instanceId, data.action);
        
        // Return the updated instance
        return NextResponse.json({
            instance: {
                id: updatedInstance.id,
                subdomain: updatedInstance.subdomain,
                status: updatedInstance.status,
                url: `https://${updatedInstance.subdomain}.${process.env.INSTANCE_BASE_DOMAIN || 'n8n.yourdomain.com'}`
            }
        });
    } catch (error) {
        console.error(`Error controlling instance:`, error);
        
        // Check if token verification error
        if (error instanceof Error && error.message === 'Invalid token') {
            return NextResponse.json(
                { error: 'ไม่ได้รับอนุญาต (token ไม่ถูกต้อง)' },
                { status: 401 }
            );
        }
        
        // Generic error response
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการจัดการ Instance โปรดลองอีกครั้ง' },
            { status: 500 }
        );
    }
}
