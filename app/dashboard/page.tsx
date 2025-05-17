'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BackupManagement from '@/app/components/backup-management';
import PackageManagement from '@/app/components/package-management';

interface Instance {
    id: string;
    subdomain: string;
    status: string;
    url: string;
    createdAt?: string;
    lastBackupAt?: string;
}

interface Stats {
    activeInstances: number;
    totalWorkflows: number;
    usedStorage: string;
    backupsAvailable: number;
    plan: string;
    daysLeft?: number;
}

export default function DashboardPage() {
    const { user, isAuthenticated, loading, token, logout } = useAuth();
    const router = useRouter();
    const [instances, setInstances] = useState<Instance[]>([]);
    const [stats, setStats] = useState<Stats>({
        activeInstances: 0,
        totalWorkflows: 0,
        usedStorage: '0 MB',
        backupsAvailable: 0,
        plan: 'Free',
        daysLeft: 7,
    });
    const [loadingInstances, setLoadingInstances] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('instances'); // instances, backups, settings, package
    const [isCreatingInstance, setIsCreatingInstance] = useState(false);
    const [newInstance, setNewInstance] = useState({
        subdomain: '',
    });

    // Redirect if not authenticated
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, loading, router]);
    
    // Fetch user instances
    useEffect(() => {
        const fetchInstances = async () => {
            if (!token) return;
            
            try {
                setLoadingInstances(true);
                const response = await fetch('/api/instances', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch instances');
                }
                
                const data = await response.json();
                setInstances(data.instances);

                // Calculate dashboard stats
                const active = data.instances.filter((inst: Instance) => inst.status === 'running').length;
                setStats({
                    ...stats,
                    activeInstances: active,
                    totalWorkflows: data.instances.length * 3, // Mocked data, 3 workflows per instance
                    backupsAvailable: data.instances.length * 2, // Mocked data
                    plan: user?.plan || 'Free',
                });
            } catch (error) {
                console.error('Error fetching instances:', error);
                setError('ไม่สามารถโหลดข้อมูล Instance ได้');
            } finally {
                setLoadingInstances(false);
            }
        };
        
        if (isAuthenticated) {
            fetchInstances();
        }
    }, [isAuthenticated, token, user]);
    
    const handleControlInstance = async (instanceId: string, action: string) => {
        try {
            const response = await fetch('/api/instances/control', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    instanceId,
                    action,
                }),
            });
            
            if (!response.ok) {
                throw new Error(`Failed to ${action} instance`);
            }
            
            // Update the local state to reflect the change
            setInstances(instances.map(instance => {
                if (instance.id === instanceId) {
                    let status;
                    switch (action) {
                        case 'start':
                            status = 'running';
                            break;
                        case 'stop':
                            status = 'stopped';
                            break;
                        case 'restart':
                            status = 'running';
                            break;
                        default:
                            status = instance.status;
                    }
                    return { ...instance, status };
                }
                return instance;
            }));

            // Update active instances count
            setStats({
                ...stats,
                activeInstances: action === 'stop' 
                    ? stats.activeInstances - 1 
                    : action === 'start' && instances.find(i => i.id === instanceId)?.status === 'stopped'
                    ? stats.activeInstances + 1 
                    : stats.activeInstances
            });
        } catch (error) {
            console.error(`Error ${action} instance:`, error);
            setError(`ไม่สามารถ ${action === 'start' ? 'เริ่ม' : action === 'stop' ? 'หยุด' : 'รีสตาร์ท'} Instance ได้`);
        }
    };

    const handleCreateInstance = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newInstance.subdomain) {
            setError('กรุณากรอก Subdomain');
            return;
        }

        try {
            const response = await fetch('/api/instances', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newInstance),
            });

            if (!response.ok) {
                throw new Error('Failed to create instance');
            }

            const data = await response.json();
            setInstances([...instances, data.instance]);
            setIsCreatingInstance(false);
            setNewInstance({ subdomain: '' });
            
            // Update stats
            setStats({
                ...stats,
                totalWorkflows: stats.totalWorkflows + 3, // Assuming 3 workflows for a new instance
                backupsAvailable: stats.backupsAvailable + 2,
            });
        } catch (error) {
            console.error('Error creating instance:', error);
            setError('ไม่สามารถสร้าง Instance ใหม่ได้');
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

    // Determine plan class for coloring
    const getPlanClass = (plan: string) => {
        switch(plan.toLowerCase()) {
            case 'pro':
                return 'text-blue-600';
            case 'enterprise':
                return 'text-purple-600';
            case 'starter':
                return 'text-green-600';
            default:
                return 'text-gray-600';
        }
    };

    // Return the main dashboard layout
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md hidden md:block">
                <div className="p-6">
                    <Link href="/" className="flex items-center">
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                            n8nThai
                        </span>
                    </Link>
                </div>
                <nav className="mt-6">
                    <div className="px-4 py-2">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            จัดการ
                        </p>
                        <ul className="mt-2 space-y-1">
                            <li>
                                <button 
                                    onClick={() => setActiveTab('instances')}
                                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                                        activeTab === 'instances' 
                                            ? 'bg-blue-50 text-blue-700' 
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <svg className={`mr-3 h-5 w-5 ${activeTab === 'instances' ? 'text-blue-500' : 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                                    </svg>
                                    Instances
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => setActiveTab('backups')}
                                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                                        activeTab === 'backups' 
                                            ? 'bg-blue-50 text-blue-700' 
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <svg className={`mr-3 h-5 w-5 ${activeTab === 'backups' ? 'text-blue-500' : 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                    </svg>
                                    การสำรองข้อมูล
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => setActiveTab('package')}
                                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                                        activeTab === 'package' 
                                            ? 'bg-blue-50 text-blue-700' 
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <svg className={`mr-3 h-5 w-5 ${activeTab === 'package' ? 'text-blue-500' : 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    แพ็กเกจของฉัน
                                </button>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-4">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="text-gray-500">Active Instances</h3>
                        <p className="text-2xl font-semibold">{stats.activeInstances}</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="text-gray-500">Workflows</h3>
                        <p className="text-2xl font-semibold">{stats.totalWorkflows}</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="text-gray-500">Backups</h3>
                        <p className="text-2xl font-semibold">{stats.backupsAvailable}</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="text-gray-500">Current Plan</h3>
                        <p className="text-2xl font-semibold">{stats.plan}</p>
                    </div>
                </div>
                
                {/* Tab Content */}
                {activeTab === 'instances' && (
                    <div className="bg-white rounded-lg p-6 shadow">
                        <h2 className="text-xl font-semibold mb-4">My Instances</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {instances.map((instance) => (
                                        <tr key={instance.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{instance.subdomain}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{instance.status}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{instance.createdAt}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button onClick={() => handleControlInstance(instance.id, 'start')} className="text-green-600 hover:text-green-900 mr-2">Start</button>
                                                <button onClick={() => handleControlInstance(instance.id, 'stop')} className="text-red-600 hover:text-red-900">Stop</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                
                {activeTab === 'backups' && <BackupManagement instances={instances} />}
                
                {activeTab === 'package' && <PackageManagement />}
            </div>
        </div>
    );
}
