'use client';

import Link from 'next/link';
import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SignupPage() {
    const { register, loading, error } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    
    // Get plan from URL query parameter
    const defaultPlan = searchParams.get('plan') || 'free';
    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        plan: defaultPlan,
        terms: false
    });
    
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [step, setStep] = useState(1); // 1: Plan Selection, 2: User Info
    
    const plans = [
        {
            id: 'free',
            name: 'ทดลองใช้ฟรี',
            nameEn: 'Free Trial',
            price: 'ฟรี',
            duration: '7 วัน',
            features: [
                'RAM: 512 MB',
                'CPU: 1 Core',
                'Workflow: สูงสุด 5',
                'ไม่มีการสำรองข้อมูล'
            ],
            recommended: false,
            color: 'bg-gray-100'
        },
        {
            id: 'starter',
            name: 'Starter',
            nameEn: 'Starter',
            price: '฿299',
            duration: 'ต่อเดือน',
            features: [
                'RAM: 1 GB',
                'CPU: 1 Core',
                'Workflow: สูงสุด 10',
                'สำรองข้อมูลรายสัปดาห์'
            ],
            recommended: false,
            color: 'bg-white'
        },
        {
            id: 'pro',
            name: 'Pro',
            nameEn: 'Pro',
            price: '฿799',
            duration: 'ต่อเดือน',
            features: [
                'RAM: 2 GB',
                'CPU: 2 Core',
                'Workflow: ไม่จำกัด',
                'สำรองข้อมูลรายวัน',
                'Custom Domain'
            ],
            recommended: true,
            color: 'bg-blue-50'
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            nameEn: 'Enterprise',
            price: '฿2,499',
            duration: 'ต่อเดือน',
            features: [
                'RAM: 4 GB+',
                'CPU: 4 Core+',
                'Workflow: ไม่จำกัด',
                'สำรองข้อมูลรายวัน',
                'Custom Domain',
                'Premium Support'
            ],
            recommended: false,
            color: 'bg-gray-50'
        }
    ];
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
        
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
        
        // Clear error when field is changed
        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: ''
            });
        }
    };
    
    const handlePlanSelect = (planId: string) => {
        setFormData({
            ...formData,
            plan: planId
        });
    };
    
    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};
        
        if (!formData.username.trim()) {
            errors.username = 'กรุณากรอกชื่อผู้ใช้';
        }
        
        if (!formData.email.trim()) {
            errors.email = 'กรุณากรอกอีเมล';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
        }
        
        if (!formData.password) {
            errors.password = 'กรุณากรอกรหัสผ่าน';
        } else if (formData.password.length < 8) {
            errors.password = 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร';
        }
        
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'รหัสผ่านไม่ตรงกัน';
        }
        
        if (!formData.terms) {
            errors.terms = 'กรุณายอมรับข้อกำหนดในการใช้งาน';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
    
    const moveToAccountDetails = () => {
        setStep(2);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        await register(formData);
    };
    
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center">
                        <span className="text-2xl font-bold text-blue-600">n8nThai</span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Link href="/login" className="text-gray-600 hover:text-gray-900">
                            เข้าสู่ระบบ
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Step Indicator */}
                <div className="max-w-3xl mx-auto mb-8">
                    <div className="flex items-center justify-center">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 1 ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
                            1
                        </div>
                        <div className={`h-1 w-12 sm:w-24 ${step === 1 ? 'bg-gray-300' : 'bg-blue-600'}`}></div>
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 2 ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
                            2
                        </div>
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                        <div className={`text-center w-20 ${step === 1 ? 'font-medium text-blue-600' : ''}`}>เลือกแพ็กเกจ</div>
                        <div className={`text-center w-20 ${step === 2 ? 'font-medium text-blue-600' : ''}`}>ข้อมูลบัญชี</div>
                    </div>
                </div>

                {error && (
                    <div className="max-w-3xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
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

                {step === 1 ? (
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-gray-900">เลือกแพ็กเกจที่เหมาะกับคุณ</h2>
                            <p className="mt-2 text-lg text-gray-600">
                                ทุกแพ็กเกจรองรับการใช้งาน n8n อย่างเต็มรูปแบบ และเริ่มต้นด้วยการทดลองใช้ฟรี 7 วัน
                            </p>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-4 md:grid-cols-2">
                            {plans.map((plan) => (
                                <div 
                                    key={plan.id}
                                    className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                        formData.plan === plan.id 
                                            ? 'border-blue-600 shadow-lg transform -translate-y-1' 
                                            : 'border-gray-200 hover:border-gray-300 hover:shadow'
                                    } ${plan.color}`}
                                >
                                    {plan.recommended && (
                                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                            แนะนำ
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                                        <p className="text-gray-500 text-sm">{plan.nameEn}</p>
                                        <div className="mt-4 flex items-baseline">
                                            <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                                            <span className="ml-2 text-gray-500">{plan.duration}</span>
                                        </div>

                                        <ul className="mt-6 space-y-3">
                                            {plan.features.map((feature, index) => (
                                                <li key={index} className="flex items-start">
                                                    <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-gray-600 text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                handlePlanSelect(plan.id);
                                                moveToAccountDetails();
                                            }}
                                            className={`mt-8 w-full px-4 py-2 rounded-md font-medium transition-colors ${
                                                formData.plan === plan.id
                                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                    : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
                                            }`}
                                        >
                                            {plan.id === 'free' ? 'เริ่มต้นใช้งานฟรี' : 'เลือกแพ็กเกจนี้'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 text-center">
                            <button
                                type="button"
                                onClick={moveToAccountDetails}
                                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                ดำเนินการต่อ
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="px-6 py-8 border-b border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900">สร้างบัญชีผู้ใช้</h2>
                                <p className="mt-2 text-gray-600">
                                    แพ็กเกจที่เลือก: <span className="font-medium text-blue-600">
                                        {plans.find(p => p.id === formData.plan)?.name || 'ทดลองใช้ฟรี'}
                                    </span>
                                    <button 
                                        type="button" 
                                        onClick={() => setStep(1)}
                                        className="ml-2 text-sm text-blue-600 hover:text-blue-800 underline"
                                    >
                                        เปลี่ยน
                                    </button>
                                </p>
                            </div>

                            <div className="px-6 py-8">
                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                            ชื่อผู้ใช้
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="username"
                                                name="username"
                                                type="text"
                                                autoComplete="username"
                                                required
                                                value={formData.username}
                                                onChange={handleChange}
                                                className={`block w-full rounded-md px-3 py-2 border ${
                                                    formErrors.username 
                                                        ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' 
                                                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                } shadow-sm`}
                                                placeholder="username"
                                            />
                                            {formErrors.username && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            อีเมล
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`block w-full rounded-md px-3 py-2 border ${
                                                    formErrors.email 
                                                        ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' 
                                                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                } shadow-sm`}
                                                placeholder="you@example.com"
                                            />
                                            {formErrors.email && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                            รหัสผ่าน
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                autoComplete="new-password"
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
                                                className={`block w-full rounded-md px-3 py-2 border ${
                                                    formErrors.password 
                                                        ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' 
                                                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                } shadow-sm`}
                                                placeholder="••••••••"
                                                minLength={8}
                                            />
                                            {formErrors.password && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                            ยืนยันรหัสผ่าน
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                                autoComplete="new-password"
                                                required
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                className={`block w-full rounded-md px-3 py-2 border ${
                                                    formErrors.confirmPassword 
                                                        ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' 
                                                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                } shadow-sm`}
                                                placeholder="••••••••"
                                            />
                                            {formErrors.confirmPassword && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="terms"
                                                name="terms"
                                                type="checkbox"
                                                required
                                                checked={formData.terms}
                                                onChange={handleChange}
                                                className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                                                    formErrors.terms ? 'border-red-300' : ''
                                                }`}
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="terms" className="text-gray-700">
                                                ฉันยอมรับ{' '}
                                                <Link href="/terms" className="text-blue-600 hover:text-blue-800">
                                                    ข้อกำหนดในการใช้งาน
                                                </Link>{' '}
                                                และ{' '}
                                                <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                                                    นโยบายความเป็นส่วนตัว
                                                </Link>
                                            </label>
                                            {formErrors.terms && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.terms}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                        >
                                            กลับ
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <p className="mt-6 text-center text-gray-600 text-sm">
                            มีบัญชีอยู่แล้ว?{' '}
                            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                                เข้าสู่ระบบ
                            </Link>
                        </p>
                    </div>
                )}
            </main>

            <footer className="bg-white border-t border-gray-200 mt-12">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-500 text-sm">
                        &copy; 2025 n8nThai. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
