'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AuditLog {
  id: string;
  action: string;
  userId: string;
  username: string;
  userRole: string;
  timestamp: string;
  ipAddress: string;
  resourceType: string;
  resourceId: string | null;
  details: any | null;
}

// List of admin usernames or emails
const ADMIN_USERS = ['admin@n8nthai.com', 'admin'];

export default function AdminLogsPage() {
  const { user, isAuthenticated, loading, token, logout } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [resourceTypeFilter, setResourceTypeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);
  const [totalLogs, setTotalLogs] = useState(0);
  
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
  
  // Fetch audit logs
  useEffect(() => {
    if (isAuthenticated && isAdmin()) {
      // Simulate API call with sample data
      setLoadingLogs(true);
      
      setTimeout(() => {
        const sampleLogs: AuditLog[] = [
          {
            id: 'log-1',
            action: 'user.create',
            userId: 'admin-user-123',
            username: 'admin',
            userRole: 'admin',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
            ipAddress: '192.168.1.100',
            resourceType: 'user',
            resourceId: 'user-4',
            details: {
              email: 'newuser@example.com',
              plan: 'basic'
            }
          },
          {
            id: 'log-2',
            action: 'instance.start',
            userId: 'admin-user-123',
            username: 'admin',
            userRole: 'admin',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            ipAddress: '192.168.1.100',
            resourceType: 'instance',
            resourceId: 'inst-2',
            details: {
              userId: 'user-1',
              subdomain: 'customer1-test'
            }
          },
          {
            id: 'log-3',
            action: 'payment.refund',
            userId: 'admin-user-123',
            username: 'admin',
            userRole: 'admin',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            ipAddress: '192.168.1.100',
            resourceType: 'payment',
            resourceId: 'payment-3',
            details: {
              amount: 2499,
              reason: 'Customer request'
            }
          },
          {
            id: 'log-4',
            action: 'user.suspend',
            userId: 'admin-user-123',
            username: 'admin',
            userRole: 'admin',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            ipAddress: '192.168.1.100',
            resourceType: 'user',
            resourceId: 'user-3',
            details: {
              reason: 'Payment overdue'
            }
          },
          {
            id: 'log-5',
            action: 'backup.restore',
            userId: 'admin-user-123',
            username: 'admin',
            userRole: 'admin',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
            ipAddress: '192.168.1.100',
            resourceType: 'backup',
            resourceId: 'backup-1',
            details: {
              instanceId: 'inst-1',
              backupDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
            }
          },
          {
            id: 'log-6',
            action: 'system.restart',
            userId: 'admin-user-123',
            username: 'admin',
            userRole: 'admin',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
            ipAddress: '192.168.1.100',
            resourceType: 'system',
            resourceId: null,
            details: {
              reason: 'Scheduled maintenance'
            }
          },
          {
            id: 'log-7',
            action: 'user.update',
            userId: 'admin-user-123',
            username: 'admin',
            userRole: 'admin',
            timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
            ipAddress: '192.168.1.100',
            resourceType: 'user',
            resourceId: 'user-2',
            details: {
              changes: {
                plan: {
                  from: 'basic',
                  to: 'pro'
                }
              }
            }
          },
          {
            id: 'log-8',
            action: 'instance.stop',
            userId: 'admin-user-123',
            username: 'admin',
            userRole: 'admin',
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
            ipAddress: '192.168.1.100',
            resourceType: 'instance',
            resourceId: 'inst-3',
            details: {
              userId: 'user-2',
              subdomain: 'customer2-main',
              reason: 'Maintenance'
            }
          },
          {
            id: 'log-9',
            action: 'support.close',
            userId: 'admin-user-123',
            username: 'admin',
            userRole: 'admin',
            timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
            ipAddress: '192.168.1.100',
            resourceType: 'support',
            resourceId: 'ticket-5',
            details: {
              resolution: 'Issue resolved',
              userId: 'user-2'
            }
          },
          {
            id: 'log-10',
            action: 'system.update',
            userId: 'admin-user-123',
            username: 'admin',
            userRole: 'admin',
            timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
            ipAddress: '192.168.1.100',
            resourceType: 'system',
            resourceId: null,
            details: {
              version: '1.2.0',
              changes: 'Security patches and bug fixes'
            }
          }
        ];
        
        // Generate more logs for pagination demo
        const moreLogs = [];
        for (let i = 11; i <= 30; i++) {
          moreLogs.push({
            id: `log-${i}`,
            action: ['user.login', 'user.logout', 'instance.update', 'payment.create', 'system.backup'][Math.floor(Math.random() * 5)],
            userId: 'admin-user-123',
            username: 'admin',
            userRole: 'admin',
            timestamp: new Date(Date.now() - (10 + i) * 24 * 60 * 60 * 1000).toISOString(),
            ipAddress: '192.168.1.100',
            resourceType: ['user', 'instance', 'payment', 'system', 'backup'][Math.floor(Math.random() * 5)],
            resourceId: Math.random() > 0.3 ? `resource-${i}` : null,
            details: {
              note: `Sample log ${i}`
            }
          });
        }
        
        const allLogs = [...sampleLogs, ...moreLogs];
        
        // Sort by timestamp (newest first)
        allLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        setLogs(allLogs);
        setTotalLogs(allLogs.length);
        setLoadingLogs(false);
      }, 1000);
    }
  }, [isAuthenticated, token]);
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  // Format action for display
  const formatAction = (action: string) => {
    const parts = action.split('.');
    if (parts.length === 2) {
      return `${parts[0]}.${parts[1].charAt(0).toUpperCase() + parts[1].slice(1)}`;
    }
    return action;
  };
  
  // Get action Thai text
  const getActionText = (action: string) => {
    const actionMap: Record<string, string> = {
      'user.create': 'สร้างผู้ใช้',
      'user.update': 'อัปเดตผู้ใช้',
      'user.delete': 'ลบผู้ใช้',
      'user.suspend': 'ระงับผู้ใช้',
      'user.login': 'เข้าสู่ระบบ',
      'user.logout': 'ออกจากระบบ',
      'instance.create': 'สร้างอินสแตนซ์',
      'instance.update': 'อัปเดตอินสแตนซ์',
      'instance.delete': 'ลบอินสแตนซ์',
      'instance.start': 'เริ่มอินสแตนซ์',
      'instance.stop': 'หยุดอินสแตนซ์',
      'instance.restart': 'รีสตาร์ทอินสแตนซ์',
      'payment.create': 'สร้างการชำระเงิน',
      'payment.update': 'อัปเดตการชำระเงิน',
      'payment.refund': 'คืนเงิน',
      'backup.create': 'สร้างข้อมูลสำรอง',
      'backup.restore': 'กู้คืนข้อมูล',
      'backup.delete': 'ลบข้อมูลสำรอง',
      'system.update': 'อัปเดตระบบ',
      'system.restart': 'รีสตาร์ทระบบ',
      'system.backup': 'สำรองระบบ',
      'support.create': 'สร้างตั๋วสนับสนุน',
      'support.update': 'อัปเดตตั๋วสนับสนุน',
      'support.close': 'ปิดตั๋วสนับสนุน'
    };
    
    return actionMap[action] || action;
  };
  
  // Get resource type Thai text
  const getResourceTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      'user': 'ผู้ใช้',
      'instance': 'อินสแตนซ์',
      'payment': 'การชำระเงิน',
      'backup': 'ข้อมูลสำรอง',
      'system': 'ระบบ',
      'support': 'การสนับสนุน'
    };
    
    return typeMap[type] || type;
  };
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };
  
  // Handle date range selection
  const handleDateRangeChange = (range: string) => {
    const now = new Date();
    let start = new Date();
    
    switch(range) {
      case 'today':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'yesterday':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        break;
      case 'week':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        break;
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      default:
        // Clear the date range
        setStartDate('');
        setEndDate('');
        return;
    }
    
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(now.toISOString().split('T')[0]);
  };
  
  // Get filtered logs
  const getFilteredLogs = () => {
    return logs.filter(log => {
      // Apply action filter
      if (actionFilter !== 'all') {
        const [resourceType, action] = actionFilter.split('.');
        if (!log.action.startsWith(`${resourceType}.${action}`)) {
          return false;
        }
      }
      
      // Apply resource type filter
      if (resourceTypeFilter !== 'all' && log.resourceType !== resourceTypeFilter) {
        return false;
      }
      
      // Apply date range filter
      if (startDate && endDate) {
        const logDate = new Date(log.timestamp).toISOString().split('T')[0];
        if (logDate < startDate || logDate > endDate) {
          return false;
        }
      }
      
      // Apply search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          log.username.toLowerCase().includes(searchLower) ||
          log.action.toLowerCase().includes(searchLower) ||
          (log.resourceId && log.resourceId.toLowerCase().includes(searchLower)) ||
          (log.details && JSON.stringify(log.details).toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    });
  };
  
  const filteredLogs = getFilteredLogs();
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  
  // If loading, show loading spinner
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
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
              <Link href="/admin/instances" className="border-b-2 border-transparent hover:border-gray-300 py-4 px-1 ml-8 text-sm font-medium text-gray-500 hover:text-gray-700">
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
              <Link href="/admin/logs" className="border-b-2 border-blue-500 py-4 px-1 ml-8 text-sm font-medium text-blue-600">
                บันทึก
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Audit Logs Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">บันทึกการตรวจสอบ</h1>
            <p className="mt-1 text-sm text-gray-500">
              ติดตามและตรวจสอบการกระทำของผู้ดูแลระบบทั้งหมด
            </p>
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-4 border-b border-gray-200 sm:p-6">
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-4">
                <div>
                  <label htmlFor="actionFilter" className="block text-sm font-medium text-gray-700">การกระทำ</label>
                  <select
                    id="actionFilter"
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="all">ทั้งหมด</option>
                    <optgroup label="ผู้ใช้">
                      <option value="user.create">สร้างผู้ใช้</option>
                      <option value="user.update">อัปเดตผู้ใช้</option>
                      <option value="user.delete">ลบผู้ใช้</option>
                      <option value="user.suspend">ระงับผู้ใช้</option>
                    </optgroup>
                    <optgroup label="อินสแตนซ์">
                      <option value="instance.create">สร้างอินสแตนซ์</option>
                      <option value="instance.update">อัปเดตอินสแตนซ์</option>
                      <option value="instance.delete">ลบอินสแตนซ์</option>
                      <option value="instance.start">เริ่มอินสแตนซ์</option>
                      <option value="instance.stop">หยุดอินสแตนซ์</option>
                    </optgroup>
                    <optgroup label="การชำระเงิน">
                      <option value="payment.create">สร้างการชำระเงิน</option>
                      <option value="payment.update">อัปเดตการชำระเงิน</option>
                      <option value="payment.refund">คืนเงิน</option>
                    </optgroup>
                    <optgroup label="ระบบ">
                      <option value="system.update">อัปเดตระบบ</option>
                      <option value="system.restart">รีสตาร์ทระบบ</option>
                    </optgroup>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="resourceTypeFilter" className="block text-sm font-medium text-gray-700">ประเภททรัพยากร</label>
                  <select
                    id="resourceTypeFilter"
                    value={resourceTypeFilter}
                    onChange={(e) => setResourceTypeFilter(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="all">ทั้งหมด</option>
                    <option value="user">ผู้ใช้</option>
                    <option value="instance">อินสแตนซ์</option>
                    <option value="payment">การชำระเงิน</option>
                    <option value="backup">ข้อมูลสำรอง</option>
                    <option value="system">ระบบ</option>
                    <option value="support">การสนับสนุน</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700">ช่วงเวลา</label>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <input
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="mt-2 flex space-x-2">
                    <button 
                      type="button" 
                      onClick={() => handleDateRangeChange('today')}
                      className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      วันนี้
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleDateRangeChange('week')}
                      className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      7 วัน
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleDateRangeChange('month')}
                      className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      30 วัน
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleDateRangeChange('clear')}
                      className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      ล้าง
                    </button>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700">ค้นหา</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="ค้นหาด้วยผู้ใช้, การกระทำ, หรือรายละเอียด"
                      className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full min-w-0 rounded-md sm:text-sm border-gray-300"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ml-2"
                    >
                      ค้นหา
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        
        {/* Logs Table */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      เวลา
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ผู้ใช้
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      การกระทำ
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ประเภททรัพยากร
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      รหัสทรัพยากร
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      รายละเอียด
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loadingLogs ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedLogs.length === 0 ? (
                    <tr>
