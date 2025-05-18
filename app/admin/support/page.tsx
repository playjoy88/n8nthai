'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SupportTicket {
  id: string;
  userId: string;
  username: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'waiting_for_customer' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  assignedTo: string | null;
  closedAt: string | null;
}

interface TicketMessage {
  id: string;
  ticketId: string;
  sender: string;
  message: string;
  isFromAdmin: boolean;
  createdAt: string;
}

// List of admin usernames or emails
const ADMIN_USERS = ['admin@n8nthai.com', 'admin'];

export default function AdminSupportPage() {
  const { user, isAuthenticated, loading, token, logout } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketMessages, setTicketMessages] = useState<TicketMessage[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketCount, setTicketCount] = useState(0);
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
  
  // Fetch sample ticket data
  useEffect(() => {
    if (isAuthenticated && isAdmin()) {
      // Simulate API call with sample data
      setTimeout(() => {
        const sampleTickets = [
          {
            id: 'ticket-1',
            userId: 'user-1',
            username: 'customer1',
            subject: 'ไม่สามารถเริ่มต้นอินสแตนซ์ได้',
            description: 'ผมพยายามเริ่มต้นอินสแตนซ์หลายครั้งแล้ว แต่สถานะยังคงแสดงว่า "หยุดทำงาน" ช่วยตรวจสอบให้หน่อยครับ',
            status: 'open' as const,
            priority: 'high' as const,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            assignedTo: null,
            closedAt: null
          },
          {
            id: 'ticket-2',
            userId: 'user-2',
            username: 'customer2',
            subject: 'ต้องการเปลี่ยนแพ็กเกจ',
            description: 'ผมต้องการอัพเกรดจากแพ็กเกจ Basic เป็น Pro ทำอย่างไรครับ?',
            status: 'in_progress' as const,
            priority: 'medium' as const,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
            assignedTo: 'admin',
            closedAt: null
          },
          {
            id: 'ticket-3',
            userId: 'user-1',
            username: 'customer1',
            subject: 'การสำรองข้อมูลล้มเหลว',
            description: 'การสำรองข้อมูลอัตโนมัติล้มเหลวในคืนที่ผ่านมา มีข้อความผิดพลาดว่า "Not enough disk space"',
            status: 'waiting_for_customer' as const,
            priority: 'high' as const,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            assignedTo: 'admin',
            closedAt: null
          },
          {
            id: 'ticket-4',
            userId: 'user-3',
            username: 'customer3',
            subject: 'ต้องการเพิ่มโดเมนที่กำหนดเอง',
            description: 'ผมต้องการใช้โดเมนที่กำหนดเองสำหรับอินสแตนซ์ n8n ของผม ต้องทำอย่างไรบ้าง?',
            status: 'resolved' as const,
            priority: 'low' as const,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            assignedTo: 'admin',
            closedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
          },
          {
            id: 'ticket-5',
            userId: 'user-2',
            username: 'customer2',
            subject: 'ปัญหาการชำระเงิน',
            description: 'ผมชำระเงินผ่านบัตรเครดิตแล้ว แต่ระบบยังแสดงว่าผมยังไม่ได้ชำระเงิน',
            status: 'closed' as const,
            priority: 'medium' as const,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
            updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
            assignedTo: 'admin',
            closedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() // 6 days ago
          }
        ];
        
        setTickets(sampleTickets);
        setTicketCount(sampleTickets.length);
        setLoadingTickets(false);
      }, 1000);
    }
  }, [isAuthenticated, token]);
  
  // Fetch ticket messages when a ticket is selected
  useEffect(() => {
    if (selectedTicket) {
      // Simulate API call with sample data
      setTicketMessages([]);
      setTimeout(() => {
        const sampleMessages = [
          {
            id: `message-${selectedTicket.id}-1`,
            ticketId: selectedTicket.id,
            sender: selectedTicket.username,
            message: selectedTicket.description,
            isFromAdmin: false,
            createdAt: selectedTicket.createdAt
          }
        ];
        
        // Add some sample replies for certain tickets
        if (selectedTicket.id === 'ticket-2') {
          sampleMessages.push({
            id: `message-${selectedTicket.id}-2`,
            ticketId: selectedTicket.id,
            sender: 'admin',
            message: 'สวัสดีคุณ customer2 ท่านสามารถอัพเกรดแพ็กเกจได้ในหน้าแดชบอร์ดของท่าน โดยคลิกที่เมนู "แพ็กเกจของฉัน" และเลือก "อัพเกรด" ครับ',
            isFromAdmin: true,
            createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString() // 20 hours ago
          });
          sampleMessages.push({
            id: `message-${selectedTicket.id}-3`,
            ticketId: selectedTicket.id,
            sender: 'customer2',
            message: 'ผมได้ลองทำตามที่แนะนำแล้ว แต่ไม่พบปุ่มอัพเกรดครับ',
            isFromAdmin: false,
            createdAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString() // 15 hours ago
          });
          sampleMessages.push({
            id: `message-${selectedTicket.id}-4`,
            ticketId: selectedTicket.id,
            sender: 'admin',
            message: 'ขออภัยในความไม่สะดวกครับ เราจะตรวจสอบปัญหาดังกล่าวและแก้ไขให้เร็วที่สุด ในระหว่างนี้ ท่านสามารถอัพเกรดโดยติดต่อทีมงานของเราโดยตรงที่ support@n8nthai.com ได้ครับ',
            isFromAdmin: true,
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago
          });
        } else if (selectedTicket.id === 'ticket-3') {
          sampleMessages.push({
            id: `message-${selectedTicket.id}-2`,
            ticketId: selectedTicket.id,
            sender: 'admin',
            message: 'สวัสดีครับคุณ customer1 เราตรวจสอบพบว่าพื้นที่จัดเก็บข้อมูลของท่านเต็มแล้ว ท่านสามารถเพิ่มพื้นที่จัดเก็บข้อมูลได้โดยอัพเกรดแพ็กเกจ หรือลบข้อมูลที่ไม่จำเป็นออกเพื่อเพิ่มพื้นที่ว่างครับ',
            isFromAdmin: true,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
          });
          sampleMessages.push({
            id: `message-${selectedTicket.id}-3`,
            ticketId: selectedTicket.id,
            sender: 'admin',
            message: 'มีข้อสงสัยเพิ่มเติมหรือไม่ครับ? หากไม่มีคำตอบภายใน 24 ชั่วโมง เราจะปิดตั๋วนี้ครับ',
            isFromAdmin: true,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
          });
        }
        
        setTicketMessages(sampleMessages);
      }, 500);
    }
  }, [selectedTicket]);
  
  // Handle ticket selection
  const handleSelectTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
  };
  
  // Handle ticket reply submission
  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTicket || !replyMessage.trim()) return;
    
    // Simulate API call
    const newMessage: TicketMessage = {
      id: `message-${selectedTicket.id}-${ticketMessages.length + 1}`,
      ticketId: selectedTicket.id,
      sender: 'admin',
      message: replyMessage,
      isFromAdmin: true,
      createdAt: new Date().toISOString()
    };
    
    setTicketMessages([...ticketMessages, newMessage]);
    
    // Update ticket status to in_progress if it was open
    if (selectedTicket.status === 'open') {
      const updatedTicket = {
        ...selectedTicket,
        status: 'in_progress' as const,
        assignedTo: user?.username || 'admin',
        updatedAt: new Date().toISOString()
      };
      setSelectedTicket(updatedTicket);
      setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
    }
    
    setReplyMessage('');
  };
  
  // Handle ticket status update
  const handleStatusUpdate = (newStatus: SupportTicket['status']) => {
    if (!selectedTicket) return;
    
    // Simulate API call
    const updatedTicket = {
      ...selectedTicket,
      status: newStatus,
      assignedTo: selectedTicket.assignedTo || user?.username || 'admin',
      updatedAt: new Date().toISOString(),
      closedAt: ['resolved', 'closed'].includes(newStatus) ? new Date().toISOString() : selectedTicket.closedAt
    };
    
    setSelectedTicket(updatedTicket);
    setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
    
    // Add a system message for status change
    const statusMessages: Record<string, string> = {
      open: 'เปิดตั๋วใหม่',
      in_progress: 'กำลังดำเนินการ',
      waiting_for_customer: 'รอการตอบกลับจากลูกค้า',
      resolved: 'ได้รับการแก้ไขแล้ว',
      closed: 'ปิดตั๋วแล้ว'
    };
    
    const newMessage: TicketMessage = {
      id: `message-${selectedTicket.id}-${ticketMessages.length + 1}`,
      ticketId: selectedTicket.id,
      sender: 'system',
      message: `Admin เปลี่ยนสถานะเป็น: ${statusMessages[newStatus]}`,
      isFromAdmin: true,
      createdAt: new Date().toISOString()
    };
    
    setTicketMessages([...ticketMessages, newMessage]);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get time ago
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    
    if (diffSec < 60) {
      return 'เมื่อไม่กี่วินาทีที่ผ่านมา';
    } else if (diffMin < 60) {
      return `${diffMin} นาทีที่ผ่านมา`;
    } else if (diffHour < 24) {
      return `${diffHour} ชั่วโมงที่ผ่านมา`;
    } else if (diffDay < 30) {
      return `${diffDay} วันที่ผ่านมา`;
    } else {
      return formatDate(dateString);
    }
  };
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };
  
  // Get filtered and searched tickets
  const getFilteredTickets = () => {
    return tickets.filter(ticket => {
      // Apply status filter
      if (statusFilter !== 'all' && ticket.status !== statusFilter) {
        return false;
      }
      
      // Apply priority filter
      if (priorityFilter !== 'all' && ticket.priority !== priorityFilter) {
        return false;
      }
      
      // Apply search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          ticket.subject.toLowerCase().includes(searchLower) ||
          ticket.username.toLowerCase().includes(searchLower) ||
          ticket.id.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  };
  
  // Get ticket stats
  const getTicketStats = () => {
    const openTickets = tickets.filter(t => t.status === 'open').length;
    const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
    const waitingTickets = tickets.filter(t => t.status === 'waiting_for_customer').length;
    const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
    const closedTickets = tickets.filter(t => t.status === 'closed').length;
    
    const highPriorityTickets = tickets.filter(t => t.priority === 'high' && ['open', 'in_progress'].includes(t.status)).length;
    
    return {
      openTickets,
      inProgressTickets,
      waitingTickets,
      resolvedTickets,
      closedTickets,
      highPriorityTickets
    };
  };
  
  const filteredTickets = getFilteredTickets();
  const paginatedTickets = filteredTickets.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const ticketStats = getTicketStats();
  
  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'waiting_for_customer':
        return 'bg-purple-100 text-purple-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get priority badge class
  const getPriorityBadgeClass = (priority: string) => {
    switch(priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get status text in Thai
  const getStatusText = (status: string) => {
    switch(status) {
      case 'open':
        return 'เปิด';
      case 'in_progress':
        return 'กำลังดำเนินการ';
      case 'waiting_for_customer':
        return 'รอลูกค้า';
      case 'resolved':
        return 'แก้ไขแล้ว';
      case 'closed':
        return 'ปิด';
      default:
        return status;
    }
  };
  
  // Get priority text in Thai
  const getPriorityText = (priority: string) => {
    switch(priority) {
      case 'low':
        return 'ต่ำ';
      case 'medium':
        return 'ปานกลาง';
      case 'high':
        return 'สูง';
      case 'urgent':
        return 'เร่งด่วน';
      default:
        return priority;
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

  // Calculate total pages
  const totalPages = Math.ceil(filteredTickets.length / pageSize);
  
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
              <Link href="/admin/support" className="border-b-2 border-blue-500 py-4 px-1 ml-8 text-sm font-medium text-blue-600">
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

      {/* Support Ticket Management Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">จัดการตั๋วสนับสนุน</h1>
            <p className="mt-1 text-sm text-gray-500">
              ตอบคำถามและให้ความช่วยเหลือลูกค้าของคุณ
            </p>
          </div>
        </div>
        
        {/* Ticket Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">ตั๋วที่เปิด</h3>
            <p className="mt-2 text-2xl font-semibold text-blue-600">{ticketStats.openTickets}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">กำลังดำเนินการ</h3>
            <p className="mt-2 text-2xl font-semibold text-yellow-600">{ticketStats.inProgressTickets}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">รอการตอบกลับ</h3>
            <p className="mt-2 text-2xl font-semibold text-purple-600">{ticketStats.waitingTickets}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">แก้ไขแล้ว</h3>
            <p className="mt-2 text-2xl font-semibold text-green-600">{ticketStats.resolvedTickets}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">ปิดแล้ว</h3>
            <p className="mt-2 text-2xl font-semibold text-gray-600">{ticketStats.closedTickets}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">ความสำคัญสูง</h3>
            <p className="mt-2 text-2xl font-semibold text-orange-600">{ticketStats.highPriorityTickets}</p>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
          {/* Ticket List */}
          <div className="lg:w-2/5">
            {/* Filters and Search */}
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="p-4 border-b border-gray-200 sm:p-6">
                <form onSubmit={handleSearch}>
                  <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
                    <div className="sm:col-span-2">
                      <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">สถานะ</label>
                      <select
                        id="statusFilter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="all">ทั้งหมด</option>
                        <option value="open">เปิด</option>
                        <option value="in_progress">กำลังดำเนินการ</option>
                        <option value="waiting_for_customer">รอลูกค้า</option>
                        <option value="resolved">แก้ไขแล้ว</option>
                        <option value="closed">ปิด</option>
                      </select>
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="priorityFilter" className="block text-sm font-medium text-gray-700">ความสำคัญ</label>
                      <select
                        id="priorityFilter"
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="all">ทั้งหมด</option>
                        <option value="low">ต่ำ</option>
                        <option value="medium">ปานกลาง</option>
                        <option value="high">สูง</option>
                        <option value="urgent">เร่งด่วน</option>
                      </select>
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="search" className="block text-sm font-medium text-gray-700">ค้นหา</label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          name="search"
                          id="search"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                          placeholder="ชื่อผู้ใช้, ID หรือหัวข้อ"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-5">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      ค้นหาตั๋ว
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            <div className="bg-white shadow rounded-lg overflow-hidden">
              {loadingTickets ? (
                <div className="p-4 flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <>
                  {paginatedTickets.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      ไม่พบตั๋วที่ตรงกับเงื่อนไขการค้นหา
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {paginatedTickets.map((ticket) => (
                        <li 
                          key={ticket.id}
                          className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedTicket?.id === ticket.id ? 'bg-blue-50' : ''}`}
                          onClick={() => handleSelectTicket(ticket)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-blue-600 truncate">
                                {ticket.subject}
                              </p>
                              <div className="mt-1 flex items-center">
                                <p className="text-sm text-gray-500">
                                  {ticket.username} · {getTimeAgo(ticket.createdAt)}
                                </p>
                              </div>
                            </div>
                            <div className="ml-4 flex-shrink-0 flex space-x-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(ticket.status)}`}>
                                {getStatusText(ticket.status)}
                              </span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(ticket.priority)}`}>
                                {getPriorityText(ticket.priority)}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                      <div className="flex-1 flex justify-between sm:hidden">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                          ก่อนหน้า
                        </button>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                          ถัดไป
                        </button>
                      </div>
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            แสดง <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> ถึง <span className="font-medium">{Math.min(currentPage * pageSize, filteredTickets.length)}</span> จาก <span className="font-medium">{filteredTickets.length}</span> รายการ
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                              disabled={currentPage === 1}
                              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                              <span className="sr-only">ก่อนหน้า</span>
                              {'<'}
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`relative inline-flex items-center px-4 py-2 border ${currentPage === i + 1 ? 'bg-blue-50 border-blue-500 text-blue-600 z-10' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'} text-sm font-medium`}
                              >
                                {i + 1}
                              </button>
                            ))}
                            <button
                              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                              disabled={currentPage === totalPages}
                              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                              <span className="sr-only">ถัดไป</span>
                              {'>'}
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          {/* Ticket Detail */}
          <div className="lg:w-3/5">
            {selectedTicket ? (
              <div className="bg-white shadow rounded-lg">
                {/* Ticket header */}
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {selectedTicket.subject}
                    </h3>
                    <div className="flex space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedTicket.status)}`}>
                        {getStatusText(selectedTicket.status)}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(selectedTicket.priority)}`}>
                        {getPriorityText(selectedTicket.priority)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-1 max-w-2xl text-sm text-gray-500">
                    <p>สร้างโดย {selectedTicket.username} · {formatDate(selectedTicket.createdAt)}</p>
                  </div>
                </div>
                
                {/* Ticket actions */}
                <div className="px-4 py-3 border-b border-gray-200 sm:px-6 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-500 mr-2">เปลี่ยนสถานะ:</span>
                      <select
                        value={selectedTicket.status}
                        onChange={(e) => handleStatusUpdate(e.target.value as SupportTicket['status'])}
                        className="mt-1 mr-2 block w-32 pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="open">เปิด</option>
                        <option value="in_progress">กำลังดำเนินการ</option>
                        <option value="waiting_for_customer">รอลูกค้า</option>
                        <option value="resolved">แก้ไขแล้ว</option>
                        <option value="closed">ปิด</option>
                      </select>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 mr-1">
                        มอบหมาย:
                      </span>
                      <span className="text-sm font-medium">
                        {selectedTicket.assignedTo || 'ยังไม่ได้มอบหมาย'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Ticket messages */}
                <div className="px-4 py-5 sm:p-6">
                  <div className="space-y-6">
                    {ticketMessages.map((message) => (
                      <div key={message.id} className={`flex ${message.isFromAdmin ? 'justify-end' : 'justify-start'}`}>
                        <div className={`inline-block max-w-lg rounded-lg px-4 py-3 ${message.isFromAdmin ? 'bg-blue-50' : 'bg-gray-100'}`}>
                          <div className="flex items-center mb-1">
                            <span className={`text-sm font-medium ${message.isFromAdmin ? 'text-blue-600' : 'text-gray-700'}`}>
                              {message.sender}
                            </span>
                            <span className="ml-2 text-xs text-gray-500">
                              {getTimeAgo(message.createdAt)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-700 whitespace-pre-wrap">
                            {message.message}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Reply form */}
                {['open', 'in_progress', 'waiting_for_customer'].includes(selectedTicket.status) && (
                  <div className="px-4 py-5 border-t border-gray-200 sm:px-6">
                    <form onSubmit={handleReplySubmit}>
                      <div>
                        <label htmlFor="reply" className="block text-sm font-medium text-gray-700">
                          ตอบกลับ
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="reply"
                            name="reply"
                            rows={4}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder="พิมพ์ข้อความตอบกลับ..."
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                          ></textarea>
                        </div>
                      </div>
                      <div className="mt-3">
                        <button
                          type="submit"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          disabled={!replyMessage.trim()}
                        >
                          ส่งข้อความ
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg">
                <div className="p-6 text-center text-gray-500">
                  เลือกตั๋วจากรายการเพื่อดูรายละเอียด
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
