import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/jwt';
import { paymentService } from '@/lib/services/payment-service';

export async function GET(req: NextRequest) {
    try {
        // Get the authorization header
        const authHeader = req.headers.get('authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'ไม่ได้รับอนุญาต (token ไม่ถูกต้อง)' },
                { status: 401 }
            );
        }
        
        // Extract the token
        const token = authHeader.split(' ')[1];
        
        // Verify token
        const payload = verifyToken(token);
        
        // Get payments for the user
        const payments = await paymentService.getUserPayments(payload.userId);
        
        // Return the payments
        return NextResponse.json({ payments });
    } catch (error) {
        console.error('Error fetching payments:', error);
        
        // Check if token verification error
        if (error instanceof Error && error.message === 'Invalid token') {
            return NextResponse.json(
                { error: 'ไม่ได้รับอนุญาต (token ไม่ถูกต้อง)' },
                { status: 401 }
            );
        }
        
        // Generic error response
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลการชำระเงิน โปรดลองอีกครั้ง' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        // Get the authorization header
        const authHeader = req.headers.get('authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'ไม่ได้รับอนุญาต (token ไม่ถูกต้อง)' },
                { status: 401 }
            );
        }
        
        // Extract the token
        const token = authHeader.split(' ')[1];
        
        // Verify token
        const payload = verifyToken(token);
        
        // Parse the request body
        const data = await req.json();
        
        if (!data.plan || !data.token) {
            return NextResponse.json(
                { error: 'กรุณาระบุแพ็กเกจและข้อมูลบัตรเครดิต' },
                { status: 400 }
            );
        }
        
        // Create a charge
        const payment = await paymentService.createCharge({
            userId: payload.userId,
            plan: data.plan,
            token: data.token,
            email: payload.email,
            name: data.name || payload.username
        });
        
        // Return the payment
        return NextResponse.json(
            { 
                payment: {
                    id: payment.id,
                    amount: payment.amount,
                    currency: payment.currency,
                    status: payment.status,
                    createdAt: payment.createdAt
                }
            }, 
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating payment:', error);
        
        // Check if token verification error
        if (error instanceof Error && error.message === 'Invalid token') {
            return NextResponse.json(
                { error: 'ไม่ได้รับอนุญาต (token ไม่ถูกต้อง)' },
                { status: 401 }
            );
        }
        
        // Check for payment-specific errors
        if (error instanceof Error && (
            error.message.includes('แพ็กเกจ') || 
            error.message.includes('ราคา')
        )) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }
        
        // Generic error response
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการชำระเงิน โปรดลองอีกครั้ง' },
            { status: 500 }
        );
    }
}
