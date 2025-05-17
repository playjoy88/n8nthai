// n8nThai Dashboard Authentication Bypass
// This script sets up mock authentication data to bypass login for development purposes

function setupMockAuth() {
    // Create mock user data
    const mockUser = {
        id: "dev-user-123",
        username: "dev_user",
        email: "dev@n8nthai.test",
        plan: "pro",
        isActive: true
    };

    // Create mock JWT token (not a real JWT, just a placeholder)
    const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkZXYtdXNlci0xMjMiLCJlbWFpbCI6ImRldkBuOG50aGFpLnRlc3QiLCJpYXQiOjE2MDk0NTk3MDB9.hbz8_NFM_ntnG5WhSZ9PD5QXFA9jhLvLaHGFnvCioP4";

    // Set values in localStorage
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('token', mockToken);

    console.log("✅ Bypass authentication successful!");
    console.log("👤 Logged in as:", mockUser.username);
    console.log("📋 Plan:", mockUser.plan);

    // Setup mock instance data
    const mockInstances = [{
            id: "inst-123",
            subdomain: "dev-instance",
            status: "running",
            url: "https://dev-instance.n8nthai.com"
        },
        {
            id: "inst-456",
            subdomain: "test-workflows",
            status: "stopped",
            url: "https://test-workflows.n8nthai.com"
        }
    ];

    // Add API mocking if needed
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        // Mock the instances API
        if (url === '/api/instances' && options && options.headers && options.headers.Authorization) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ instances: mockInstances })
            });
        }

        // For instance control
        if (url === '/api/instances/control' && options && options.method === 'POST') {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });
        }

        // Use real fetch for everything else
        return originalFetch(url, options);
    };

    // Redirect to dashboard
    window.location.href = '/dashboard';
}

// Execute the mock auth setup
setupMockAuth();