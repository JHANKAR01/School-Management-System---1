import { PrismaClient } from '@prisma/client';
import { SOVEREIGN_GENESIS_DATA } from './dummy-data.ts'; // Added .ts extension

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Sovereign Genesis Seeding...");

  // 1. Clean Slate (Caution: Deletes all data)
  console.log("🧹 Clearing existing data...");
  // Use a transaction or specific order to handle foreign key constraints
  await prisma.invoice.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.student.deleteMany();
  await prisma.user.deleteMany();
  await prisma.book.deleteMany();
  await prisma.bus.deleteMany();

  // 2. Seed Users & Staff
  console.log(`👨‍🏫 Seeding ${SOVEREIGN_GENESIS_DATA.staff.length} Staff members...`);
  for (const staff of SOVEREIGN_GENESIS_DATA.staff) {
    await prisma.user.create({ data: { ...staff } }); // Uncommented
  }

  // 3. Seed Students
  console.log(`🎓 Seeding ${SOVEREIGN_GENESIS_DATA.students.length} Students...`);
  for (const student of SOVEREIGN_GENESIS_DATA.students) {
    await prisma.student.create({ data: { ...student } }); // Uncommented
  }

  // 4. Seed Logistics
  console.log(`🚌 Seeding Buses and Books...`);
  await prisma.book.createMany({ data: SOVEREIGN_GENESIS_DATA.books }); // Uncommented
  await prisma.bus.createMany({ data: SOVEREIGN_GENESIS_DATA.buses }); // Uncommented

  // 5. Seed Finance
  console.log(`💰 Seeding Invoices...`);
  await prisma.invoice.createMany({ data: SOVEREIGN_GENESIS_DATA.invoices }); // Uncommented

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