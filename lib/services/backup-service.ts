import { PrismaClient, Instance, Backup } from '@prisma/client';
import { instanceService } from './instance-service';
import axios from 'axios';

const prisma = new PrismaClient();

// Get environment variables
const BACKUP_API_URL = process.env.BACKUP_API_URL || 'http://localhost:3001/api/backups';
const BACKUP_API_KEY = process.env.BACKUP_API_KEY || 'default-key';
const S3_BUCKET = process.env.S3_BUCKET || 'n8nthai-backups';

// Define backup status (these are not in the schema, so we define them here)
type BackupProcessStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export const backupService = {
    /**
     * Schedule backups for all active instances
     * This function would typically be called by a cron job
     */
    async scheduleBackupsForAllInstances(): Promise<void> {
        // Get all active instances
        const instances = await prisma.instance.findMany({
            where: {
                status: 'running',
                user: {
                    isActive: true,
                    isSuspended: false
                }
            },
            include: {
                user: {
                    select: {
                        plan: true
                    }
                }
            }
        });
        
        // Define backup frequency based on plan
        const backupFrequencies = {
            free: 7,      // once a week
            basic: 3,     // every 3 days
            pro: 1,       // daily
            enterprise: 1 // daily
        };
        
        // Process each instance
        for (const instance of instances) {
            try {
                // Determine if backup is due based on plan and last backup
                const lastBackup = await prisma.backup.findFirst({
                    where: {
                        instanceId: instance.id,
                        isAutomatic: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
                
                const frequency = backupFrequencies[instance.user.plan as keyof typeof backupFrequencies];
                let shouldBackup = false;
                
                if (!lastBackup) {
                    // No previous backup, should create one
                    shouldBackup = true;
                } else {
                    // Check if enough days have passed since last backup
                    const daysSinceLastBackup = Math.floor(
                        (new Date().getTime() - lastBackup.createdAt.getTime()) / (1000 * 60 * 60 * 24)
                    );
                    
                    if (daysSinceLastBackup >= frequency) {
                        shouldBackup = true;
                    }
                }
                
                if (shouldBackup) {
                    await this.createBackup(instance.id, true);
                }
            } catch (error) {
                console.error(`Error scheduling backup for instance ${instance.id}:`, error);
                // Continue with other instances even if one fails
            }
        }
    },
    
    /**
     * Create a backup for a specific instance
     */
    async createBackup(instanceId: string, isAutomatic: boolean = false): Promise<Backup> {
        // Get the instance
        const instance = await instanceService.getInstance(instanceId);
        
        if (!instance) {
            throw new Error('Instance not found');
        }
        
        if (instance.status !== 'running') {
            throw new Error('Cannot backup instance that is not running');
        }
        
        try {
            // Call the backup API
            const response = await axios.post(`${BACKUP_API_URL}/create`, {
                instanceId,
                dockerPath: instance.dockerPath,
                subdomain: instance.subdomain
            }, {
                headers: {
                    'Authorization': `Bearer ${BACKUP_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            
            // Create backup record in database once the backup is completed
            // In a real implementation, you might want to handle this with a webhook callback
            // For now, we'll just create the record
            const backup = await prisma.backup.create({
                data: {
                    instanceId,
                    path: response.data.path, // Path in S3 or other storage
                    size: response.data.size, // Size in bytes
                    isAutomatic: isAutomatic
                }
            });
            
            // Update the instance's backup status
            await prisma.instance.update({
                where: { id: instanceId },
                data: {
                    isBackedUp: true,
                    lastBackupAt: new Date()
                }
            });
            
            return backup;
        } catch (error) {
            console.error('Backup creation failed:', error);
            throw new Error('ไม่สามารถสร้างข้อมูลสำรองได้');
        }
    },
    
    /**
     * Get all backups for an instance
     */
    async getInstanceBackups(instanceId: string): Promise<Backup[]> {
        return prisma.backup.findMany({
            where: { instanceId },
            orderBy: { createdAt: 'desc' }
        });
    },
    
    /**
     * Get a specific backup by ID
     */
    async getBackup(backupId: string): Promise<Backup | null> {
        return prisma.backup.findUnique({
            where: { id: backupId }
        });
    },
    
    /**
     * Generate a presigned URL for downloading a backup
     */
    async generateBackupDownloadUrl(backupId: string): Promise<string> {
        const backup = await prisma.backup.findUnique({
            where: { id: backupId },
            include: {
                instance: {
                    include: {
                        user: true
                    }
                }
            }
        });
        
        if (!backup) {
            throw new Error('Backup not found');
        }
        
        if (!backup.path) {
            throw new Error('Backup file path not found');
        }
        
        // Generate a signed URL using the backup API
        try {
            const response = await axios.post(`${BACKUP_API_URL}/download-url`, {
                path: backup.path
            }, {
                headers: {
                    'Authorization': `Bearer ${BACKUP_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            
            return response.data.url;
        } catch (error) {
            console.error('Error generating download URL:', error);
            throw new Error('ไม่สามารถสร้าง URL สำหรับดาวน์โหลดได้');
        }
    },
    
    /**
     * Restore an instance from a backup
     */
    async restoreFromBackup(backupId: string): Promise<Instance> {
        const backup = await prisma.backup.findUnique({
            where: { id: backupId },
            include: {
                instance: true
            }
        });
        
        if (!backup) {
            throw new Error('Backup not found');
        }
        
        if (!backup.path) {
            throw new Error('Backup file path not found');
        }
        
        // Call the backup API to restore
        try {
            await axios.post(`${BACKUP_API_URL}/restore`, {
                backupId,
                instanceId: backup.instanceId,
                path: backup.path,
                dockerPath: backup.instance.dockerPath
            }, {
                headers: {
                    'Authorization': `Bearer ${BACKUP_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            
            // Update instance status to stopped (then we'll restart it)
            const updatedInstance = await prisma.instance.update({
                where: { id: backup.instanceId },
                data: { status: 'stopped' }
            });
            
            // Create a log entry
            await prisma.log.create({
                data: {
                    instanceId: backup.instanceId,
                    type: 'info',
                    message: `Restore from backup ${backup.id} initiated`
                }
            });
            
            // Now restart the instance
            return instanceService.controlInstance(backup.instanceId, 'start');
        } catch (error) {
            console.error('Error restoring from backup:', error);
            
            // Create a log entry
            await prisma.log.create({
                data: {
                    instanceId: backup.instanceId,
                    type: 'error',
                    message: `Failed to restore from backup ${backup.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
                }
            });
            
            throw new Error('ไม่สามารถกู้คืนข้อมูลจาก Backup ได้');
        }
    }
};
