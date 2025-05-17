import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/jwt';
import { backupService } from '@/lib/services/backup-service';
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
        
        // Get instanceId from query params
        const { searchParams } = new URL(req.url);
        const instanceId = searchParams.get('instanceId');
        
        if (!instanceId) {
            return NextResponse.json(
                { error: 'กรุณาระบุ Instance ID' },
                { status: 400 }
            );
        }
        
        // Get the instance to check if it belongs to the user
        const instance = await instanceService.getInstance(instanceId);
        
        if (!instance) {
            return NextResponse.json(
                { error: 'ไม่พบ Instance ที่ระบุ' },
                { status: 404 }
            );
        }
        
        if (instance.userId !== payload.userId) {
            return NextResponse.json(
                { error: 'ไม่ได้รับอนุญาตให้เข้าถึง Backup ของ Instance นี้' },
                { status: 403 }
            );
        }
        
        // Get backups for the instance
        const backups = await backupService.getInstanceBackups(instanceId);
        
        // Return the backups
        return NextResponse.json({ backups });
    } catch (error) {
        console.error('Error fetching backups:', error);
        
        // Check if token verification error
        if (error instanceof Error && error.message === 'Invalid token') {
            return NextResponse.json(
                { error: 'ไม่ได้รับอนุญาต (token ไม่ถูกต้อง)' },
                { status: 401 }
            );
        }
        
        // Generic error response
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล Backup โปรดลองอีกครั้ง' },
            { status: 500 }
        );
    }
}

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
        
        if (!data.instanceId) {
            return NextResponse.json(
                { error: 'กรุณาระบุ Instance ID' },
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
                { error: 'ไม่ได้รับอนุญาตให้สร้าง Backup สำหรับ Instance นี้' },
                { status: 403 }
            );
        }
        
        // Create a backup
        const backup = await backupService.createBackup(data.instanceId);
        
        // Return the backup
        return NextResponse.json(
            { backup },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating backup:', error);
        
        // Check if token verification error
        if (error instanceof Error && error.message === 'Invalid token') {
            return NextResponse.json(
                { error: 'ไม่ได้รับอนุญาต (token ไม่ถูกต้อง)' },
                { status: 401 }
            );
        }
        
        // Check for backup-specific errors
        if (error instanceof Error && (
            error.message.includes('not found') || 
            error.message.includes('not running')
        )) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }
        
        // Generic error response
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการสร้าง Backup โปรดลองอีกครั้ง' },
            { status: 500 }
        );
    }
}
