import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function checkAdmin() {
  const user = await prisma.user.findUnique({ where: { login: 'admin' } });
  if (!user) {
    console.log('User admin NOT FOUND');
    return;
  }
  const isMatch = await bcrypt.compare('admin123', user.password);
  console.log('User admin found. Password match:', isMatch);
  await prisma.$disconnect();
}

checkAdmin();
