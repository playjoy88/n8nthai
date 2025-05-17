export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">n8nThai</h1>
          <div className="space-x-4">
            <a href="/login" className="text-gray-600 hover:text-gray-900">เข้าสู่ระบบ</a>
            <a href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">ทดลองใช้ฟรี</a>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-12 bg-gradient-to-b from-white to-gray-100">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">n8n Hosting Platform</h2>
            <p className="text-xl text-gray-600 mb-8">
              บริการโฮสติ้ง n8n แบบ Multi-Tenant สำหรับลูกค้าไทย
            </p>
            <div className="flex justify-center gap-4">
              <a 
                href="/signup" 
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
              >
                ทดลองใช้ฟรี 7 วัน
              </a>
              <a 
                href="#pricing" 
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-200"
              >
                ดูแพ็กเกจ
              </a>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-12 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">แพ็กเกจและราคา</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              
              <div className="border rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold">ทดลองใช้ฟรี</h3>
                <p className="text-3xl font-bold mt-2">ฟรี</p>
                <p className="text-gray-500">7 วัน</p>
                <ul className="mt-4 space-y-2">
                  <li>RAM: 512 MB</li>
                  <li>Workflow: สูงสุด 5</li>
                </ul>
                <a 
                  href="/signup" 
                  className="mt-6 block w-full text-center py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
                >
                  เริ่มต้นใช้งานฟรี
                </a>
              </div>

              <div className="border rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold">Starter</h3>
                <p className="text-3xl font-bold mt-2">฿299</p>
                <p className="text-gray-500">ต่อเดือน</p>
                <ul className="mt-4 space-y-2">
                  <li>RAM: 1 GB</li>
                  <li>Workflow: สูงสุด 10</li>
                  <li>สำรองข้อมูลรายสัปดาห์</li>
                </ul>
                <a 
                  href="/signup?plan=starter" 
                  className="mt-6 block w-full text-center py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
                >
                  เลือกแพ็กเกจนี้
                </a>
              </div>

              <div className="border-2 border-blue-600 rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold text-blue-600">Pro</h3>
                <p className="text-3xl font-bold mt-2">฿799</p>
                <p className="text-gray-500">ต่อเดือน</p>
                <ul className="mt-4 space-y-2">
                  <li>RAM: 2 GB</li>
                  <li>Workflow: ไม่จำกัด</li>
                  <li>สำรองข้อมูลรายวัน</li>
                </ul>
                <a 
                  href="/signup?plan=pro" 
                  className="mt-6 block w-full text-center py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  เลือกแพ็กเกจนี้
                </a>
              </div>

              <div className="border rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold">Enterprise</h3>
                <p className="text-3xl font-bold mt-2">฿2,499</p>
                <p className="text-gray-500">ต่อเดือน</p>
                <ul className="mt-4 space-y-2">
                  <li>RAM: 4 GB+</li>
                  <li>ทุกฟีเจอร์ + Premium Support</li>
                </ul>
                <a 
                  href="/contact" 
                  className="mt-6 block w-full text-center py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                >
                  ติดต่อฝ่ายขาย
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h3 className="text-xl font-bold">n8nThai</h3>
              <p className="mt-2 text-gray-400">บริการโฮสติ้ง n8n แบบ Multi-Tenant</p>
            </div>
            <div className="mt-4 md:mt-0">
              <h4 className="font-semibold">ติดต่อเรา</h4>
              <p className="text-gray-400">support@n8nthai.com</p>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-400">
            <p>© 2025 n8nThai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
