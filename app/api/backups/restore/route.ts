import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/jwt';
import { backupService } from '@/lib/services/backup-service';
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
        
        if (!data.backupId) {
            return NextResponse.json(
                { error: 'กรุณาระบุ Backup ID' },
                { status: 400 }
            );
        }
        
        // Get the backup
        const backup = await backupService.getBackup(data.backupId);
        
        if (!backup) {
            return NextResponse.json(
                { error: 'ไม่พบ Backup ที่ระบุ' },
                { status: 404 }
            );
        }
        
        // Get the instance
        const instance = await instanceService.getInstance(backup.instanceId);
        
        if (!instance) {
            return NextResponse.json(
                { error: 'ไม่พบ Instance ที่เกี่ยวข้อง' },
                { status: 404 }
            );
        }
        
        // Check if user owns the instance
        if (instance.userId !== payload.userId) {
            return NextResponse.json(
                { error: 'ไม่ได้รับอนุญาตให้กู้คืนข้อมูลสำหรับ Instance นี้' },
                { status: 403 }
            );
        }
        
        // Restore from backup
        const updatedInstance = await backupService.restoreFromBackup(data.backupId);
        
        // Return success
        return NextResponse.json({
            success: true,
            message: 'เริ่มการกู้คืนข้อมูลแล้ว กรุณารอสักครู่',
            instance: {
                id: updatedInstance.id,
                status: updatedInstance.status
            }
        });
    } catch (error) {
        console.error('Error restoring from backup:', error);
        
        // Check if token verification error
        if (error instanceof Error && error.message === 'Invalid token') {
            return NextResponse.json(
                { error: 'ไม่ได้รับอนุญาต (token ไม่ถูกต้อง)' },
                { status: 401 }
            );
        }
        
        // Check for specific errors
        if (error instanceof Error) {
            if (error.message.includes('not found')) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 404 }
                );
            }
            
            if (error.message.includes('not completed') || 
                error.message.includes('file path not found')) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 400 }
                );
            }
        }
        
        // Generic error response
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการกู้คืนข้อมูล โปรดลองอีกครั้ง' },
            { status: 500 }
        );
    }
}
