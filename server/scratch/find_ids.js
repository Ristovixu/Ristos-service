const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  const clients = await prisma.client.findMany();
  console.log('--- USERS ---');
  console.log(JSON.stringify(users, null, 2));
  console.log('--- CLIENTS ---');
  console.log(JSON.stringify(clients, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
