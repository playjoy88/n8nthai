import { PrismaClient, Instance, User } from '@prisma/client';
import crypto from 'crypto';
import axios from 'axios';

const prisma = new PrismaClient();

// Get environment variables
const INSTANCE_BASE_DOMAIN = process.env.INSTANCE_BASE_DOMAIN || 'n8n.yourdomain.com';
const INSTANCE_BASE_PORT = parseInt(process.env.INSTANCE_BASE_PORT || '5000');

interface ResourceLimits {
    ram: number; // in MB
    cpu: number; // in vCPU
    maxWorkflows: number;
    maxExecutions: number;
}

// Define resource limits for each plan
const PLAN_RESOURCES: Record<string, ResourceLimits> = {
    free: {
        ram: 512,
        cpu: 0.2,
        maxWorkflows: 5,
        maxExecutions: 2
    },
    basic: {
        ram: 1024,
        cpu: 0.5,
        maxWorkflows: 1000, // Unlimited in practice
        maxExecutions: 5
    },
    pro: {
        ram: 2048,
        cpu: 1.0,
        maxWorkflows: 5000, // Unlimited in practice
        maxExecutions: 10
    },
    enterprise: {
        ram: 4096,
        cpu: 2.0,
        maxWorkflows: 10000, // Unlimited in practice
        maxExecutions: 25
    }
};

export const instanceService = {
    /**
     * Create a new n8n instance for a user
     */
    async createInstance(userId: string): Promise<Instance> {
        // Get user to determine plan and resource limits
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        
        if (!user) {
            throw new Error('User not found');
        }
        
        // Generate a unique subdomain
        const subdomain = await this.generateUniqueSubdomain(user.username);
        
        // Assign a port for the instance
        const port = await this.findAvailablePort();
        
        // Define the docker path where the instance will be stored
        const dockerPath = `/srv/${user.id}`;
        
        // Get resource limits based on user's plan
        const resources = PLAN_RESOURCES[user.plan];
        
        // Create the instance record in the database
        const instance = await prisma.instance.create({
            data: {
                userId: user.id,
                subdomain,
                port,
                dockerPath,
                status: 'running',
                isBackedUp: false,
                ram: resources.ram,
                cpu: resources.cpu,
                maxWorkflows: resources.maxWorkflows,
                maxExecutions: resources.maxExecutions
            }
        });
        
        // Deploy the actual n8n instance on the server
        await this.deployInstance(instance, user);
        
        return instance;
    },
    
    /**
     * Generate a unique subdomain based on the username
     */
    async generateUniqueSubdomain(username: string): Promise<string> {
        // Basic sanitization - replace non-alphanumeric with hyphens
        let baseSubdomain = username.toLowerCase().replace(/[^a-z0-9]/g, '-');
        
        // Ensure subdomain is at least 3 characters
        if (baseSubdomain.length < 3) {
            baseSubdomain += crypto.randomBytes(2).toString('hex');
        }
        
        let subdomain = baseSubdomain;
        let counter = 1;
        
        // Check if subdomain is unique, if not, add a number suffix
        while (true) {
            const existing = await prisma.instance.findUnique({
                where: { subdomain }
            });
            
            if (!existing) {
                break;
            }
            
            subdomain = `${baseSubdomain}-${counter}`;
            counter++;
        }
        
        return subdomain;
    },
    
    /**
     * Find an available port for a new instance
     */
    async findAvailablePort(): Promise<number> {
        // Get the highest port currently in use
        const highestInstance = await prisma.instance.findFirst({
            orderBy: { port: 'desc' }
        });
        
        const startPort = INSTANCE_BASE_PORT;
        
        if (!highestInstance) {
            return startPort;
        }
        
        // Return the next port after the highest one
        return highestInstance.port + 1;
    },
    
    /**
     * Deploy the n8n instance on the server
     */
    async deployInstance(instance: Instance, user: User): Promise<void> {
        try {
            // Generate a secure password for the n8n instance
            const password = crypto.randomBytes(8).toString('hex');
            
            // Call the deployment API on our server
            await axios.post(`${process.env.DEPLOYMENT_API_URL}/api/deploy`, {
                id: instance.id,
                port: instance.port,
                domain: `${instance.subdomain}.${INSTANCE_BASE_DOMAIN}`,
                username: user.username,
                password
            });
            
            // Log the successful deployment
            await prisma.log.create({
                data: {
                    instanceId: instance.id,
                    type: 'info',
                    message: `Instance deployed successfully with subdomain ${instance.subdomain}.${INSTANCE_BASE_DOMAIN}`
                }
            });
        } catch (error) {
            // Log the error
            await prisma.log.create({
                data: {
                    instanceId: instance.id,
                    type: 'error',
                    message: `Failed to deploy instance: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    metadata: error instanceof Error ? { stack: error.stack } : {}
                }
            });
            
            // Update instance status to indicate failure
            await prisma.instance.update({
                where: { id: instance.id },
                data: { status: 'stopped' }
            });
            
            throw error;
        }
    },
    
    /**
     * Get instance by ID
     */
    async getInstance(instanceId: string): Promise<Instance | null> {
        return prisma.instance.findUnique({
            where: { id: instanceId }
        });
    },
    
    /**
     * Get all instances for a user
     */
    async getUserInstances(userId: string): Promise<Instance[]> {
        return prisma.instance.findMany({
            where: {
                userId,
                status: {
                    not: 'deleted'
                }
            }
        });
    },
    
    /**
     * Control an instance (start, stop, restart, delete)
     */
    async controlInstance(instanceId: string, action: 'start' | 'stop' | 'restart' | 'delete'): Promise<Instance> {
        const instance = await prisma.instance.findUnique({
            where: { id: instanceId }
        });
        
        if (!instance) {
            throw new Error('Instance not found');
        }
        
        // Call the appropriate API endpoint on our server
        try {
            await axios.post(`${process.env.DEPLOYMENT_API_URL}/api/control`, {
                instanceId,
                action,
                dockerPath: instance.dockerPath
            });
            
            // Update instance status in database
            let newStatus: 'running' | 'stopped' | 'deleted';
            
            switch (action) {
                case 'start':
                    newStatus = 'running';
                    break;
                case 'stop':
                    newStatus = 'stopped';
                    break;
                case 'restart':
                    newStatus = 'running';
                    break;
                case 'delete':
                    newStatus = 'deleted';
                    break;
            }
            
            return prisma.instance.update({
                where: { id: instanceId },
                data: { status: newStatus }
            });
        } catch (error) {
            // Log the error
            await prisma.log.create({
                data: {
                    instanceId: instance.id,
                    type: 'error',
                    message: `Failed to ${action} instance: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    metadata: error instanceof Error ? { stack: error.stack } : {}
                }
            });
            
            throw error;
        }
    }
};
