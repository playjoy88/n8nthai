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
        
        // Get backupId from query params
        const { searchParams } = new URL(req.url);
        const backupId = searchParams.get('backupId');
        
        if (!backupId) {
            return NextResponse.json(
                { error: 'กรุณาระบุ Backup ID' },
                { status: 400 }
            );
        }
        
        // Get the backup
        const backup = await backupService.getBackup(backupId);
        
        if (!backup) {
            return NextResponse.json(
                { error: 'ไม่พบ Backup ที่ระบุ' },
                { status: 404 }
            );
        }
        
        // Get the instance to check if it belongs to the user
        const instance = await instanceService.getInstance(backup.instanceId);
        
        if (!instance) {
            return NextResponse.json(
                { error: 'ไม่พบ Instance ที่เกี่ยวข้อง' },
                { status: 404 }
            );
        }
        
        if (instance.userId !== payload.userId) {
            return NextResponse.json(
                { error: 'ไม่ได้รับอนุญาตให้เข้าถึง Backup นี้' },
                { status: 403 }
            );
        }
        
        // Generate download URL
        const downloadUrl = await backupService.generateBackupDownloadUrl(backupId);
        
        // Return the download URL
        return NextResponse.json({ downloadUrl });
    } catch (error) {
        console.error('Error generating download URL:', error);
        
        // Check if token verification error
        if (error instanceof Error && error.message === 'Invalid token') {
            return NextResponse.json(
                { error: 'ไม่ได้รับอนุญาต (token ไม่ถูกต้อง)' },
                { status: 401 }
            );
        }
        
        // Check for backup-specific errors
        if (error instanceof Error && error.message.startsWith('Backup')) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }
        
        // Generic error response
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการสร้าง URL สำหรับดาวน์โหลด โปรดลองอีกครั้ง' },
            { status: 500 }
        );
    }
}
