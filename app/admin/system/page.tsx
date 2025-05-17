'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SystemMetric {
  id: string;
  timestamp: string;
  metricType: string;
  value: number;
  serverName: string | null;
  details: any | null;
}

interface ResourceUsage {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkIn: number;
  networkOut: number;
}

// List of admin usernames or emails
const ADMIN_USERS = ['admin@n8nthai.com', 'admin'];

export default function AdminSystemPage() {
  const { user, isAuthenticated, loading, token, logout } = useAuth();
  const router = useRouter();
  const [resourceUsage, setResourceUsage] = useState<ResourceUsage>({
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    networkIn: 0,
    networkOut: 0,
  });
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('day');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [serverHealth, setServerHealth] = useState<'healthy' | 'warning' | 'critical'>('healthy');
  const [serverStatus, setServerStatus] = useState({
    apiServer: true,
    databaseServer: true,
    cacheServer: true,
    workerServer: true,
  });
  
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
  
  // Fetch system metrics on load and every 30 seconds
  useEffect(() => {
    if (isAuthenticated && isAdmin()) {
      fetchSystemMetrics();
      const interval = setInterval(fetchSystemMetrics, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, token, selectedTimeframe, selectedMetric]);
  
  // Fetch system metrics
  const fetchSystemMetrics = () => {
    // Simulate API call with sample data
    setLoadingMetrics(true);
    
    setTimeout(() => {
      // Generate CPU usage data
      const now = new Date();
      
      const cpuData: SystemMetric[] = Array.from({ length: 24 }).map((_, i) => {
        const timestamp = new Date(now.getTime() - (23 - i) * 3600 * 1000).toISOString();
        return {
          id: `cpu-${i}`,
          timestamp,
          metricType: 'cpu',
          value: 20 + Math.random() * 30, // Random between 20% and 50%
          serverName: 'main-api-server',
          details: null
        };
      });
      
      // Generate memory usage data
      const memoryData: SystemMetric[] = Array.from({ length: 24 }).map((_, i) => {
        const timestamp = new Date(now.getTime() - (23 - i) * 3600 * 1000).toISOString();
        return {
          id: `memory-${i}`,
          timestamp,
          metricType: 'memory',
          value: 40 + Math.random() * 30, // Random between 40% and 70%
          serverName: 'main-api-server',
          details: null
        };
      });
      
      // Generate disk usage data
      const diskData: SystemMetric[] = Array.from({ length: 24 }).map((_, i) => {
        const timestamp = new Date(now.getTime() - (23 - i) * 3600 * 1000).toISOString();
        return {
          id: `disk-${i}`,
          timestamp,
          metricType: 'disk',
          value: 50 + (i / 48) * 10 + Math.random() * 5, // Gradually increasing with some noise
          serverName: 'main-api-server',
          details: null
        };
      });
      
      // Generate network traffic data
      const networkInData: SystemMetric[] = Array.from({ length: 24 }).map((_, i) => {
        const timestamp = new Date(now.getTime() - (23 - i) * 3600 * 1000).toISOString();
        const isHighTraffic = i % 6 === 0; // Every 6 hours, simulate high traffic
        return {
          id: `network-in-${i}`,
          timestamp,
          metricType: 'network-in',
          value: isHighTraffic ? 80 + Math.random() * 20 : 20 + Math.random() * 30,
          serverName: 'main-api-server',
          details: null
        };
      });
      
      const networkOutData: SystemMetric[] = Array.from({ length: 24 }).map((_, i) => {
        const timestamp = new Date(now.getTime() - (23 - i) * 3600 * 1000).toISOString();
        const isHighTraffic = i % 6 === 0; // Every 6 hours, simulate high traffic
        return {
          id: `network-out-${i}`,
          timestamp,
          metricType: 'network-out',
          value: isHighTraffic ? 70 + Math.random() * 20 : 15 + Math.random() * 25,
          serverName: 'main-api-server',
          details: null
        };
      });
      
      // Combine all metrics
      const allMetrics = [...cpuData, ...memoryData, ...diskData, ...networkInData, ...networkOutData];
      
      // Filter based on selected metric
      let filteredMetrics = allMetrics;
      if (selectedMetric !== 'all') {
        filteredMetrics = allMetrics.filter(m => m.metricType === selectedMetric);
      }
      
      // Sort by timestamp
      filteredMetrics.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      setMetrics(filteredMetrics);
      
      // Set current resource usage (last value in each metric type)
      const latestCpu = cpuData[cpuData.length - 1].value;
      const latestMemory = memoryData[memoryData.length - 1].value;
      const latestDisk = diskData[diskData.length - 1].value;
      const latestNetworkIn = networkInData[networkInData.length - 1].value;
      const latestNetworkOut = networkOutData[networkOutData.length - 1].value;
      
      setResourceUsage({
        cpuUsage: latestCpu,
        memoryUsage: latestMemory,
        diskUsage: latestDisk,
        networkIn: latestNetworkIn,
        networkOut: latestNetworkOut
      });
      
      // Determine server health
      if (latestCpu > 80 || latestMemory > 90 || latestDisk > 90) {
        setServerHealth('critical');
      } else if (latestCpu > 70 || latestMemory > 80 || latestDisk > 80) {
        setServerHealth('warning');
      } else {
        setServerHealth('healthy');
      }
      
      setLoadingMetrics(false);
    }, 1000);
  };
  
  // Get health status class
  const getHealthStatusClass = (status: string) => {
    switch(status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get health status text in Thai
  const getHealthStatusText = (status: string) => {
    switch(status) {
      case 'healthy':
        return 'สถานะปกติ';
      case 'warning':
        return 'คำเตือน';
      case 'critical':
        return 'วิกฤต';
      default:
        return status;
    }
  };
  
  // Format number as percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };
  
  // Format network traffic
  const formatNetworkTraffic = (value: number) => {
    return `${value.toFixed(1)} MB/s`;
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
              <Link href="/admin/payments" className="border-b-2 border-transparent hover:border-gray-300 py-4 px-1 ml-8 text-sm font-medium text-gray-500 hover:text-gray-700">
                การชำระเงิน
              </Link>
              <Link href="/admin/backups" className="border-b-2 border-transparent hover:border-gray-300 py-4 px-1 ml-8 text-sm font-medium text-gray-500 hover:text-gray-700">
                ข้อมูลสำรอง
              </Link>
              <Link href="/admin/support" className="border-b-2 border-transparent hover:border-gray-300 py-4 px-1 ml-8 text-sm font-medium text-gray-500 hover:text-gray-700">
                ตั๋วสนับสนุน
              </Link>
              <Link href="/admin/system" className="border-b-2 border-blue-500 py-4 px-1 ml-8 text-sm font-medium text-blue-600">
                ระบบ
              </Link>
              <Link href="/admin/logs" className="border-b-2 border-transparent hover:border-gray-300 py-4 px-1 ml-8 text-sm font-medium text-gray-500 hover:text-gray-700">
                บันทึก
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* System Monitoring Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">ติดตามระบบ</h1>
            <p className="mt-1 text-sm text-gray-500">
              ติดตามสุขภาพและประสิทธิภาพของเซิร์ฟเวอร์
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getHealthStatusClass(serverHealth)}`}>
              {getHealthStatusText(serverHealth)}
            </span>
          </div>
        </div>
        
        {/* Current System Status */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">สถานะระบบปัจจุบัน</h3>
            <p className="mt-1 text-sm text-gray-500">อัพเดตล่าสุดเมื่อ 30 วินาทีที่ผ่านมา</p>
          </div>
          <div className="px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500">เซิร์ฟเวอร์ API</h4>
                <div className="mt-2 flex items-center">
                  <div className={`w-3 h-3 rounded-full ${serverStatus.apiServer ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="ml-2 text-sm font-medium text-gray-900">{serverStatus.apiServer ? 'ออนไลน์' : 'ออฟไลน์'}</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">เซิร์ฟเวอร์ฐานข้อมูล</h4>
                <div className="mt-2 flex items-center">
                  <div className={`w-3 h-3 rounded-full ${serverStatus.databaseServer ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="ml-2 text-sm font-medium text-gray-900">{serverStatus.databaseServer ? 'ออนไลน์' : 'ออฟไลน์'}</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">เซิร์ฟเวอร์แคช</h4>
                <div className="mt-2 flex items-center">
                  <div className={`w-3 h-3 rounded-full ${serverStatus.cacheServer ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="ml-2 text-sm font-medium text-gray-900">{serverStatus.cacheServer ? 'ออนไลน์' : 'ออฟไลน์'}</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">เซิร์ฟเวอร์งานพื้นหลัง</h4>
                <div className="mt-2 flex items-center">
                  <div className={`w-3 h-3 rounded-full ${serverStatus.workerServer ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="ml-2 text-sm font-medium text-gray-900">{serverStatus.workerServer ? 'ออนไลน์' : 'ออฟไลน์'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Resource Usage */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">การใช้ทรัพยากร</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* CPU Usage */}
              <div>
                <h4 className="text-sm font-medium text-gray-500">การใช้ CPU</h4>
                <div className="mt-2">
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-3 text-xs flex rounded bg-gray-200">
                      <div 
                        style={{ width: `${resourceUsage.cpuUsage}%` }} 
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                          resourceUsage.cpuUsage > 80 ? 'bg-red-500' : 
                          resourceUsage.cpuUsage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                      ></div>
                    </div>
                  </div>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{formatPercentage(resourceUsage.cpuUsage)}</p>
                </div>
              </div>
              
              {/* Memory Usage */}
              <div>
                <h4 className="text-sm font-medium text-gray-500">การใช้หน่วยความจำ</h4>
                <div className="mt-2">
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-3 text-xs flex rounded bg-gray-200">
                      <div 
                        style={{ width: `${resourceUsage.memoryUsage}%` }} 
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                          resourceUsage.memoryUsage > 90 ? 'bg-red-500' : 
                          resourceUsage.memoryUsage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                      ></div>
                    </div>
                  </div>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{formatPercentage(resourceUsage.memoryUsage)}</p>
                </div>
              </div>
              
              {/* Disk Usage */}
              <div>
                <h4 className="text-sm font-medium text-gray-500">การใช้พื้นที่จัดเก็บ</h4>
                <div className="mt-2">
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-3 text-xs flex rounded bg-gray-200">
                      <div 
                        style={{ width: `${resourceUsage.diskUsage}%` }} 
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                          resourceUsage.diskUsage > 90 ? 'bg-red-500' : 
                          resourceUsage.diskUsage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                      ></div>
                    </div>
                  </div>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{formatPercentage(resourceUsage.diskUsage)}</p>
                </div>
              </div>
              
              {/* Network In */}
              <div>
                <h4 className="text-sm font-medium text-gray-500">ทราฟฟิกขาเข้า</h4>
                <p className="mt-3 text-lg font-semibold text-gray-900">{formatNetworkTraffic(resourceUsage.networkIn)}</p>
              </div>
              
              {/* Network Out */}
              <div>
                <h4 className="text-sm font-medium text-gray-500">ทราฟฟิกขาออก</h4>
                <p className="mt-3 text-lg font-semibold text-gray-900">{formatNetworkTraffic(resourceUsage.networkOut)}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Metric Selection and Timeframe */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="metricSelect" className="block text-sm font-medium text-gray-700">เมทริกซ์</label>
                <select
                  id="metricSelect"
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="cpu">การใช้ CPU</option>
                  <option value="memory">การใช้หน่วยความจำ</option>
                  <option value="disk">การใช้พื้นที่จัดเก็บ</option>
                  <option value="network-in">ทราฟฟิกขาเข้า</option>
                  <option value="network-out">ทราฟฟิกขาออก</option>
                </select>
              </div>
              <div>
                <label htmlFor="timeframeSelect" className="block text-sm font-medium text-gray-700">ช่วงเวลา</label>
                <select
                  id="timeframeSelect"
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="hour">1 ชั่วโมง</option>
                  <option value="day">1 วัน</option>
                  <option value="week">1 สัปดาห์</option>
                  <option value="month">1 เดือน</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Metrics Chart Placeholder */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">กราฟเมทริกซ์</h3>
          </div>
          <div className="p-6">
            {loadingMetrics ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="h-80 w-full bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">แสดงเป็นกราฟแบบเส้นของเมทริกซ์ที่เลือก</p>
                <p className="text-gray-500 text-sm">(ควรใช้ไลบรารีกราฟ เช่น Chart.js หรือ Recharts ในการแสดงข้อมูลจริง)</p>
              </div>
            )}
          </div>
        </div>
        
        {/* System Management Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">การจัดการระบบ</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-base font-medium text-gray-900">ล้างแคช</h4>
                <p className="mt-1 text-sm text-gray-500">ล้างแคชของระบบทั้งหมดเพื่อปรับปรุงประสิทธิภาพ</p>
                <button className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  ล้างแคช
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-base font-medium text-gray-900">รีสตาร์ทบริการ</h4>
                <p className="mt-1 text-sm text-gray-500">รีสตาร์ทบริการต่างๆ ในกรณีที่เกิดปัญหา</p>
                <button className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                  รีสตาร์ทบริการ
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-base font-medium text-gray-900">บันทึกการวินิจฉัย</h4>
                <p className="mt-1 text-sm text-gray-500">สร้างบันทึกการวินิจฉัยของระบบสำหรับการแก้ไขปัญหา</p>
                <button className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  สร้างบันทึก
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
