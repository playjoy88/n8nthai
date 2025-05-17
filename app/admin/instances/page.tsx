'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Define Instance interface based on the schema
interface Instance {
  id: string;
  userId: string;
  username: string;
  subdomain: string;
  customDomain: string | null;
  status: 'provisioning' | 'running' | 'stopped' | 'restarting' | 'failed' | 'suspended';
  cpuAllocation: number;
  ramAllocation: number;
  diskAllocation: number;
  createdAt: string;
  lastBackupAt: string | null;
  port: number;
  isBackedUp: boolean;
}

// List of admin usernames or emails
const ADMIN_USERS = ['admin@n8nthai.com', 'admin'];

export default function AdminInstancesPage() {
  const { user, isAuthenticated, loading, token, logout } = useAuth();
  const router = useRouter();
  const [instances, setInstances] = useState<Instance[]>([]);
  const [loadingInstances, setLoadingInstances] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [instanceCount, setInstanceCount] = useState(0);
  const [pageSize] = useState(10);
  
  // Check if user is an admin
  const isAdmin = () => {
    return user && (ADMIN_USERS.includes(user.username) || ADMIN_USERS.includes(user.email));
  };

  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin())) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);
  
  // Fetch sample instance data
  useEffect(() => {
    if (isAuthenticated && isAdmin()) {
      // Simulate API call with sample data
      setTimeout(() => {
        setInstances([
          {
            id: '1',
            userId: 'user1',
            username: 'user1',
            subdomain: 'user1-n8n',
            customDomain: 'workflow.example.com',
            status: 'running',
            cpuAllocation: 1,
            ramAllocation: 1024,
            diskAllocation: 10,
            createdAt: new Date().toISOString(),
            lastBackupAt: new Date().toISOString(),
            port: 5678,
            isBackedUp: true
          },
          {
            id: '2',
            userId: 'user2',
            username: 'user2',
            subdomain: 'user2-n8n',
            customDomain: null,
            status: 'stopped',
            cpuAllocation: 2,
            ramAllocation: 2048,
            diskAllocation: 20,
            createdAt: new Date().toISOString(),
            lastBackupAt: null,
            port: 5679,
            isBackedUp: false
          },
          {
            id: '3',
            userId: 'user3',
            username: 'user3',
            subdomain: 'user3-n8n',
            customDomain: null,
            status: 'failed',
            cpuAllocation: 1,
            ramAllocation: 1024,
            diskAllocation: 10,
            createdAt: new Date().toISOString(),
            lastBackupAt: null,
            port: 5680,
            isBackedUp: false
          }
        ]);
        setInstanceCount(3);
        setLoadingInstances(false);
      }, 1000);
    }
  }, [isAuthenticated, token]);
  
  // Handle instance control actions
  const handleControlAction = async (instanceId: string, action: 'start' | 'stop' | 'restart') => {
    // In a real app, this would send a request to the API
    try {
      // Optimistic UI update
      setInstances(instances.map(instance => {
        if (instance.id === instanceId) {
          let newStatus: 'provisioning' | 'running' | 'stopped' | 'restarting' | 'failed' | 'suspended';
          
          if (action === 'start') {
            newStatus = 'running';
          } else if (action === 'stop') {
            newStatus = 'stopped';
          } else if (action === 'restart') {
            newStatus = 'restarting';
          } else {
            return instance;
          }
          
          return { ...instance, status: newStatus };
        }
        return instance;
      }));
      
      // Show success message or something
    } catch (error) {
      console.error(`Failed to ${action} instance:`, error);
      setError(`ไม่สามารถ${action === 'start' ? 'เริ่ม' : action === 'stop' ? 'หยุด' : 'รีสตาร์ท'}อินสแตนซ์ได้`);
    }
  };
  
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format RAM size
  const formatRAM = (ramInMB: number) => {
    if (ramInMB >= 1024) {
      return `${(ramInMB / 1024).toFixed(1)} GB`;
    }
    return `${ramInMB} MB`;
  };
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };
  
  // If loading, show loading spinner
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'running':
        return 'bg-green-100 text-green-800';
      case 'stopped':
        return 'bg-gray-100 text-gray-800';
      case 'provisioning':
        return 'bg-blue-100 text-blue-800';
      case 'restarting':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get status text in Thai
  const getStatusText = (status: string) => {
    switch(status) {
      case 'running':
        return 'กำลังทำงาน';
      case 'stopped':
        return 'หยุดทำงาน';
      case 'provisioning':
        return 'กำลังเตรียม';
      case 'restarting':
        return 'กำลังรีสตาร์ท';
      case 'failed':
        return 'ล้มเหลว';
      case 'suspended':
        return 'ถูกระงับ';
      default:
        return status;
    }
  };
  
  // Calculate total pages
  const totalPages = Math.ceil(instanceCount / pageSize);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
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
        
        {/* Admin Navigation */}
        <div className="border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex -mb-px">
              <Link href="/admin/dashboard" className="border-b-2 border-transparent hover:border-gray-300 py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                แดชบอร์ด
              </Link>
              <Link href="/admin/users" className="border-b-2 border-transparent hover:border-gray-300 py-4 px-1 ml-8 text-sm font-medium text-gray-500 hover:text-gray-700">
                ผู้ใช้
              </Link>
              <Link href="/admin/instances" className="border-b-2 border-blue-500 py-4 px-1 ml-8 text-sm font-medium text-blue-600">
                อินสแตนซ์
              </Link>
              <Link href="/admin/payments" className="border-b-2 border-transparent hover:border-gray-300 py-4 px-1 ml-8 text-sm font-medium text-gray-500 hover:text-gray-700">
                การชำระเงิน
              </Link>
              <Link href="/admin/backups" className="border-b-2 border-transparent hover:border-gray-300 py-4 px-1 ml-8 text-sm font-medium text-gray-500 hover:text-gray-700">
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

      {/* Instance Management Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">จัดการอินสแตนซ์</h1>
            <p className="mt-1 text-sm text-gray-500">
              จัดการอินสแตนซ์ n8n ทั้งหมดในระบบ เริ่ม หยุด และรีสตาร์ท
            </p>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
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
        
        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-4 border-b border-gray-200 sm:p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">สถานะ</label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="running">กำลังทำงาน</option>
                  <option value="stopped">หยุดทำงาน</option>
                  <option value="provisioning">กำลังเตรียม</option>
                  <option value="restarting">กำลังรีสตาร์ท</option>
                  <option value="failed">ล้มเหลว</option>
                  <option value="suspended">ถูกระงับ</option>
                </select>
              </div>
              
              {/* Search */}
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">ค้นหา</label>
                <form onSubmit={handleSearch} className="mt-1 flex">
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ค้นหาด้วยชื่อผู้ใช้หรือโดเมน"
                    className="block w-full border-gray-300 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                    ค้นหา
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        
        {/* Instances Table */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ผู้ใช้
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    โดเมน
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สถานะ
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ทรัพยากร
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    วันที่สร้าง
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ข้อมูลสำรองล่าสุด
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    การกระทำ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loadingInstances ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : instances.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      ไม่พบอินสแตนซ์
                    </td>
                  </tr>
                ) : (
                  instances.map((instance) => (
                    <tr key={instance.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {instance.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{instance.subdomain}.n8nthai.app</div>
                        {instance.customDomain && (
                          <div className="text-xs text-gray-400 mt-1">{instance.customDomain}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(instance.status)}`}>
                          {getStatusText(instance.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>CPU: {instance.cpuAllocation} cores</div>
                        <div>RAM: {formatRAM(instance.ramAllocation)}</div>
                        <div>Disk: {instance.diskAllocation} GB</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(instance.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {instance.lastBackupAt ? (
                          formatDate(instance.lastBackupAt)
                        ) : (
                          <span className="text-red-500">ไม่มีข้อมูลสำรอง</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <Link 
                            href={`/admin/instances/${instance.id}`} 
                            className="text-blue-600 hover:text-blue-900"
                          >
                            รายละเอียด
                          </Link>
                          
                          {instance.status === 'stopped' && (
                            <button
                              onClick={() => handleControlAction(instance.id, 'start')}
                              className="text-green-600 hover:text-green-900"
                            >
                              เริ่ม
                            </button>
                          )}
                          
                          {instance.status === 'running' && (
                            <>
                              <button
                                onClick={() => handleControlAction(instance.id, 'stop')}
                                className="text-red-600 hover:text-red-900"
                              >
                                หยุด
                              </button>
                              
                              <button
                                onClick={() => handleControlAction(instance.id, 'restart')}
                                className="text-yellow-600 hover:text-yellow-900"
                              >
                                รีสตาร์ท
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    แสดง <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> ถึง <span className="font-medium">{Math.min(currentPage * pageSize, instanceCount)}</span> จาก <span className="font-medium">{instanceCount}</span> รายการ
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        // Show all pages if 5 or fewer
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        // At the beginning
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        // At the end
                        pageNum = totalPages - 4 + i;
                      } else {
                        // In the middle
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === pageNum
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
