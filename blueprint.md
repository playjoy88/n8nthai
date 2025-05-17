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

## Technical Architecture / สถาปัตยกรรมทางเทคนิค

### 1. Frontend / ฟรอนต์เอนด์
- Next.js for server-side rendering
- React for component-based UI
- TailwindCSS for styling
- Bilingual support (Thai/English)
- Responsive design for all devices
- Context API for state management

---

- Next.js สำหรับการเรนเดอร์ฝั่งเซิร์ฟเวอร์
- React สำหรับ UI แบบ component
- TailwindCSS สำหรับการจัดรูปแบบ
- รองรับสองภาษา (ไทย/อังกฤษ)
- การออกแบบที่ตอบสนองสำหรับทุกอุปกรณ์
- Context API สำหรับการจัดการสถานะ

### 2. Backend / แบ็กเอนด์
- Next.js API routes
- Prisma ORM for database operations
- PostgreSQL for primary database
- Redis for caching and session management
- JWT for authentication
- Express middleware for specific routes

---

- เส้นทาง API ของ Next.js
- Prisma ORM สำหรับการดำเนินการฐานข้อมูล
- PostgreSQL สำหรับฐานข้อมูลหลัก
- Redis สำหรับการแคชและการจัดการเซสชัน
- JWT สำหรับการยืนยันตัวตน
- Express middleware สำหรับเส้นทางเฉพาะ

### 3. Infrastructure / โครงสร้างพื้นฐาน
- Docker containers for n8n instances
- Kubernetes for orchestration
- NGINX for reverse proxy and load balancing
- Let's Encrypt for SSL certificates
- AWS S3 for backup storage
- AWS CloudFront for CDN
- AWS RDS for managed PostgreSQL

---

- คอนเทนเนอร์ Docker สำหรับอินสแตนซ์ n8n
- Kubernetes สำหรับการออร์เคสเตรชัน
- NGINX สำหรับรีเวิร์สพร็อกซีและการสมดุลโหลด
- Let's Encrypt สำหรับใบรับรอง SSL
- AWS S3 สำหรับการจัดเก็บข้อมูลสำรอง
- AWS CloudFront สำหรับ CDN
- AWS RDS สำหรับ PostgreSQL แบบมีการจัดการ

### 4. Security / ความปลอดภัย
- HTTPS for all connections
- JWT with refresh tokens
- Password hashing with bcrypt
- Rate limiting
- DDoS protection
- Regular security audits
- Data encryption at rest and in transit

---

- HTTPS สำหรับการเชื่อมต่อทั้งหมด
- JWT พร้อม refresh tokens
- การแฮชรหัสผ่านด้วย bcrypt
- การจำกัดอัตรา
- การป้องกัน DDoS
- การตรวจสอบความปลอดภัยเป็นประจำ
- การเข้ารหัสข้อมูลเมื่อพักและระหว่างการส่ง

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
  s3Path      String?
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

### Starter Plan / แผน Starter
- Price: ฿299/month
- Resources: 1 GB RAM, 1 CPU, 10 GB Disk
- Max Workflows: 10
- Backup Frequency: Weekly
- Custom Domain: No
- Support: Email

### Pro Plan / แผน Pro
- Price: ฿799/month
- Resources: 2 GB RAM, 2 CPU, 20 GB Disk
- Max Workflows: Unlimited
- Backup Frequency: Daily
- Custom Domain: Yes
- Support: Email, Priority Support

### Enterprise Plan / แผน Enterprise
- Price: ฿2,499/month
- Resources: 4+ GB RAM, 4+ CPU, 50+ GB Disk
- Max Workflows: Unlimited
- Backup Frequency: Daily
- Custom Domain: Yes
- Support: Email, Priority Support, Dedicated Contact

## Admin Dashboard Pages / หน้าแดชบอร์ดผู้ดูแลระบบ

### 1. Admin Overview Dashboard / หน้าภาพรวมผู้ดูแลระบบ
- System-wide statistics (users, instances, revenue)
- Active users count and total users count 
- Running instances count and total instances count
- Daily and monthly revenue metrics
- Server resource utilization (CPU, memory, disk)
- Recent user sign-ups with details
- Recent payment transactions
- User growth over time graph
- Revenue over time graph
- System health status indicators

### 2. User Management / การจัดการผู้ใช้
- Complete list of all users with pagination
- Advanced filtering options (status, plan, etc.)
- Search functionality by username/email
- Detailed user information display
- User suspension and activation controls
- Plan management for each user
- Usage statistics for each user
- User instance list with quick access
- Payment history for each user
- Support ticket history for each user

### 3. Instance Management / การจัดการอินสแตนซ์
- List of all n8n instances across all users
- Instance filtering by status and user
- Search by subdomain or custom domain
- Instance status monitoring (running, stopped, etc.)
- Resource allocation details (CPU, RAM, disk)
- Start/stop/restart controls for each instance
- Backup status and last backup time
- Performance metrics for each instance
- Access to instance logs
- Direct link to instance admin panel

### 4. Payment Management / การจัดการการชำระเงิน
- Comprehensive payment transaction listing
- Payment filtering by status, date, and method
- Payment statistics and summary
- Daily, weekly, and monthly revenue reports
- Pending payment approval system
- Manual payment processing
- Payment status updates and notifications
- Refund processing capability
- Invoice and receipt generation
- Integration with Thai tax reporting system

### 5. Backup Management / การจัดการข้อมูลสำรอง
- System-wide backup status monitoring
- List of all backups for all instances
- Filtering by instance, status, and date
- Manual backup initiation for any instance
- Restore operation controls
- Backup download functionality
- Backup size and storage metrics
- Backup retention policy management
- Failed backup notifications and resolution
- Backup scheduling controls

### 6. Support Ticket System / ระบบตั๋วสนับสนุน
- Centralized support ticket management
- Ticket categorization and prioritization
- Ticket assignment to support staff
- Communication interface for ticket responses
- Internal notes for support team
- Ticket status tracking
- SLA monitoring and alerts
- Knowledge base integration
- Customer satisfaction tracking
- Historical ticket analysis and reporting

### 7. System Monitoring / การติดตามระบบ
- Real-time server performance metrics
- Resource utilization graphs (CPU, memory, disk)
- Network traffic monitoring
- Database performance metrics
- API endpoint usage statistics
- Error rate monitoring and alerting
- Background job and queue monitoring
- Scheduled task status tracking
- System logs viewer with filtering
- Alert configuration and notifications

### 8. Audit Logs / บันทึกการตรวจสอบ
- Comprehensive admin action logging
- Detailed activity tracking by admin user
- Filtering by action type, admin, and date
- Security event monitoring
- System access logs
- Critical operation tracking
- Exportable log data for compliance
- Log retention policy management
- Suspicious activity detection
- Compliance reporting capabilities

## Implementation Progress / ความคืบหน้าในการพัฒนา

### Completed / เสร็จสมบูรณ์แล้ว
- ✅ User authentication system
- ✅ User registration and login
- ✅ JWT token authentication
- ✅ Instance management - basic functionality
- ✅ Admin Dashboard - Overview page
- ✅ Admin Dashboard - User management page
- ✅ Admin Dashboard - Instance management page 
- ✅ Admin Dashboard - Payment management page
- ✅ Thai language support for user interface

### In Progress / กำลังดำเนินการ
- 🔄 Payment system integration with Omise
- 🔄 Backup system implementation
- 🔄 Admin Dashboard - Backup management page
- 🔄 Admin Dashboard - Support ticket system
- 🔄 Admin Dashboard - System monitoring page
- 🔄 Admin Dashboard - Audit logs page

### Pending / รอดำเนินการ
- ⏳ Custom domain configuration
- ⏳ Automatic scaling based on usage
- ⏳ Advanced reporting and analytics
- ⏳ Business intelligence features
- ⏳ Mobile application development
- ⏳ Multi-region deployment

## Implementation Roadmap / แผนการทำงาน

### Phase 1: Core Infrastructure / เฟส 1: โครงสร้างพื้นฐานหลัก
- Set up Kubernetes cluster
- Configure NGINX and SSL
- Implement Docker container management
- Set up database with Prisma ORM
- Implement basic authentication system

### Phase 2: User Management / เฟส 2: การจัดการผู้ใช้
- User registration and login
- Profile management
- Password reset functionality
- Role-based access control
- Thai language support

### Phase 3: Instance Management / เฟส 3: การจัดการอินสแตนซ์
- Instance provisioning
- Start/stop/restart controls
- Resource allocation
- Domain management
- Status monitoring and logs

### Phase 4: Backup System / เฟส 4: ระบบสำรองข้อมูล
- S3 integration
- Scheduled backups
- Restore functionality
- Backup download
- Status monitoring

### Phase 5: Payment System / เฟส 5: ระบบการชำระเงิน
- Omise integration
- Subscription management
- Invoice generation
- Payment history
- Thai tax-compliant receipts

### Phase 6: Admin Dashboard / เฟส 6: แดชบอร์ดผู้ดูแลระบบ
- Admin authentication and authorization
- User management interface
- Instance monitoring dashboard
- Payment tracking system
- System-wide backup management
- Support ticket system
- System health monitoring
- Audit logging system

### Phase 7: Advanced Features / เฟส 7: ฟีเจอร์ขั้นสูง
- Performance metrics
- Email notifications
- Custom domains
- API rate limiting
- Security audits
- Advanced reporting tools
- Business intelligence dashboards

## Monitoring and Operations / การติดตามและการดำเนินงาน

### Metrics to Track / เมตริกที่ต้องติดตาม
- Server uptime
- Instance resource usage
- Backup success rate
- Payment conversion rate
- User retention rate
- Support ticket volume
- Time to resolve support tickets
- Server response times
- User satisfaction scores
- Revenue per user

### Operational Procedures / ขั้นตอนการดำเนินงาน
- Daily system health checks
- Weekly backup verification
- Monthly security audits
- Quarterly performance reviews
- Incident response plan
- Customer support workflow
- Payment reconciliation process
- Escalation procedures
- Maintenance schedules
- Disaster recovery testing

## Technology Stack Summary / สรุปเทคโนโลยีที่ใช้

### Frontend / ฟรอนต์เอนด์
- Next.js (React)
- TailwindCSS
- SWR for data fetching
- React Hook Form
- Context API
- Chart.js for analytics visualizations
- React Table for data display
- React Query for admin dashboard

### Backend / แบ็กเอนด์
- Next.js API Routes
- Prisma ORM
- PostgreSQL
- Redis
- JWT Authentication
- Bull for background job processing
- Nodemailer for email notifications

### DevOps / เดฟอ็อปส์
- Docker
- Kubernetes
- NGINX
- AWS (S3, CloudFront, RDS)
- GitHub Actions for CI/CD
- Terraform for infrastructure as code

### Monitoring / การติดตาม
- Prometheus for metrics
- Grafana for visualization
- Sentry for error tracking
- Uptime Robot for uptime monitoring
- Slack for alerts
- Datadog for comprehensive monitoring
- ELK stack for log management
