'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DashboardStats {
  activeUsers: number;
  totalUsers: number;
  activeInstances: number;
  totalInstances: number;
  dailyRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
  openSupportTickets: number;
  totalBackups: number;
  failedBackups: number;
  serverUtilization: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
}

interface RecentUser {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  plan: string;
}

interface RecentPayment {
  id: string;
  userId: string;
  username: string;
  amount: number;
  status: string;
  paymentDate: string;
  plan: string;
}

// List of admin usernames or emails - in a real app, this would be stored in the database
const ADMIN_USERS = ['admin@n8nthai.com', 'admin'];

export default function AdminDashboardPage() {
  const { user, isAuthenticated, loading, token, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    activeUsers: 0,
    totalUsers: 0,
    activeInstances: 0,
    totalInstances: 0,
    dailyRevenue: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
    openSupportTickets: 0,
    totalBackups: 0,
    failedBackups: 0,
    serverUtilization: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
  });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is an admin
  const isAdmin = user && (ADMIN_USERS.includes(user.username) || ADMIN_USERS.includes(user.email));

  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router, isAdmin]);
  
  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;
      
      try {
        setLoadingStats(true);
        
        // Fetch overall stats
        const statsResponse = await fetch('/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!statsResponse.ok) {
          throw new Error('ไม่สามารถโหลดข้อมูลแดชบอร์ดได้');
        }
        
        const statsData = await statsResponse.json();
        setStats(statsData);
        
        // Set recent users and payments from the response
        if (statsData.recentUsers) {
          setRecentUsers(statsData.recentUsers);
        }
        
        if (statsData.recentPayments) {
          setRecentPayments(statsData.recentPayments);
        }
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('ไม่สามารถโหลดข้อมูลแดชบอร์ดได้');
      } finally {
        setLoadingStats(false);
      }
    };
    
    if (isAuthenticated && isAdmin) {
      fetchDashboardData();
    }
  }, [isAuthenticated, token, isAdmin]);
  
  // If loading, show loading spinner
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Format currency (Thai Baht)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date (Thai format)
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Map payment status to Thai language
  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'สำเร็จ';
      case 'pending':
        return 'รอดำเนินการ';
      case 'failed':
        return 'ล้มเหลว';
      default:
        return status;
    }
  };

  // Map payment status to color class
  const getPaymentStatusClass = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
              <Link href="/admin/dashboard" className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
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
              <Link href="/admin/logs" className="border-b-2 border-transparent hover:border-gray-300 py-4 px-1 ml-8 text-sm font-medium text-gray-500 hover:text-gray-700">
                บันทึก
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">แดชบอร์ดผู้ดูแลระบบ</h1>
        
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
        
        {loadingStats ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">ผู้ใช้</h3>
                <div className="mt-2 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{stats.activeUsers}</p>
                  <p className="ml-2 text-sm text-gray-500">จาก {stats.totalUsers} คน</p>
                </div>
                <div className="mt-1 text-xs text-green-600">ที่ใช้งานอยู่</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">อินสแตนซ์</h3>
                <div className="mt-2 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{stats.activeInstances}</p>
                  <p className="ml-2 text-sm text-gray-500">จาก {stats.totalInstances} อินสแตนซ์</p>
                </div>
                <div className="mt-1 text-xs text-green-600">ที่กำลังทำงาน</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">รายได้วันนี้</h3>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{formatCurrency(stats.dailyRevenue)}</p>
                <div className="mt-1 text-xs text-gray-500">รายเดือน: {formatCurrency(stats.monthlyRevenue)}</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">ตั๋วสนับสนุน</h3>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{stats.openSupportTickets}</p>
                <div className="mt-1 text-xs text-gray-500">ที่ยังไม่ได้ดำเนินการ</div>
              </div>
            </div>
            
            {/* Server Resources */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">ทรัพยากรเซิร์ฟเวอร์</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">CPU</span>
                    <span className="text-sm text-gray-500">{stats.cpuUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${stats.cpuUsage > 80 ? 'bg-red-500' : stats.cpuUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                      style={{ width: `${stats.cpuUsage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">หน่วยความจำ</span>
                    <span className="text-sm text-gray-500">{stats.memoryUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${stats.memoryUsage > 80 ? 'bg-red-500' : stats.memoryUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                      style={{ width: `${stats.memoryUsage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">พื้นที่ดิสก์</span>
                    <span className="text-sm text-gray-500">{stats.diskUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${stats.diskUsage > 80 ? 'bg-red-500' : stats.diskUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                      style={{ width: `${stats.diskUsage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Users and Payments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Users */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">ผู้ใช้ล่าสุด</h2>
                  <Link href="/admin/users" className="text-sm text-blue-600 hover:text-blue-800">
                    ดูทั้งหมด
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อผู้ใช้</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">อีเมล</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่สมัคร</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">แพ็กเกจ</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.plan === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                              user.plan === 'pro' ? 'bg-blue-100 text-blue-800' :
                              user.plan === 'basic' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Recent Payments */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">การชำระเงินล่าสุด</h2>
                  <Link href="/admin/payments" className="text-sm text-blue-600 hover:text-blue-800">
                    ดูทั้งหมด
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ผู้ใช้</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวนเงิน</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentPayments.map((payment) => (
                        <tr key={payment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.username}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(payment.amount)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(payment.paymentDate)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusClass(payment.status)}`}>
                              {getPaymentStatusText(payment.status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
