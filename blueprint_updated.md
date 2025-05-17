# n8nThai - n8n Hosting Platform Blueprint
# n8nThai - พิมพ์เขียวแพลตฟอร์มโฮสติ้ง n8n

## Overview / ภาพรวม
n8nThai is a multi-tenant n8n hosting platform designed specifically for Thai customers, offering a seamless experience with Thai language support, local payment options, and automated workflow management.

n8nThai คือแพลตฟอร์มโฮสติ้ง n8n แบบ Multi-Tenant ที่ออกแบบมาโดยเฉพาะสำหรับลูกค้าชาวไทย มีการรองรับภาษาไทย ตัวเลือกการชำระเงินในประเทศ และการจัดการเวิร์กโฟลว์อัตโนมัติอย่างไร้รอยต่อ

## Core Features / ฟีเจอร์หลัก

### 1. User Management System / ระบบจัดการผู้ใช้
- User registration with email verification
- Login with JWT authentication
- User roles (Admin, User)
- Password reset functionality
- User profile management
- Thai language support throughout

---

- การลงทะเบียนผู้ใช้พร้อมการยืนยันอีเมล
- เข้าสู่ระบบด้วยการยืนยันตัวตนแบบ JWT
- บทบาทผู้ใช้ (ผู้ดูแลระบบ, ผู้ใช้)
- ฟังก์ชันรีเซ็ตรหัสผ่าน
- การจัดการโปรไฟล์ผู้ใช้
- รองรับภาษาไทยตลอดทั้งระบบ

### 2. Instance Management / การจัดการอินสแตนซ์
- Create, start, stop, and restart n8n instances
- Resource allocation based on subscription plan
- Domain/subdomain management
- Status monitoring and health checks
- Instance logs and metrics
- Automated backups and restoration

---

- สร้าง เริ่ม หยุด และรีสตาร์ทอินสแตนซ์ n8n
- การจัดสรรทรัพยากรตามแผนการสมัครสมาชิก
- การจัดการโดเมน/ซับโดเมน
- การตรวจสอบสถานะและการตรวจสอบความสมบูรณ์
- บันทึกและเมตริกอินสแตนซ์
- การสำรองข้อมูลและการกู้คืนอัตโนมัติ

### 3. Subscription Plans / แผนการสมัครสมาชิก
- Free trial (7 days)
- Starter plan (limited resources)
- Pro plan (standard resources)
- Enterprise plan (custom resources)
- Plan upgrade/downgrade
- Automatic renewal and billing

---

- ทดลองใช้ฟรี (7 วัน)
- แผน Starter (ทรัพยากรจำกัด)
- แผน Pro (ทรัพยากรมาตรฐาน)
- แผน Enterprise (ทรัพยากรตามความต้องการ)
- การอัพเกรด/ดาวน์เกรดแผน
- การต่ออายุและการเรียกเก็บเงินอัตโนมัติ

### 4. Payment System / ระบบการชำระเงิน
- Integration with Omise payment gateway
- Support for Thai credit/debit cards
- QR code payments (PromptPay)
- Bank transfers
- Payment history
- Automatic invoice generation
- Receipt generation (Thai tax format)

---

- การเชื่อมต่อกับเกตเวย์การชำระเงิน Omise
- รองรับบัตรเครดิต/เดบิตของไทย
- การชำระเงินผ่าน QR code (พร้อมเพย์)
- การโอนเงินผ่านธนาคาร
- ประวัติการชำระเงิน
- การสร้างใบแจ้งหนี้อัตโนมัติ
- การสร้างใบเสร็จรับเงิน (รูปแบบภาษีไทย)

### 5. Backup System / ระบบสำรองข้อมูล
- Automated scheduled backups
- Backup frequency based on subscription plan
- Manual backup option
- One-click restoration
- Backup download option
- S3 storage for backups
- Backup status monitoring

---

- การสำรองข้อมูลอัตโนมัติตามกำหนดเวลา
- ความถี่ในการสำรองข้อมูลตามแผนการสมัครสมาชิก
- ตัวเลือกการสำรองข้อมูลด้วยตนเอง
- การกู้คืนด้วยคลิกเดียว
- ตัวเลือกการดาวน์โหลดข้อมูลสำรอง
- การจัดเก็บข้อมูลสำรองใน S3
- การตรวจสอบสถานะการสำรองข้อมูล

### 6. Admin Dashboard System / ระบบแดชบอร์ดผู้ดูแลระบบ
- Comprehensive system overview and statistics
- User management for administrators
- All instances monitoring and management
- Payment tracking and reporting
- System performance metrics
- Customer support ticket management
- System-wide backup management
- Audit logs for administrative actions
- Server resource utilization monitoring
- Bilingual support (Thai/English) for admin interface

---

- ภาพรวมและสถิติของระบบอย่างครอบคลุม
- การจัดการผู้ใช้สำหรับผู้ดูแลระบบ
- การติดตามและจัดการอินสแตนซ์ทั้งหมด
- การติดตามและรายงานการชำระเงิน
- เมตริกประสิทธิภาพของระบบ
- การจัดการตั๋วสนับสนุนลูกค้า
- การจัดการข้อมูลสำรองทั่วทั้งระบบ
- บันทึกการตรวจสอบสำหรับการดำเนินการของผู้ดูแลระบบ
- การติดตามการใช้ทรัพยากรเซิร์ฟเวอร์
- รองรับสองภาษา (ไทย/อังกฤษ) สำหรับอินเทอร์เฟซผู้ดูแลระบบ

### 7. Support Ticket System / ระบบตั๋วสนับสนุน
- User-friendly ticket creation interface
- Rich text and image attachments for tickets 
- Ticket status tracking and notifications
- In-app messaging system for ticket replies
- Searchable knowledge base integration
- Automated responses for common issues
- Service level agreement (SLA) tracking
- Satisfaction surveys after ticket resolution

---

- อินเทอร์เฟซการสร้างตั๋วที่ใช้งานง่าย
- รองรับข้อความแบบ Rich text และการแนบรูปภาพ
- การติดตามสถานะตั๋วและการแจ้งเตือน
- ระบบการส่งข้อความในแอปสำหรับการตอบตั๋ว
- การผสานรวมฐานความรู้ที่สามารถค้นหาได้
- การตอบกลับอัตโนมัติสำหรับปัญหาทั่วไป
- การติดตามข้อตกลงระดับการให้บริการ (SLA)
- แบบสำรวจความพึงพอใจหลังจากการแก้ไขตั๋ว

### 8. System Monitoring / การติดตามระบบ
- Real-time server performance dashboards
- Resource utilization graphs (CPU, memory, disk)
- Network traffic monitoring with anomaly detection
- Server health status with alerting system
- Database performance and connection monitoring
- API endpoint response time tracking
- Automated alerts for critical issues
- Historical performance data analysis

---

- แดชบอร์ดประสิทธิภาพเซิร์ฟเวอร์แบบเรียลไทม์
- กราฟการใช้ทรัพยากร (CPU หน่วยความจำ ดิสก์)
- การติดตามทราฟฟิคเครือข่ายพร้อมการตรวจจับความผิดปกติ
- สถานะความสมบูรณ์ของเซิร์ฟเวอร์พร้อมระบบการแจ้งเตือน
- การติดตามประสิทธิภาพและการเชื่อมต่อฐานข้อมูล
- การติดตามเวลาตอบสนองของ API endpoint
- การแจ้งเตือนอัตโนมัติสำหรับปัญหาสำคัญ
- การวิเคราะห์ข้อมูลประสิทธิภาพย้อนหลัง

### 9. Audit Logging / การบันทึกการตรวจสอบ
- Comprehensive tracking of all administrative actions
- Detailed activity logs with user, IP, timestamp
- Searchable and filterable log interface
- Secure storage of audit data
- Export capabilities for compliance reporting
- Immutable log entries for security compliance
- Advanced filtering by action type and user
- Retention policies for log management

---

- การติดตามการดำเนินการของผู้ดูแลระบบทั้งหมดอย่างครอบคลุม
- บันทึกกิจกรรมโดยละเอียดพร้อมผู้ใช้ IP และเวลา
- อินเทอร์เฟซบันทึกที่สามารถค้นหาและกรองได้
- การจัดเก็บข้อมูลการตรวจสอบอย่างปลอดภัย
- ความสามารถในการส่งออกสำหรับการรายงานการปฏิบัติตามกฎระเบียบ
- รายการบันทึกที่ไม่สามารถเปลี่ยนแปลงได้เพื่อการปฏิบัติตามความปลอดภัย
- การกรองขั้นสูงตามประเภทการดำเนินการและผู้ใช้
- นโยบายการเก็บรักษาสำหรับการจัดการบันทึก

### 10. Analytics and Reporting / การวิเคราะห์และการรายงาน
- User growth and retention analytics
- Revenue and subscription metrics
- Instance utilization reports
- Performance benchmark comparisons
- Custom report builder for administrators
- Scheduled report delivery via email
- Exportable data in multiple formats (CSV, Excel, PDF)
- Visual data representation with interactive charts

---

- การวิเคราะห์การเติบโตและการรักษาผู้ใช้
- เมตริกรายได้และการสมัครสมาชิก
- รายงานการใช้งานอินสแตนซ์
- การเปรียบเทียบเกณฑ์ประสิทธิภาพ
- เครื่องมือสร้างรายงานแบบกำหนดเองสำหรับผู้ดูแลระบบ
- การส่งรายงานตามกำหนดเวลาทางอีเมล
- ข้อมูลที่สามารถส่งออกได้ในหลายรูปแบบ (CSV, Excel, PDF)
- การแสดงข้อมูลด้วยภาพพร้อมแผนภูมิแบบโต้ตอบ

## Technical Architecture / สถาปัตยกรรมทางเทคนิค

### 1. Frontend / ฟรอนต์เอนด์
- Next.js for server-side rendering
- React for component-based UI
- TailwindCSS for styling
- Bilingual support (Thai/English)
- Responsive design for all devices
- Context API for state management
- SWR for data fetching with caching
- React Hook Form for form validation

---

- Next.js สำหรับการเรนเดอร์ฝั่งเซิร์ฟเวอร์
- React สำหรับ UI แบบ component
- TailwindCSS สำหรับการจัดรูปแบบ
- รองรับสองภาษา (ไทย/อังกฤษ)
- การออกแบบที่ตอบสนองสำหรับทุกอุปกรณ์
- Context API สำหรับการจัดการสถานะ
- SWR สำหรับการดึงข้อมูลพร้อมการแคช
- React Hook Form สำหรับการตรวจสอบฟอร์ม

### 2. Backend / แบ็กเอนด์
- Next.js API routes
- Prisma ORM for database operations
- PostgreSQL for primary database
- Redis for caching and session management
- JWT for authentication
- Express middleware for specific routes
- Bull for background job processing
- Node.js event-driven architecture

---

- เส้นทาง API ของ Next.js
- Prisma ORM สำหรับการดำเนินการฐานข้อมูล
- PostgreSQL สำหรับฐานข้อมูลหลัก
- Redis สำหรับการแคชและการจัดการเซสชัน
- JWT สำหรับการยืนยันตัวตน
- Express middleware สำหรับเส้นทางเฉพาะ
- Bull สำหรับการประมวลผลงานเบื้องหลัง
- สถาปัตยกรรมแบบขับเคลื่อนด้วยเหตุการณ์ของ Node.js

### 3. Infrastructure / โครงสร้างพื้นฐาน
- Docker containers for n8n instances
- Kubernetes for orchestration
- NGINX for reverse proxy and load balancing
- Let's Encrypt for SSL certificates
- AWS S3 for backup storage
- AWS CloudFront for CDN
- AWS RDS for managed PostgreSQL
- Terraform for infrastructure as code
- CI/CD with GitHub Actions

---

- คอนเทนเนอร์ Docker สำหรับอินสแตนซ์ n8n
- Kubernetes สำหรับการออร์เคสเตรชัน
- NGINX สำหรับรีเวิร์สพร็อกซีและการสมดุลโหลด
- Let's Encrypt สำหรับใบรับรอง SSL
- AWS S3 สำหรับการจัดเก็บข้อมูลสำรอง
- AWS CloudFront สำหรับ CDN
- AWS RDS สำหรับ PostgreSQL แบบมีการจัดการ
- Terraform สำหรับโครงสร้างพื้นฐานในรูปแบบโค้ด
- CI/CD ด้วย GitHub Actions

### 4. Security / ความปลอดภัย
- HTTPS for all connections
- JWT with refresh tokens
- Password hashing with bcrypt
- Rate limiting
- DDoS protection
- Regular security audits
- Data encryption at rest and in transit
- IP-based access restrictions for admin
- Two-factor authentication for sensitive areas
- Automated vulnerability scanning

---

- HTTPS สำหรับการเชื่อมต่อทั้งหมด
- JWT พร้อม refresh tokens
- การแฮชรหัสผ่านด้วย bcrypt
- การจำกัดอัตรา
- การป้องกัน DDoS
- การตรวจสอบความปลอดภัยเป็นประจำ
- การเข้ารหัสข้อมูลเมื่อพักและระหว่างการส่ง
- การจำกัดการเข้าถึงตาม IP สำหรับผู้ดูแลระบบ
- การยืนยันตัวตนแบบสองปัจจัยสำหรับพื้นที่ที่มีความละเอียดอ่อน
- การสแกนช่องโหว่อัตโนมัติ

### 5. Monitoring and Logging / การติดตามและการบันทึก
- Prometheus for metric collection
- Grafana for metric visualization
- ELK stack for centralized logging
- Sentry for error tracking
- Uptime Robot for external monitoring
- Custom alerting system with email/SMS/LINE notifications
- Performance metrics collection and analysis
- Security event monitoring and alerting

---

- Prometheus สำหรับการเก็บรวบรวมเมตริก
- Grafana สำหรับการแสดงเมตริก
- ELK stack สำหรับการบันทึกแบบรวมศูนย์
- Sentry สำหรับการติดตามข้อผิดพลาด
- Uptime Robot สำหรับการติดตามจากภายนอก
- ระบบแจ้งเตือนแบบกำหนดเองพร้อมการแจ้งเตือนทางอีเมล/SMS/LINE
- การเก็บรวบรวมและวิเคราะห์เมตริกประสิทธิภาพ
- การติดตามและแจ้งเตือนเหตุการณ์ด้านความปลอดภัย

## Database Schema / สคีมาฐานข้อมูล
```prisma
// User model
model User {
  id                 String       @id @default(uuid())
  createdAt          DateTime     @default(now())
  username           String       @unique
  email              String       @unique
  passwordHash       String
  plan               PlanType     @default(free)
  isActive           Boolean      @default(true)
  expiresAt          DateTime?
  isSuspended        Boolean      @default(false)
  lastLoginAt        DateTime?
  resetToken         String?
  resetTokenExpiresAt DateTime?
  role               UserRole     @default(user)
  instances          Instance[]
  payments           Payment[]
  supportTickets     SupportTicket[]
}

// Instance model
model Instance {
  id            String         @id @default(uuid())
  createdAt     DateTime       @default(now())
  userId        String
  port          Int
  subdomain     String         @unique
  customDomain  String?        @unique
  dockerPath    String
  status        InstanceStatus @default(provisioning)
  isBackedUp    Boolean        @default(false)
  lastBackupAt  DateTime?
  cpuAllocation Float          @default(1.0)  // in cores
  ramAllocation Int            @default(1024) // in MB
  diskAllocation Int           @default(10)   // in GB
  maxExecutions Int            @default(100)  // max workflow executions per day
  user          User           @relation(fields: [userId], references: [id])
  backups       Backup[]
  logs          Log[]
}

// Backup model
model Backup {
  id          String       @id @default(uuid())
  createdAt   DateTime     @default(now())
  instanceId  String
  status      BackupStatus @default(pending)
  type        BackupType   @default(scheduled)
  path        String?      // S3 path for backups
  size        Int?         // in bytes
  jobId       String?
  completedAt DateTime?
  errorMessage String?
  instance    Instance     @relation(fields: [instanceId], references: [id])
}

// Payment model
model Payment {
  id              String         @id @default(uuid())
  userId          String
  amount          Float
  currency        String         @default("THB")
  status          PaymentStatus  @default(pending)
  paymentDate     DateTime       @default(now())
  paymentProvider String
  invoiceId       String?
  metadata        Json?
  nextBillingDate DateTime?
  plan            PlanType
  gateway         PaymentGateway
  gatewayChargeId String?
  gatewayResponse Json?
  errorMessage    String?
  createdAt       DateTime       @default(now())
  user            User           @relation(fields: [userId], references: [id])
}

// Support Ticket model
model SupportTicket {
  id          String           @id @default(uuid())
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
  userId      String
  subject     String
  description String
  status      TicketStatus     @default(open)
  priority    TicketPriority   @default(medium)
  assignedTo  String?
  closedAt    DateTime?
  user        User             @relation(fields: [userId], references: [id])
  messages    TicketMessage[]
}

// Ticket Message model
model TicketMessage {
  id          String       @id @default(uuid())
  createdAt   DateTime     @default(now())
  ticketId    String
  sender      String       // can be user ID or admin ID
  message     String
  isFromAdmin Boolean
  ticket      SupportTicket @relation(fields: [ticketId], references: [id])
}

// Log model
model Log {
  id         String    @id @default(uuid())
  createdAt  DateTime  @default(now())
  instanceId String
  type       LogType
  message    String
  instance   Instance  @relation(fields: [instanceId], references: [id])
}

// Admin Audit Log model
model AdminAuditLog {
  id         String    @id @default(uuid())
  createdAt  DateTime  @default(now())
  adminId    String
  action     String
  entityType String
  entityId   String?
  details    Json?
  ipAddress  String?
}

// System Metrics model
model SystemMetric {
  id          String    @id @default(uuid())
  timestamp   DateTime  @default(now())
  metricType  String
  value       Float
  serverName  String?
  details     Json?
}

// Enums
enum PlanType {
  free
  starter
  pro
  enterprise
}

enum UserRole {
  user
  admin
  support
}

enum InstanceStatus {
  provisioning
  running
  stopped
  restarting
  failed
  suspended
}

enum BackupStatus {
  pending
  in_progress
  completed
  failed
}

enum BackupType {
  scheduled
  manual
}

enum PaymentStatus {
  pending
  completed
  failed
  refunded
}

enum PaymentGateway {
  omise
  promptpay
  bank_transfer
  manual
}

enum LogType {
  info
  warning
  error
}

enum TicketStatus {
  open
  in_progress
  waiting_for_customer
  resolved
  closed
}

enum TicketPriority {
  low
  medium
  high
  urgent
}
```

## API Endpoints / จุดสิ้นสุด API

### Authentication / การยืนยันตัวตน
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in and receive JWT
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/reset-password` - Request password reset
- `POST /api/auth/set-password` - Set new password after reset

### Instances / อินสแตนซ์
- `GET /api/instances` - List all instances for user
- `POST /api/instances` - Create a new instance
- `GET /api/instances/:id` - Get instance details
- `DELETE /api/instances/:id` - Delete an instance
- `POST /api/instances/control` - Control instance (start/stop/restart)
- `GET /api/instances/:id/logs` - Get instance logs
- `GET /api/instances/:id/metrics` - Get instance metrics

### Backups / สำรองข้อมูล
- `GET /api/backups` - List all backups for an instance
- `POST /api/backups` - Create a manual backup
- `GET /api/backups/:id` - Get backup details
- `POST /api/backups/:id/restore` - Restore from backup
- `GET /api/backups/:id/download` - Generate download URL

### Payments / การชำระเงิน
- `GET /api/payments` - List payment history
- `POST /api/payments` - Create a new payment
- `GET /api/payments/:id` - Get payment details
- `GET /api/payments/:id/invoice` - Download invoice
- `GET /api/payments/:id/receipt` - Download receipt

### User Management / การจัดการผู้ใช้
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `PUT /api/users/me/plan` - Change subscription plan
- `GET /api/users/me/usage` - Get resource usage stats

### Support Tickets / ตั๋วสนับสนุน
- `GET /api/support/tickets` - List all tickets for user
- `POST /api/support/tickets` - Create a new ticket
- `GET /api/support/tickets/:id` - Get ticket details
- `POST /api/support/tickets/:id/message` - Add a message to ticket
- `PUT /api/support/tickets/:id/status` - Update ticket status

### Admin API / API ของผู้ดูแลระบบ
- `GET /api/admin/dashboard` - Get admin dashboard statistics
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id` - Update user
- `PUT /api/admin/users/:id/status` - Update user status (suspend/activate)
- `PUT /api/admin/users/:id/plan` - Update user subscription plan
- `GET /api/admin/instances` - List all instances
- `GET /api/admin/instances/:id` - Get instance details
- `POST /api/admin/instances/:id/control` - Control any instance
- `GET /api/admin/payments` - List all payments
- `GET /api/admin/payments/stats` - Get payment statistics
- `PUT /api/admin/payments/:id/status` - Update payment status
- `GET /api/admin/backups` - List all backups
- `POST /api/admin/backups/:id/restore` - Restore from backup
- `GET /api/admin/system/metrics` - Get system performance metrics
- `GET /api/admin/system/logs` - Get system logs
- `GET /api/admin/audit-logs` - Get admin audit logs
- `GET /api/admin/support/tickets` - List all support tickets
- `PUT /api/admin/support/tickets/:id/assign` - Assign a ticket
- `POST /api/admin/support/tickets/:id/message` - Reply to a ticket

## Subscription Plans Detail / รายละเอียดแผนการสมัครสมาชิก

### Free Trial / ทดลองใช้ฟรี
- Duration: 7 days
- Resources: 512 MB RAM, 1 CPU, 5 GB Disk
- Max Workflows: 5
- Backup Frequency: None
- Custom Domain: No
- Support: Email

---

- ระยะเวลา: 7 วัน
- ทรัพยากร: 512 MB RAM, 1 CPU, 5 GB พื้นที่จัดเก็บ
- เวิร์กโฟลว์สูงสุด: 5
- ความถี่การสำรองข้อมูล: ไม่มี
- โดเมนที่กำหนดเอง: ไม่มี
- การสนับสนุน: อีเมล

### Starter Plan / แผน Starter
- Price: ฿299/month
- Resources: 1 GB RAM, 1 CPU,
