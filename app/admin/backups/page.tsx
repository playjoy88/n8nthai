'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Define types
interface Backup {
  id: string;
  instanceName: string;
  username: string;
  createdAt: string;
  type: 'scheduled' | 'manual';
  status: 'completed' | 'in_progress' | 'pending' | 'failed';
  size: number | null;
  completedAt: string | null;
}

export default function AdminBackupsPage() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loadingBackups, setLoadingBackups] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    } else if (isAuthenticated) {
      // Simulate loading backups
      setTimeout(() => {
        const sampleBackups: Backup[] = [
          {
            id: '1',
            instanceName: 'customer1-app',
            username: 'customer1',
            createdAt: new Date().toISOString(),
            type: 'scheduled',
            status: 'completed',
            size: 25 * 1024 * 1024,
            completedAt: new Date().toISOString()
          },
          {
            id: '2',
            instanceName: 'customer2-main',
            username: 'customer2',
            createdAt: new Date().toISOString(),
            type: 'manual',
            status: 'in_progress',
            size: null,
            completedAt: null
          }
        ];
        setBackups(sampleBackups);
        setLoadingBackups(false);
      }, 1000);
    }
  }, [isAuthenticated, loading, router]);

  // Format date
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format file size
  const formatSize = (sizeInBytes: number | null): string => {
    if (sizeInBytes === null) return '-';
    
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
    }
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status: string): string => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get status text in Thai
  const getStatusText = (status: string): string => {
    switch(status) {
      case 'completed': return 'สำเร็จ';
      case 'in_progress': return 'กำลังดำเนินการ';
      case 'pending': return 'รอดำเนินการ';
      case 'failed': return 'ล้มเหลว';
      default: return status;
    }
  };
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">n8nThai Admin</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {user?.username} (แอดมิน)
            </span>
            <button
              onClick={logout}
              className="text-sm text-gray-600 hover:text-red-500"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex -mb-px">
              <Link href="/admin/dashboard" className="border-b-2 border-transparent hover:border-gray-300 py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                แดชบอร์ด
              </Link>
              <Link href="/admin/users" className="border-b-2 border-transparent hover:border-gray-300 py-4 px-1 ml-8 text-sm font-medium text-gray-500 hover:text-gray-700">
                ผู้ใช้
              </Link>
              <Link href="/admin/instances" className="border-b-2 border-transparent hover:border-gray-300 py-4 px-1 ml-8 text-sm font-medium text-gray-500 hover:text-gray-700">
                อินสแตนซ์
              </Link>
              <Link href="/admin/payments" className="border-b-2 border-transparent hover:border-gray-300 py-4 px-1 ml-8 text-sm font-medium text-gray-500 hover:text-gray-700">
                การชำระเงิน
              </Link>
              <Link href="/admin/backups" className="border-b-2 border-blue-500 py-4 px-1 ml-8 text-sm font-medium text-blue-600">
                ข้อมูลสำรอง
              </Link>
              <Link href="/admin/support" className="border-b-2 border-transparent hover:border-gray-300 py-4 px-1 ml-8 text-sm font-medium text-gray-500 hover:text-gray-700">
                ตั๋วสนับสนุน
              </Link>
              <Link href="/admin/system" className="border-b-2 border-transparent hover:border-gray-300 py-4 px-1 ml-8 text-sm font-medium text-gray-500 hover:text-gray-700">
                ระบบ
              </Link>
              <Link href="/admin/logs" className="border-b-2 border-transparent hover:border-gray-300 py-4 px-1 ml-8 text-sm font-medium text-gray-500 hover:text-gray-700">
                บันทึก
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">จัดการข้อมูลสำรอง</h1>
            <p className="mt-1 text-sm text-gray-500">
              ตรวจสอบสถานะและจัดการการสำรองข้อมูลทั้งหมดในระบบ
            </p>
          </div>
        </div>
        
        {/* Backups Table */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    อินสแตนซ์
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ผู้ใช้
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สร้างเมื่อ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ประเภท
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สถานะ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ขนาด
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    การจัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loadingBackups ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : backups.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      ไม่พบข้อมูลสำรอง
                    </td>
                  </tr>
                ) : (
                  backups.map((backup) => (
                    <tr key={backup.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {backup.instanceName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {backup.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(backup.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {backup.type === 'scheduled' ? 'ตามกำหนดเวลา' : 'ด้วยตนเอง'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(backup.status)}`}>
                          {getStatusText(backup.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatSize(backup.size)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          {backup.status === 'completed' && (
                            <>
                              <button className="text-blue-600 hover:text-blue-900">
                                กู้คืน
                              </button>
                              <button className="text-green-600 hover:text-green-900">
                                ดาวน์โหลด
                              </button>
                            </>
                          )}
                          <button className="text-red-600 hover:text-red-900">
                            ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
