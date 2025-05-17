# วิธีการติดตั้ง Git

คู่มือนี้จะแนะนำวิธีการติดตั้ง Git บนระบบปฏิบัติการต่างๆ โดยเฉพาะสำหรับ Windows ซึ่งเป็นระบบปฏิบัติการที่คุณใช้งานอยู่

## การติดตั้ง Git บน Windows

### วิธีที่ 1: ใช้ Git for Windows (แนะนำ)

1. ไปที่เว็บไซต์ [Git for Windows](https://gitforwindows.org/) หรือ [Git Official Website](https://git-scm.com/download/win)
2. คลิกปุ่มดาวน์โหลดเพื่อดาวน์โหลด Git สำหรับ Windows
3. เมื่อดาวน์โหลดเสร็จ ให้เปิดไฟล์ติดตั้ง (.exe)
4. ตัวช่วยติดตั้งจะปรากฏขึ้น คลิก "Next" เพื่อเริ่มต้นการติดตั้ง
5. คุณสามารถใช้การตั้งค่าเริ่มต้นในขั้นตอนต่อไปนี้หรือปรับแต่งตามต้องการ:
   - เลือกตำแหน่งการติดตั้ง
   - เลือกส่วนประกอบที่จะติดตั้ง
   - เลือกชื่อโฟลเดอร์ในเมนู Start
   - เลือกโปรแกรมแก้ไขข้อความเริ่มต้น
   - ปรับแต่งการตั้งค่าเส้นทางสภาพแวดล้อม
   - เลือกการใช้ OpenSSL สำหรับ HTTPS
   - เลือกสไตล์การแปลงบรรทัด
   - เลือกเทอร์มินัลที่จะใช้กับ Git Bash
   - เลือกพฤติกรรมของ `git pull`
   - เลือกเครื่องมืือที่จะใช้สำหรับการแก้ไขการขัดแย้ง (conflict)
   - เลือกตัวเลือกเพิ่มเติม (credential helper, file system caching, symbolic links)
   - เลือกฟีเจอร์ทดลอง (ถ้ามี)
6. คลิก "Install" เพื่อติดตั้ง Git
7. เมื่อการติดตั้งเสร็จสิ้น คลิก "Finish"

### วิธีที่ 2: ใช้ Chocolatey (สำหรับผู้ใช้ที่คุ้นเคยกับ PowerShell)

หากคุณใช้ [Chocolatey](https://chocolatey.org/) ซึ่งเป็นเครื่องมือจัดการแพ็คเกจสำหรับ Windows คุณสามารถติดตั้ง Git ผ่านคำสั่ง PowerShell ได้:

1. เปิด PowerShell ในโหมดผู้ดูแลระบบ (คลิกขวาที่ PowerShell และเลือก "Run as administrator")
2. รันคำสั่งต่อไปนี้:

```powershell
choco install git -y
```

### วิธีที่ 3: ใช้ Winget (Windows Package Manager)

สำหรับ Windows 10 และ 11 ที่มี [Winget](https://docs.microsoft.com/en-us/windows/package-manager/winget/):

1. เปิด Command Prompt หรือ PowerShell
2. รันคำสั่งต่อไปนี้:

```cmd
winget install --id Git.Git -e --source winget
```

## การยืนยันการติดตั้ง

หลังจากติดตั้ง Git เรียบร้อยแล้ว คุณสามารถยืนยันได้โดย:

1. เปิด Command Prompt หรือ PowerShell
2. รันคำสั่งต่อไปนี้:

```cmd
git --version
```

คุณควรจะเห็นหมายเลขเวอร์ชันของ Git ที่ติดตั้ง เช่น `git version 2.40.0.windows.1`

## การตั้งค่าพื้นฐาน

หลังจากติดตั้ง Git เรียบร้อยแล้ว คุณควรตั้งค่าพื้นฐานโดยการระบุชื่อและอีเมลของคุณ:

1. เปิด Command Prompt หรือ PowerShell
2. ตั้งค่าชื่อผู้ใช้ของคุณโดยรันคำสั่ง:

```cmd
git config --global user.name "ชื่อของคุณ"
```

3. ตั้งค่าอีเมลของคุณโดยรันคำสั่ง:

```cmd
git config --global user.email "อีเมลของคุณ@example.com"
```

## แนะนำ Git GUI สำหรับผู้เริ่มต้น

หากคุณไม่คุ้นเคยกับการใช้งาน Git ผ่าน Command Line อาจพิจารณาใช้โปรแกรมที่มีอินเทอร์เฟซกราฟิกเหล่านี้:

1. **GitHub Desktop** - [https://desktop.github.com/](https://desktop.github.com/)
2. **GitKraken** - [https://www.gitkraken.com/](https://www.gitkraken.com/)
3. **Sourcetree** - [https://www.sourcetreeapp.com/](https://www.sourcetreeapp.com/)
4. **Visual Studio Code** - มี Git integration ในตัว

## การติดตั้ง Git บน macOS

### วิธีที่ 1: ใช้ Homebrew

1. เปิด Terminal
2. ติดตั้ง Homebrew (ถ้ายังไม่มี) โดยรันคำสั่ง:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

3. ติดตั้ง Git โดยรันคำสั่ง:

```bash
brew install git
```

### วิธีที่ 2: ใช้ Installer Package

1. ไปที่ [Git Official Website](https://git-scm.com/download/mac)
2. ดาวน์โหลดและเปิดไฟล์ .dmg
3. ติดตั้งตามคำแนะนำ

## การติดตั้ง Git บน Linux

### Ubuntu/Debian

```bash
sudo apt-get update
sudo apt-get install git
```

### Fedora

```bash
sudo dnf install git
```

### CentOS/RHEL

```bash
sudo yum install git
```

## ขั้นตอนต่อไป

หลังจากติดตั้ง Git เรียบร้อยแล้ว คุณสามารถดำเนินการตามคู่มือ [วิธีการอัพโค้ดไปยัง GitHub](วิธีการอัพโค้ดไปยัง-GitHub.md) เพื่ออัพโหลดโค้ดของคุณไปยัง GitHub
