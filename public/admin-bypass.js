// n8nThai Admin Authentication Bypass
// This script sets up mock authentication data to bypass login for development purposes

function setupMockAdminAuth() {
    // Create mock admin user data
    const mockAdmin = {
        id: "admin-user-123",
        username: "admin",
        email: "admin@n8nthai.com",
        plan: "enterprise",
        isActive: true,
        role: "admin"
    };

    // Create mock JWT token (not a real JWT, just a placeholder)
    const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi11c2VyLTEyMyIsImVtYWlsIjoiYWRtaW5AbjhudGhhaS5jb20iLCJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjA5NDU5NzAwfQ.XBQVZFPVZUSDPozkR5LgwFPF80FSULl55TXNxUQlx8c";

    // Set values in localStorage
    localStorage.setItem('user', JSON.stringify(mockAdmin));
    localStorage.setItem('token', mockToken);

    console.log("✅ Admin bypass authentication successful!");
    console.log("👤 Logged in as admin:", mockAdmin.username);
    console.log("🔑 Role:", mockAdmin.role);

    // Setup mock statistics for admin dashboard
    const mockStats = {
        activeUsers: 25,
        totalUsers: 42,
        activeInstances: 18,
        totalInstances: 30,
        dailyRevenue: 5990,
        monthlyRevenue: 78500,
        pendingPayments: 3,
        openSupportTickets: 2,
        totalBackups: 56,
        failedBackups: 1,
        serverUtilization: 45,
        cpuUsage: 38,
        memoryUsage: 52,
        diskUsage: 45
    };

    // Setup mock users for admin dashboard
    const mockUsers = [{
            id: "user-1",
            username: "customer1",
            email: "customer1@example.com",
            plan: "pro",
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true,
            isSuspended: false,
            lastLoginAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            instanceCount: 2
        },
        {
            id: "user-2",
            username: "customer2",
            email: "customer2@example.com",
            plan: "basic",
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true,
            isSuspended: false,
            lastLoginAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            instanceCount: 1
        },
        {
            id: "user-3",
            username: "customer3",
            email: "customer3@example.com",
            plan: "enterprise",
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: false,
            isSuspended: true,
            lastLoginAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            instanceCount: 0
        }
    ];

    // Setup mock instances for admin dashboard
    const mockInstances = [{
            id: "inst-1",
            userId: "user-1",
            username: "customer1",
            subdomain: "customer1-app",
            customDomain: "workflows.customer1.com",
            status: "running",
            cpuAllocation: 2,
            ramAllocation: 2048,
            diskAllocation: 20,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            lastBackupAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            port: 5678,
            isBackedUp: true
        },
        {
            id: "inst-2",
            userId: "user-1",
            username: "customer1",
            subdomain: "customer1-test",
            customDomain: null,
            status: "stopped",
            cpuAllocation: 1,
            ramAllocation: 1024,
            diskAllocation: 10,
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            lastBackupAt: null,
            port: 5679,
            isBackedUp: false
        },
        {
            id: "inst-3",
            userId: "user-2",
            username: "customer2",
            subdomain: "customer2-main",
            customDomain: null,
            status: "running",
            cpuAllocation: 1,
            ramAllocation: 1024,
            diskAllocation: 10,
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            lastBackupAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            port: 5680,
            isBackedUp: true
        }
    ];

    // Setup mock payments for admin dashboard
    const mockPayments = [{
            id: "payment-1",
            userId: "user-1",
            username: "customer1",
            amount: 799,
            paymentProvider: "omise",
            status: "completed",
            paymentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            plan: "pro",
            invoiceId: "INV-001"
        },
        {
            id: "payment-2",
            userId: "user-2",
            username: "customer2",
            amount: 299,
            paymentProvider: "promptpay",
            status: "pending",
            paymentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            plan: "basic",
            invoiceId: "INV-002"
        },
        {
            id: "payment-3",
            userId: "user-3",
            username: "customer3",
            amount: 2499,
            paymentProvider: "bank_transfer",
            status: "failed",
            paymentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            plan: "enterprise",
            invoiceId: null
        }
    ];

    // Add API mocking for admin endpoints
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        // Mock the admin dashboard API
        if (url === '/api/admin/dashboard' && options && options.headers && options.headers.Authorization) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    ...mockStats,
                    recentUsers: mockUsers.slice(0, 5),
                    recentPayments: mockPayments.slice(0, 5)
                })
            });
        }

        // Mock the admin users API
        if (url.includes('/api/admin/users') && options && options.headers && options.headers.Authorization) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    users: mockUsers,
                    total: mockUsers.length
                })
            });
        }

        // Mock the admin instances API
        if (url.includes('/api/admin/instances') && options && options.headers && options.headers.Authorization) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    instances: mockInstances,
                    total: mockInstances.length
                })
            });
        }

        // Mock the admin payments API
        if (url.includes('/api/admin/payments') && options && options.headers && options.headers.Authorization) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    payments: mockPayments,
                    total: mockPayments.length
                })
            });
        }

        // For instance control
        if (url.includes('/api/admin/instances') && url.includes('/control') && options && options.method === 'POST') {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });
        }

        // Use real fetch for everything else
        return originalFetch(url, options);
    };

    // Redirect to admin dashboard
    window.location.href = '/admin/dashboard';
}

// Execute the mock admin auth setup
setupMockAdminAuth();