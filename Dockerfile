# ใช้ Node.js เวอร์ชัน 18 เป็น Base Image
FROM node:18

# ตั้งค่าตำแหน่งทำงานใน container
WORKDIR /app

# คัดลอก package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์ทั้งหมดไปยัง container
COPY . .

# เปิดพอร์ต 3000
EXPOSE 3000

# คำสั่งรันแอป
CMD ["node", "server.js"]
