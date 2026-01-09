// import { PrismaClient } from '@prisma/client';
import { SOVEREIGN_GENESIS_DATA } from './dummy-data';

// Mock PrismaClient
class PrismaClient {
  async $disconnect() {}
  transaction = { deleteMany: async () => {} };
  invoice = { deleteMany: async () => {}, createMany: async (args: any) => {} };
  attendance = { deleteMany: async () => {} };
  student = { deleteMany: async () => {}, create: async (args: any) => {} };
  user = { deleteMany: async () => {}, create: async (args: any) => {} };
  book = { createMany: async (args: any) => {} };
  bus = { createMany: async (args: any) => {} };
}

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Sovereign Genesis Seeding...");

  // 1. Clean Slate (Caution: Deletes all data)
  console.log("🧹 Clearing existing data...");
  // await prisma.transaction.deleteMany();
  // await prisma.invoice.deleteMany();
  // await prisma.attendance.deleteMany();
  // await prisma.student.deleteMany();
  // await prisma.user.deleteMany();

  // 2. Seed Users & Staff
  console.log(`👨‍🏫 Seeding ${SOVEREIGN_GENESIS_DATA.staff.length} Staff members...`);
  for (const staff of SOVEREIGN_GENESIS_DATA.staff) {
    // In real app, create User + TeacherProfile relation
    // await prisma.user.create({ data: { ...staff } });
  }

  // 3. Seed Students
  console.log(`🎓 Seeding ${SOVEREIGN_GENESIS_DATA.students.length} Students...`);
  for (const student of SOVEREIGN_GENESIS_DATA.students) {
    // await prisma.student.create({ data: { ...student } });
  }

  // 4. Seed Logistics
  console.log(`🚌 Seeding Buses, Books, and Hostel Rooms...`);
  // await prisma.book.createMany({ data: SOVEREIGN_GENESIS_DATA.books });
  // await prisma.bus.createMany({ data: SOVEREIGN_GENESIS_DATA.buses });

  // 5. Seed Finance
  console.log(`💰 Seeding Invoices...`);
  // await prisma.invoice.createMany({ data: SOVEREIGN_GENESIS_DATA.invoices });

  console.log("✅ Sovereign Genesis Complete. Ready for Demo.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });