/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    output: 'standalone', // Optimizes for Docker deployments
    poweredByHeader: false, // Security: Remove X-Powered-By header

    // Enable image optimization with domains if needed
    images: {
        domains: [
            'localhost',
            // Add your production domains here
        ],
    },

    // Add security headers
    async headers() {
        return [{
            source: '/(.*)',
            headers: [{
                    key: 'X-DNS-Prefetch-Control',
                    value: 'on'
                },
                {
                    key: 'X-XSS-Protection',
                    value: '1; mode=block'
                },
                {
                    key: 'X-Frame-Options',
                    value: 'SAMEORIGIN'
                },
                {
                    key: 'X-Content-Type-Options',
                    value: 'nosniff'
                },
                {
                    key: 'Referrer-Policy',
                    value: 'origin-when-cross-origin'
                }
            ]
        }]
    },

    // Add rewrites if needed for API proxying
    async rewrites() {
        return []
    }
}

module.exports = nextConfig