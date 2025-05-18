# วิธีการอัพโค้ดไปยัง GitHub

คู่มือนี้จะแนะนำขั้นตอนการอัพโค้ดโปรเจค n8nThai ไปยัง GitHub เพื่อให้สามารถนำไปใช้ในการ deploy บน Coolify หรือแพลตฟอร์มอื่นๆ ได้

## สิ่งที่ต้องมี

- [Git](https://git-scm.com/downloads) ติดตั้งบนคอมพิวเตอร์ของคุณ
- บัญชี [GitHub](https://github.com/)
- โปรเจค n8nThai ที่มีไฟล์ Docker และไฟล์การตั้งค่าพร้อมแล้ว

## ขั้นตอนการอัพโค้ดไปยัง GitHub

### 1. สร้าง Repository ใหม่บน GitHub

1. ล็อกอินเข้าบัญชี GitHub ของคุณ
2. คลิกที่ไอคอน "+" ที่มุมบนขวาและเลือก "New repository"
3. ป้อนชื่อ repository (เช่น "n8nthai")
4. เพิ่มคำอธิบายตามต้องการ
5. เลือกความเป็นส่วนตัวของ repository:
   - Public: ทุกคนสามารถเห็น repository ได้ แต่คุณเลือกได้ว่าใครจะเป็นผู้มีสิทธิ์แก้ไขโค้ด
   - Private: คุณเลือกได้ว่าใครจะเห็นและแก้ไขโค้ดใน repository
6. อย่าเลือกตัวเลือกเริ่มต้น repository ด้วย README, .gitignore, หรือ license
7. คลิก "Create repository"

### 2. เริ่มต้นใช้งาน Git ในโปรเจคของคุณ

เปิด Command Prompt หรือ Terminal และนำทางไปยังโฟลเดอร์โปรเจค n8nThai ของคุณ:

```bash
cd c:/Users/PLANT44/Documents/n8nThai/n8nthai
```

เริ่มต้น Git repository ใหม่:

```bash
git init
```

### 3. เพิ่มไฟล์ .gitignore (ถ้ายังไม่มี)

ถ้าคุณยังไม่มีไฟล์ .gitignore ให้สร้างไฟล์ใหม่เพื่อยกเว้นไฟล์ที่ไม่จำเป็นต้องอัพโหลด:

```
# Dependencies
/node_modules
/.pnp
.pnp.js

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Keep .env.example for reference
!.env.example
!.env.coolify

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local Netlify folder
.netlify

# Vercel
.vercel

# Traefik ACME data
traefik/acme
```

### 4. เพิ่มไฟล์ทั้งหมดเข้าสู่ Git

เพิ่มไฟล์ทั้งหมดในโปรเจคเข้าสู่ Git:

```bash
git add .
```

หากต้องการตรวจสอบไฟล์ที่จะถูกเพิ่ม:

```bash
git status
```

### 5. Commit ไฟล์ของคุณ

สร้าง commit แรกของคุณ:

```bash
git commit -m "Initial commit: n8nThai Docker deployment with Traefik"
```

### 6. เชื่อมต่อกับ GitHub Repository

เชื่อมต่อ local repository กับ GitHub repository:

```bash
git remote add origin https://github.com/playjoy88/n8nthai.git
```

แทนที่ `yourusername` ด้วยชื่อผู้ใช้ GitHub ของคุณและ `n8nthai` ด้วยชื่อ repository ของคุณ

### 7. Push โค้ดไปยัง GitHub

Push โค้ดของคุณไปยัง GitHub:

```bash
git push -u origin main
```

หมายเหตุ: หากชื่อ branch หลักของคุณเป็น `master` แทนที่จะเป็น `main` ให้ใช้:

```bash
git push -u origin master
```

### 8. ตรวจสอบ Repository ของคุณ

1. ไปที่ `https://github.com/yourusername/n8nthai` ในเบราว์เซอร์ของคุณ
2. ตรวจสอบว่าไฟล์ทั้งหมดถูก push สำเร็จแล้ว

## ไฟล์สำคัญที่ต้องตรวจสอบ

ตรวจสอบให้แน่ใจว่าไฟล์สำคัญเหล่านี้มีอยู่ใน GitHub repository ของคุณ:

1. `Dockerfile` - การตั้งค่าการสร้างแอปพลิเคชัน
2. `docker-compose.yml` - การจัดการ container พร้อม Traefik
3. `.env.coolify` - แม่แบบตัวแปรสภาพแวดล้อม (แต่ไม่ใช่ไฟล์ .env จริงของคุณ)
4. `traefik/traefik.yml` - การตั้งค่าหลักของ Traefik
5. `traefik/config/dynamic.yml` - การตั้งค่าแบบไดนามิกของ Traefik
6. เอกสารการ deploy:
   - `COOLIFY-DEPLOYMENT.md`
   - `COOLIFY-DOCKER-DEPLOYMENT-STEPS.md`
   - `COOLIFY-DOCKER-QUICK-START.md`
   - `HOW-TO-DEPLOY-TO-COOLIFY.md`

## ขั้นตอนต่อไป

หลังจากที่ push โค้ดไปยัง GitHub สำเร็จแล้ว คุณสามารถ:

1. Clone repository บนเซิร์ฟเวอร์ของคุณหรือใช้ Coolify เชื่อมต่อโดยตรงกับ GitHub repository
2. ทำตามขั้นตอนใน `COOLIFY-DOCKER-DEPLOYMENT-STEPS.md` เพื่อ deploy จาก GitHub repository ไปยัง Coolify

## การอัพเดต Repository ของคุณ

เมื่อคุณทำการเปลี่ยนแปลงโปรเจค ใช้คำสั่งเหล่านี้เพื่ออัพเดต GitHub repository ของคุณ:

```bash
# เพิ่มการเปลี่ยนแปลงของคุณ
git add .

# Commit การเปลี่ยนแปลงของคุณ
git commit -m "คำอธิบายการเปลี่ยนแปลงของคุณ"

# Push ไปยัง GitHub
git push
```

## การตั้งค่า GitHub Actions (ทางเลือก)

หากคุณต้องการทำให้กระบวนการ deploy อัตโนมัติ:

1. สร้างไดเร็กทอรี `.github/workflows` ในโปรเจคของคุณ
2. เพิ่มไฟล์ workflow เช่น `deploy.yml` พร้อมการตั้งค่า CI/CD ของคุณ
3. Push การเปลี่ยนแปลงเหล่านี้ไปยัง GitHub
4. GitHub Actions จะทำงานตาม workflow ของคุณโดยอัตโนมัติเมื่อมี commit ใหม่

วิธีนี้ช่วยให้การบูรณาการและการ deploy ต่อเนื่องจาก GitHub ไปยังเซิร์ฟเวอร์ Coolify หรือแพลตฟอร์มโฮสติ้งอื่นๆ ได้โดยตรง
