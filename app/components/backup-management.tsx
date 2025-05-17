'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
// Custom date formatting function
const formatDateString = (dateStr?: string): string => {
    if (!dateStr) return 'N/A';
    try {
        const date = new Date(dateStr);
        return date.toLocaleString('th-TH', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return 'Invalid Date';
    }
};

interface Backup {
    id: string;
    instanceId: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    type: string;
    createdAt: string;
    completedAt?: string;
    size?: number;
    errorMessage?: string;
}

interface Instance {
    id: string;
    subdomain: string;
    status: string;
}

export default function BackupManagement({ instances }: { instances: Instance[] }) {
    const { token } = useAuth();
    const [selectedInstance, setSelectedInstance] = useState<string | null>(null);
    const [backups, setBackups] = useState<Backup[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [createBackupLoading, setCreateBackupLoading] = useState(false);
    const [restoreLoading, setRestoreLoading] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Reset state when selected instance changes
    useEffect(() => {
        setBackups([]);
        setError(null);
        setSuccessMessage(null);
        
        if (selectedInstance) {
            fetchBackups(selectedInstance);
        }
    }, [selectedInstance]);

    // Fetch backups for the selected instance
    const fetchBackups = async (instanceId: string) => {
        if (!token) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`/api/backups?instanceId=${instanceId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'ไม่สามารถโหลดข้อมูล Backup ได้');
            }
            
            const data = await response.json();
            setBackups(data.backups);
        } catch (error) {
            console.error('Error fetching backups:', error);
            setError(error instanceof Error ? error.message : 'ไม่สามารถโหลดข้อมูล Backup ได้');
        } finally {
            setLoading(false);
        }
    };

    // Create a new backup
    const createBackup = async (instanceId: string) => {
        if (!token) return;
        
        setCreateBackupLoading(true);
        setError(null);
        setSuccessMessage(null);
        
        try {
            const response = await fetch('/api/backups', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ instanceId })
            });
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'ไม่สามารถสร้าง Backup ได้');
            }
            
            setSuccessMessage('เริ่มกระบวนการสำรองข้อมูลแล้ว กรุณารอสักครู่');
            
            // Refresh the backup list after a short delay
            setTimeout(() => {
                fetchBackups(instanceId);
            }, 2000);
        } catch (error) {
            console.error('Error creating backup:', error);
            setError(error instanceof Error ? error.message : 'ไม่สามารถสร้าง Backup ได้');
        } finally {
            setCreateBackupLoading(false);
        }
    };

    // Restore from a backup
    const restoreFromBackup = async (backupId: string) => {
        if (!token) return;
        
        setRestoreLoading(backupId);
        setError(null);
        setSuccessMessage(null);
        
        try {
            const response = await fetch('/api/backups/restore', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ backupId })
            });
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'ไม่สามารถกู้คืนข้อมูลจาก Backup ได้');
            }
            
            setSuccessMessage('เริ่มกระบวนการกู้คืนข้อมูลแล้ว Instance จะรีสตาร์ทโดยอัตโนมัติเมื่อเสร็จสิ้น');
        } catch (error) {
            console.error('Error restoring from backup:', error);
            setError(error instanceof Error ? error.message : 'ไม่สามารถกู้คืนข้อมูลจาก Backup ได้');
        } finally {
            setRestoreLoading(null);
        }
    };

    // Download a backup
    const downloadBackup = async (backupId: string) => {
        if (!token) return;
        
        try {
            const response = await fetch(`/api/backups/download?backupId=${backupId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'ไม่สามารถดาวน์โหลด Backup ได้');
            }
            
            const data = await response.json();
            
            // Open the download URL in a new tab
            window.open(data.downloadUrl, '_blank');
        } catch (error) {
            console.error('Error downloading backup:', error);
            setError(error instanceof Error ? error.message : 'ไม่สามารถดาวน์โหลด Backup ได้');
        }
    };

    // Format file size
    const formatSize = (bytes?: number): string => {
        if (!bytes) return 'N/A';
        
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let size = bytes;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return `${size.toFixed(2)} ${units[unitIndex]}`;
    };

    // Format date
    const formatDate = (dateString?: string): string => {
        return formatDateString(dateString);
    };

    // Get status badge class
    const getStatusBadgeClass = (status: string): string => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get instance dropdown label
    const getInstanceDropdownLabel = (): string => {
        if (!selectedInstance) return 'เลือก Instance';
        
        const instance = instances.find(i => i.id === selectedInstance);
        return instance ? instance.subdomain : 'เลือก Instance';
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-medium text-gray-900">
                        จัดการการสำรองข้อมูล
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        จัดการและกู้คืนข้อมูลสำรองของ n8n instances ของคุณ
                    </p>
                </div>
            </div>

            {/* Instance selector */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                        <label htmlFor="instance-select" className="block text-sm font-medium text-gray-700 mb-1">
                            เลือก Instance
                        </label>
                        <div className="relative inline-block w-full md:w-64">
                            <select
                                id="instance-select"
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                onChange={(e) => setSelectedInstance(e.target.value || null)}
                                value={selectedInstance || ''}
                            >
                                <option value="">เลือก Instance</option>
                                {instances.map((instance) => (
                                    <option key={instance.id} value={instance.id}>
                                        {instance.subdomain} {instance.status === 'running' ? '(กำลังทำงาน)' : '(หยุดทำงาน)'}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    {selectedInstance && (
                        <button
                            onClick={() => createBackup(selectedInstance)}
                            disabled={createBackupLoading || !selectedInstance || instances.find(i => i.id === selectedInstance)?.status !== 'running'}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {createBackupLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    กำลังสร้าง Backup...
                                </>
                            ) : (
                                <>
                                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                    </svg>
                                    สร้าง Backup ใหม่
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* Messages */}
                {successMessage && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-700">{successMessage}</p>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {selectedInstance && instances.find(i => i.id === selectedInstance)?.status !== 'running' && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    Instance ที่เลือกไม่ได้กำลังทำงาน คุณจำเป็นต้องเริ่ม Instance ก่อนจึงจะสามารถสร้าง Backup ได้
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Backups list */}
            {selectedInstance && (
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            <p className="mt-2 text-gray-500">กำลังโหลดข้อมูล Backup...</p>
                        </div>
                    ) : backups.length === 0 ? (
                        <div className="p-8 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่พบข้อมูล Backup</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                ยังไม่มีการสำรองข้อมูลสำหรับ Instance นี้
                            </p>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        วันที่สร้าง
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        สถานะ
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ขนาด
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        วันที่เสร็จสิ้น
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        การจัดการ
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {backups.map((backup) => (
                                    <tr key={backup.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(backup.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(backup.status)}`}>
                                                {backup.status === 'pending' && 'รอดำเนินการ'}
                                                {backup.status === 'in_progress' && 'กำลังดำเนินการ'}
                                                {backup.status === 'completed' && 'เสร็จสมบูรณ์'}
                                                {backup.status === 'failed' && 'ล้มเหลว'}
                                            </span>
                                            {backup.status === 'failed' && backup.errorMessage && (
                                                <span className="ml-2 text-xs text-red-500">
                                                    {backup.errorMessage}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatSize(backup.size)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(backup.completedAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {backup.status === 'completed' && (
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => downloadBackup(backup.id)}
                                                        className="text-blue-600 hover:text-blue-900 flex items-center"
                                                    >
                                                        <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                        </svg>
                                                        ดาวน์โหลด
                                                    </button>
                                                    <button
                                                        onClick={() => restoreFromBackup(backup.id)}
                                                        disabled={!!restoreLoading}
                                                        className={`text-green-600 hover:text-green-900 flex items-center ${
                                                            restoreLoading ? 'opacity-50 cursor-not-allowed' : ''
                                                        }`}
                                                    >
                                                        {restoreLoading === backup.id ? (
                                                            <>
                                                                <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                กำลังกู้คืน...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                                </svg>
                                                                กู้คืน
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}
