import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/utils/jwt';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Verify JWT token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'ไม่ได้รับอนุญาต (Unauthorized)' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const payload = await verifyToken(token);

    if (!payload || !payload.userId) {
      return NextResponse.json(
        { error: 'โทเค็นไม่ถูกต้อง (Invalid token)' },
        { status: 401 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'ไม่พบผู้ใช้ (User not found)' },
        { status: 404 }
      );
    }

    // For now, we'll assume only admin users will be accessing this route
    // In a real app, we would add a role field to the User model and check it

    // Get counts
    const [
      userCount,
      activeUserCount,
      instanceCount,
      activeInstanceCount,
      todayPaymentsSum,
      monthlyPaymentsSum,
      pendingPaymentsCount,
      backupCount
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Active users (not suspended)
      prisma.user.count({
        where: {
          isActive: true,
          isSuspended: false,
        },
      }),
      
      // Total instances
      prisma.instance.count(),
      
      // Active instances (running)
      prisma.instance.count({
        where: {
          status: 'running',
        },
      }),
      
      // Today's payments sum
      prisma.payment.aggregate({
        where: {
          status: 'success',
          paymentDate: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
        _sum: {
          amount: true,
        },
      }),
      
      // This month's payments sum
      prisma.payment.aggregate({
        where: {
          status: 'success',
          paymentDate: {
            gte: new Date(new Date().setDate(1)), // First day of current month
          },
        },
        _sum: {
          amount: true,
        },
      }),
      
      // Pending payments count
      prisma.payment.count({
        where: {
          status: 'pending',
        },
      }),
      
      // Total backups count
      prisma.backup.count(),
    ]);

    // Get recent users
    const recentUsers = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        plan: true,
      },
    });

    // Get recent payments
    const recentPayments = await prisma.payment.findMany({
      orderBy: {
        paymentDate: 'desc',
      },
      take: 5,
      select: {
        id: true,
        userId: true,
        amount: true,
        status: true,
        paymentDate: true,
        user: {
          select: {
            username: true,
            plan: true,
          },
        },
      },
    });

    // Format the recent payments to include username and plan
    const formattedPayments = recentPayments.map(payment => ({
      id: payment.id,
      userId: payment.userId,
      username: payment.user.username,
      amount: payment.amount,
      status: payment.status,
      paymentDate: payment.paymentDate.toISOString(),
      plan: payment.user.plan,
    }));

    // Mock system metrics (in a real system, these would be collected from server monitoring)
    const systemMetrics = {
      cpuUsage: Math.floor(Math.random() * 60) + 10, // Random value between 10-70%
      memoryUsage: Math.floor(Math.random() * 50) + 20, // Random value between 20-70%
      diskUsage: Math.floor(Math.random() * 40) + 30, // Random value between 30-70%
    };

    // Mock values for data we don't have in our schema yet
    const mockOpenSupportTickets = Math.floor(Math.random() * 5);
    const mockFailedBackups = Math.floor(Math.random() * 3);

    return NextResponse.json({
      activeUsers: activeUserCount,
      totalUsers: userCount,
      activeInstances: activeInstanceCount,
      totalInstances: instanceCount,
      dailyRevenue: todayPaymentsSum._sum.amount || 0,
      monthlyRevenue: monthlyPaymentsSum._sum.amount || 0,
      pendingPayments: pendingPaymentsCount,
      openSupportTickets: mockOpenSupportTickets, // Mock data
      totalBackups: backupCount,
      failedBackups: mockFailedBackups, // Mock data
      serverUtilization: Math.floor((systemMetrics.cpuUsage + systemMetrics.memoryUsage + systemMetrics.diskUsage) / 3),
      ...systemMetrics,
      recentUsers: recentUsers.map(user => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
      })),
      recentPayments: formattedPayments,
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการโหลดข้อมูลแดชบอร์ด' },
      { status: 500 }
    );
  }
}
