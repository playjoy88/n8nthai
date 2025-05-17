'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface PlanFeature {
    name: string;
    nameEn: string;
    basic: string | number | boolean;
    pro: string | number | boolean;
    enterprise: string | number | boolean;
}

interface PlanPricing {
    basic: number;
    pro: number;
    enterprise: number;
}

export default function PackageManagement() {
    const { user, token } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showCardForm, setShowCardForm] = useState(false);
    const [cardToken, setCardToken] = useState<string | null>(null);
    
    // Plan pricing
    const planPricing: PlanPricing = {
        basic: 299,
        pro: 799,
        enterprise: 2499
    };
    
    // Plan features
    const planFeatures: PlanFeature[] = [
        {
            name: 'จำนวน Instances',
            nameEn: 'Number of Instances',
            basic: '1',
            pro: '3',
            enterprise: 'ไม่จำกัด (Unlimited)'
        },
        {
            name: 'RAM',
            nameEn: 'RAM',
            basic: '1 GB',
            pro: '2 GB',
            enterprise: '4 GB'
        },
        {
            name: 'CPU',
            nameEn: 'CPU',
            basic: '0.5 vCPU',
            pro: '1 vCPU',
            enterprise: '2 vCPU'
        },
        {
            name: 'จำนวน Workflows สูงสุด',
            nameEn: 'Max Workflows',
            basic: '1,000',
            pro: '5,000',
            enterprise: '10,000'
        },
        {
            name: 'จำนวนการทำงานพร้อมกัน',
            nameEn: 'Concurrent Executions',
            basic: '5',
            pro: '10',
            enterprise: '25'
        },
        {
            name: 'สำรองข้อมูลอัตโนมัติ',
            nameEn: 'Automatic Backups',
            basic: 'ทุก 3 วัน (Every 3 days)',
            pro: 'รายวัน (Daily)',
            enterprise: 'รายวัน (Daily)'
        },
        {
            name: 'การช่วยเหลือ',
            nameEn: 'Support',
            basic: 'อีเมล (Email)',
            pro: 'อีเมล + แชท (Email + Chat)',
            enterprise: 'ตลอด 24 ชั่วโมง (24/7)'
        }
    ];
    
    // Get the current user plan
    const currentPlan = user?.plan || 'free';
    
    // Check if the plan is a downgrade from current plan
    const isPlanDowngrade = (plan: string): boolean => {
        const planHierarchy = { free: 0, basic: 1, pro: 2, enterprise: 3 };
        return planHierarchy[plan as keyof typeof planHierarchy] < planHierarchy[currentPlan as keyof typeof planHierarchy];
    };
    
    // Check if the plan is the current plan
    const isCurrentPlan = (plan: string): boolean => {
        return plan === currentPlan;
    };
    
    // Handle plan selection
    const handleSelectPlan = (plan: string) => {
        if (isCurrentPlan(plan)) {
            return;
        }
        
        setSelectedPlan(plan);
        setShowCardForm(true);
        setError(null);
        setSuccess(null);
    };
    
    // Handle card form submission
    const handleCardFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedPlan || !cardToken) {
            setError('กรุณาเลือกแพ็กเกจและกรอกข้อมูลบัตรเครดิตให้ครบถ้วน');
            return;
        }
        
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await fetch('/api/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    plan: selectedPlan,
                    token: cardToken,
                    name: user?.username || 'User',
                    email: user?.email || 'user@example.com'
                })
            });
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'ไม่สามารถดำเนินการชำระเงินได้');
            }
            
            setSuccess(`อัปเกรดแพ็กเกจเป็น ${selectedPlan.toUpperCase()} สำเร็จแล้ว!`);
            setShowCardForm(false);
            setSelectedPlan(null);
            
            // TODO: Refresh user data to show updated plan
        } catch (error) {
            console.error('Payment error:', error);
            setError(error instanceof Error ? error.message : 'ไม่สามารถดำเนินการชำระเงินได้');
        } finally {
            setIsLoading(false);
        }
    };
    
    // Handle credit card token creation (this would use Omise.js in a real implementation)
    const handleCreateToken = (cardDetails: any) => {
        // This is a mock implementation. In a real app, this would use Omise.js
        // to create a token and then set it with setCardToken
        console.log('Card details:', cardDetails);
        
        // In a real implementation, this would be the result of Omise token creation
        setCardToken('tokn_test_12345');
    };
    
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                    จัดการแพ็กเกจ
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    อัปเกรดแพ็กเกจของคุณเพื่อขยายขีดความสามารถและรับคุณสมบัติเพิ่มเติม
                </p>
            </div>
            
            {/* Current Plan */}
            <div className="p-6 border-b border-gray-200 bg-blue-50">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-900">แพ็กเกจปัจจุบันของคุณ</h3>
                        <p className="mt-1 text-2xl font-semibold text-blue-600">{currentPlan.toUpperCase()}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                        {currentPlan === 'free' ? (
                            <p>อัปเกรดเพื่อใช้งานคุณสมบัติเต็มรูปแบบ</p>
                        ) : (
                            <p>ต่ออายุวันที่: {user?.expiresAt ? new Date(user.expiresAt).toLocaleDateString('th-TH') : 'ไม่พบข้อมูล'}</p>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Success or error messages */}
            {success && (
                <div className="m-6 p-4 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-green-700">{success}</p>
                        </div>
                    </div>
                </div>
            )}
            
            {error && (
                <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Pricing Plans */}
            <div className="p-6">
                <h3 className="text-base font-medium text-gray-900 mb-4">เลือกแพ็กเกจ</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Basic Plan */}
                    <div className={`border rounded-lg ${isCurrentPlan('basic') ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}>
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900">Basic</h3>
                            <p className="mt-4 text-3xl font-extrabold text-gray-900">{planPricing.basic} ฿<span className="text-base font-medium text-gray-500">/เดือน</span></p>
                            <p className="mt-4 text-sm text-gray-500">เหมาะสำหรับการเริ่มต้นและโปรเจกต์ขนาดเล็ก</p>
                            
                            <button
                                onClick={() => handleSelectPlan('basic')}
                                disabled={isCurrentPlan('basic') || isLoading}
                                className={`mt-6 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                    isCurrentPlan('basic')
                                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                        : isPlanDowngrade('basic')
                                        ? 'bg-gray-600 hover:bg-gray-700 text-white'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                            >
                                {isCurrentPlan('basic') ? 'แพ็กเกจปัจจุบัน' : isPlanDowngrade('basic') ? 'ดาวน์เกรด' : 'อัปเกรด'}
                            </button>
                        </div>
                        <div className="px-6 pb-6">
                            <ul className="mt-6 space-y-4">
                                {planFeatures.map((feature, index) => (
                                    <li key={index} className="flex">
                                        <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="ml-2 text-sm text-gray-500">
                                            {feature.name}: <span className="font-medium text-gray-900">{feature.basic}</span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    
                    {/* Pro Plan */}
                    <div className={`border rounded-lg ${isCurrentPlan('pro') ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}>
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900">Pro</h3>
                            <div className="bg-blue-100 text-blue-800 inline-block px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mt-1">แนะนำ</div>
                            <p className="mt-4 text-3xl font-extrabold text-gray-900">{planPricing.pro} ฿<span className="text-base font-medium text-gray-500">/เดือน</span></p>
                            <p className="mt-4 text-sm text-gray-500">เหมาะสำหรับธุรกิจขนาดกลางและโปรเจกต์ที่มีความซับซ้อน</p>
                            
                            <button
                                onClick={() => handleSelectPlan('pro')}
                                disabled={isCurrentPlan('pro') || isLoading}
                                className={`mt-6 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                    isCurrentPlan('pro')
                                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                        : isPlanDowngrade('pro')
                                        ? 'bg-gray-600 hover:bg-gray-700 text-white'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                            >
                                {isCurrentPlan('pro') ? 'แพ็กเกจปัจจุบัน' : isPlanDowngrade('pro') ? 'ดาวน์เกรด' : 'อัปเกรด'}
                            </button>
                        </div>
                        <div className="px-6 pb-6">
                            <ul className="mt-6 space-y-4">
                                {planFeatures.map((feature, index) => (
                                    <li key={index} className="flex">
                                        <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="ml-2 text-sm text-gray-500">
                                            {feature.name}: <span className="font-medium text-gray-900">{feature.pro}</span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    
                    {/* Enterprise Plan */}
                    <div className={`border rounded-lg ${isCurrentPlan('enterprise') ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}>
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900">Enterprise</h3>
                            <p className="mt-4 text-3xl font-extrabold text-gray-900">{planPricing.enterprise} ฿<span className="text-base font-medium text-gray-500">/เดือน</span></p>
                            <p className="mt-4 text-sm text-gray-500">เหมาะสำหรับองค์กรขนาดใหญ่และโปรเจกต์ที่ต้องการทรัพยากรสูง</p>
                            
                            <button
                                onClick={() => handleSelectPlan('enterprise')}
                                disabled={isCurrentPlan('enterprise') || isLoading}
                                className={`mt-6 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                    isCurrentPlan('enterprise')
                                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                            >
                                {isCurrentPlan('enterprise') ? 'แพ็กเกจปัจจุบัน' : 'อัปเกรด'}
                            </button>
                        </div>
                        <div className="px-6 pb-6">
                            <ul className="mt-6 space-y-4">
                                {planFeatures.map((feature, index) => (
                                    <li key={index} className="flex">
                                        <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="ml-2 text-sm text-gray-500">
                                            {feature.name}: <span className="font-medium text-gray-900">{feature.enterprise}</span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Payment Form */}
            {showCardForm && (
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <h3 className="text-base font-medium text-gray-900 mb-4">ชำระเงิน</h3>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-500 mb-4">คุณกำลังอัปเกรดเป็นแพ็กเกจ <span className="font-semibold text-gray-900">{selectedPlan?.toUpperCase()}</span></p>
                        
                        <form onSubmit={handleCardFormSubmit} className="space-y-4">
                            {/* Card holder name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">ชื่อบนบัตร</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="JOHN DOE"
                                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    required
                                />
                            </div>

                            {/* Card number */}
                            <div>
                                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">หมายเลขบัตร</label>
                                <input
                                    type="text"
                                    id="cardNumber"
                                    name="cardNumber"
                                    placeholder="1234 5678 9012 3456"
                                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Expiry date */}
                                <div>
                                    <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">วันหมดอายุ</label>
                                    <input
                                        type="text"
                                        id="expiry"
                                        name="expiry"
                                        placeholder="MM/YY"
                                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        required
                                    />
                                </div>

                                {/* Security code */}
                                <div>
                                    <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">รหัสความปลอดภัย (CVC)</label>
                                    <input
                                        type="text"
                                        id="cvc"
                                        name="cvc"
                                        placeholder="123"
                                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCardForm(false);
                                        setSelectedPlan(null);
                                    }}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            กำลังประมวลผล...
                                        </>
                                    ) : (
                                        <>ชำระเงิน {planPricing[selectedPlan as keyof typeof planPricing]} ฿</>
                                    )}
                                </button>
                            </div>
                            
                            <div className="mt-4 text-xs text-gray-500 text-center">
                                <p>การชำระเงินได้รับการประมวลผลอย่างปลอดภัยโดย Omise Payment Gateway</p>
                                <p className="mt-1">คุณจะถูกเรียกเก็บเงินทันทีและสามารถใช้แพ็กเกจใหม่ได้ทันที</p>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
