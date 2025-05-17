import { PrismaClient, Payment, PaymentStatus, PlanType } from '@prisma/client';
import { userService } from './user-service';
import { instanceService } from './instance-service';

const prisma = new PrismaClient();

// Get omise secret key from environment variables
const OMISE_SECRET_KEY = process.env.OMISE_SECRET_KEY;
const OMISE_PUBLIC_KEY = process.env.OMISE_PUBLIC_KEY;

// Import omise SDK conditionally to handle server/client side
let omise: any;
if (typeof window === 'undefined') {
    // Server-side only
    omise = require('omise')({
        publicKey: OMISE_PUBLIC_KEY,
        secretKey: OMISE_SECRET_KEY
    });
}

// Define plan pricing
const PLAN_PRICES = {
    basic: 299,
    pro: 799,
    enterprise: 2499
};

export interface CreateChargeParams {
    userId: string;
    plan: PlanType;
    token: string; // Omise card token
    email: string;
    name: string;
}

export const paymentService = {
    /**
     * Create a charge for subscription
     */
    async createCharge(params: CreateChargeParams): Promise<Payment> {
        const { userId, plan, token, email, name } = params;
        
        if (!['basic', 'pro', 'enterprise'].includes(plan)) {
            throw new Error('ไม่พบแพ็กเกจที่ระบุ');
        }
        
        const amount = PLAN_PRICES[plan as keyof typeof PLAN_PRICES];
        
        if (!amount) {
            throw new Error('ไม่พบราคาของแพ็กเกจที่ระบุ');
        }
        
        // Create a payment record in pending state
        const payment = await prisma.payment.create({
            data: {
                userId,
                amount,
                status: 'pending' as PaymentStatus,
                paymentProvider: 'credit_card',
                metadata: {
                    plan,
                    gateway: 'omise'
                }
            }
        });
        
        try {
            // Create a charge with Omise
            const charge = await omise.charges.create({
                amount: amount * 100, // Amount in smallest currency unit (satang)
                currency: 'thb',
                card: token,
                metadata: {
                    paymentId: payment.id,
                    userId,
                    plan
                },
                description: `n8nThai - ${plan} plan subscription`
            });
            
            // Update the payment record with Omise charge ID
            const updatedPayment = await prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status: charge.status === 'successful' ? 'success' as PaymentStatus : 'pending' as PaymentStatus,
                    metadata: {
                        plan,
                        gateway: 'omise',
                        chargeId: charge.id,
                        chargeResponse: charge
                    }
                }
            });
            
            // If payment is successful, update user's plan
            if (charge.status === 'successful') {
                await this.processSuccessfulPayment(userId, plan);
            }
            
            return updatedPayment;
        } catch (error) {
            // Update payment status to failed
            const updatedPayment = await prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status: 'failed' as PaymentStatus,
                    metadata: {
                        plan: (payment.metadata as any)?.plan || params.plan,
                        gateway: 'omise',
                        error: error instanceof Error ? error.message : 'Unknown error'
                    }
                }
            });
            
            throw error;
        }
    },
    
    /**
     * Process a successful payment
     */
    async processSuccessfulPayment(userId: string, plan: PlanType): Promise<void> {
        // Get the user
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        
        if (!user) {
            throw new Error('ไม่พบผู้ใช้');
        }
        
        // Calculate new expiration date (30 days from now)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        
        // Update user's plan
        await prisma.user.update({
            where: { id: userId },
            data: {
                plan,
                isActive: true,
                expiresAt
            }
        });
        
        // Get user's instance
        const instances = await instanceService.getUserInstances(userId);
        
        if (instances.length > 0) {
            // Update instance resource limits based on new plan
            await this.updateInstanceResources(instances[0].id, plan);
        }
    },
    
    /**
     * Update instance resources based on plan
     */
    async updateInstanceResources(instanceId: string, plan: PlanType): Promise<void> {
        const resources = {
            free: {
                ram: 512,
                cpu: 0.2,
                maxWorkflows: 5,
                maxExecutions: 2
            },
            basic: {
                ram: 1024,
                cpu: 0.5,
                maxWorkflows: 1000,
                maxExecutions: 5
            },
            pro: {
                ram: 2048,
                cpu: 1.0,
                maxWorkflows: 5000,
                maxExecutions: 10
            },
            enterprise: {
                ram: 4096,
                cpu: 2.0,
                maxWorkflows: 10000,
                maxExecutions: 25
            }
        };
        
        const resource = resources[plan];
        
        await prisma.instance.update({
            where: { id: instanceId },
            data: {
                ram: resource.ram,
                cpu: resource.cpu,
                maxWorkflows: resource.maxWorkflows,
                maxExecutions: resource.maxExecutions
            }
        });
    },
    
    /**
     * Get a payment by ID
     */
    async getPayment(paymentId: string): Promise<Payment | null> {
        return prisma.payment.findUnique({
            where: { id: paymentId }
        });
    },
    
    /**
     * Get all payments for a user
     */
    async getUserPayments(userId: string): Promise<Payment[]> {
        return prisma.payment.findMany({
            where: { userId },
            orderBy: { paymentDate: 'desc' }
        });
    },
    
    /**
     * Create a webhook handler for Omise
     */
    async handleWebhook(payload: any): Promise<void> {
        // Verify the webhook signature
        
        // Process based on event type
        const eventType = payload.key;
        const data = payload.data;
        
        if (eventType === 'charge.complete') {
            // Find the payment by chargeId using metadata
            const payments = await prisma.payment.findMany({
                where: { metadata: { path: ['chargeId'], equals: data.id } }
            });
            
            if (!payments || payments.length === 0) {
                console.error(`Payment not found for charge ${data.id}`);
                return;
            }
            
            const payment = payments[0];
            
            // Update payment status
            await prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status: data.status === 'successful' ? 'success' as PaymentStatus : 'pending' as PaymentStatus,
                    metadata: {
                        plan: (payment.metadata as any)?.plan,
                        gateway: (payment.metadata as any)?.gateway || 'omise',
                        chargeId: (payment.metadata as any)?.chargeId,
                        chargeResponse: data
                    }
                }
            });
            
            // If payment successful, update user's plan
            if (data.status === 'successful') {
                const metadata = data.metadata || {};
                const metadataFromDb = payment.metadata as any || {};
                await this.processSuccessfulPayment(
                    metadata.userId || payment.userId,
                    metadata.plan || metadataFromDb.plan || 'basic' as PlanType
                );
            }
        }
    }
};
