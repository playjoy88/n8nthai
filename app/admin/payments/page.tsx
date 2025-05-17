'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Payment {
  id: string;
  userId: string;
  username: string;
  amount: number;
  paymentProvider: string;
  status: string;
  paymentDate: string;
  plan: string;
  invoiceId: string | null;
}

// List of admin usernames or emails
const ADMIN_USERS = ['admin@n8nthai.com', 'admin'];

export default function AdminPaymentsPage() {
  const { user, isAuthenticated, loading, token, logout } = useAuth();
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
  
  // Fetch sample payment data
  useEffect(() => {
    if (isAuthenticated && isAdmin()) {
      // Simulate API call with sample data
      setTimeout(() => {
        const samplePayments = [
          {
            id: '1',
            userId: 'user1',
            username: 'user1',
            amount: 799,
            paymentProvider: 'omise',
            status: 'completed',
            paymentDate: new Date().toISOString(),
            plan: 'pro',
            invoiceId: 'INV-001'
          },
          {
            id: '2',
            userId: 'user2',
            username: 'user2',
            amount: 299,
            paymentProvider: 'promptpay',
            status: 'pending',
            paymentDate: new Date().toISOString(),
            plan: 'basic',
            invoiceId: 'INV-002'
          },
          {
            id: '3',
            userId: 'user3',
            username: 'user3',
            amount: 2499,
            paymentProvider: 'bank_transfer',
            status: 'failed',
            paymentDate: new Date().toISOString(),
            plan: 'enterprise',
            invoiceId: null
          }
        ];
        
        setPayments(samplePayments);
        setLoadingPayments(false);
      }, 1000);
    }
  }, [isAuthenticated, token]);
  
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
      day: 'numeric'
    });
  };
  
  // Map payment status to Thai language
  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'สำเร็จ';
      case 'pending':
        return 'รอดำเนินการ';
      case 'failed':
        return 'ล้มเหลว';
      case 'refunded':
        return 'คืนเงินแล้ว';
      default:
        return status;
    }
  };
  
  // Map payment status to color class
  const getPaymentStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get payment provider text in Thai
  const getPaymentProviderText = (provider: string) => {
    switch (provider) {
      case 'omise':
        return 'บัตรเครดิต/เดบิต';
      case 'promptpay':
        return 'พร้อมเพย์';
      case 'bank_transfer':
        return 'โอนเงินผ่านธนาคาร';
      case 'manual':
        return 'ชำระเงินด้วยตนเอง';
      default:
        return provider;
    }
  };
  
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
              <Link href="/admin/payments" className="border-b-2 border-blue-500 py-4 px-1 ml-8 text-sm font-medium text-blue-600">
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

      {/* Payment Management Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">จัดการการชำระเงิน</h1>
            <p className="mt-1 text-sm text-gray-500">
              ตรวจสอบและจัดการประวัติการชำระเงินทั้งหมดในระบบ
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
        
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">รายได้วันนี้</h3>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{formatCurrency(799)}</p>
            <div className="mt-1 text-xs text-gray-500">จากธุรกรรมที่สำเร็จ</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">รายได้เดือนนี้</h3>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{formatCurrency(3596)}</p>
            <div className="mt-1 text-xs text-gray-500">จากธุรกรรมที่สำเร็จ</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">การชำระเงินทั้งหมด</h3>
            <p className="mt-2 text-2xl font-semibold text-gray-900">1</p>
            <div className="mt-1 text-xs text-green-600">ที่สำเร็จ (จาก 3 รายการ)</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">รอดำเนินการ</h3>
            <p className="mt-2 text-2xl font-semibold text-gray-900">1</p>
            <div className="mt-1 text-xs text-yellow-600">ต้องตรวจสอบ</div>
          </div>
        </div>
        
        {/* Payments Table */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ผู้ใช้
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    จำนวนเงิน
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    แพ็กเกจ
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    วิธีการชำระเงิน
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สถานะ
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    วันที่
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    การกระทำ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loadingPayments ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      ไม่พบการชำระเงิน
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payment.plan === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                          payment.plan === 'pro' ? 'bg-blue-100 text-blue-800' :
                          payment.plan === 'basic' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {payment.plan.charAt(0).toUpperCase() + payment.plan.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getPaymentProviderText(payment.paymentProvider)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusClass(payment.status)}`}>
                          {getPaymentStatusText(payment.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(payment.paymentDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <Link 
                            href={`/admin/payments/${payment.id}`} 
                            className="text-blue-600 hover:text-blue-900"
                          >
                            รายละเอียด
                          </Link>
                          
                          {payment.status === 'pending' && (
                            <button
                              className="text-green-600 hover:text-green-900"
                            >
                              ยืนยัน
                            </button>
                          )}
                          
                          {payment.status === 'completed' && (
                            <button
                              className="text-red-600 hover:text-red-900"
                            >
                              คืนเงิน
                            </button>
                          )}
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
