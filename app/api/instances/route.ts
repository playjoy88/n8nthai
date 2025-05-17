import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/jwt';
import { instanceService } from '@/lib/services/instance-service';

export async function GET(req: NextRequest) {
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
        
        // Get instances for the user
        const instances = await instanceService.getUserInstances(payload.userId);
        
        // Return the instances
        return NextResponse.json({
            instances: instances.map(instance => ({
                id: instance.id,
                subdomain: instance.subdomain,
                status: instance.status,
                url: `https://${instance.subdomain}.${process.env.INSTANCE_BASE_DOMAIN || 'n8n.yourdomain.com'}`
            }))
        });
    } catch (error) {
        console.error('Error fetching instances:', error);
        
        // Check if token verification error
        if (error instanceof Error && error.message === 'Invalid token') {
            return NextResponse.json(
                { error: 'ไม่ได้รับอนุญาต (token ไม่ถูกต้อง)' },
                { status: 401 }
            );
        }
        
        // Generic error response
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล Instance โปรดลองอีกครั้ง' },
            { status: 500 }
        );
    }
}
