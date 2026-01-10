import { PrismaClient, UserRole, InvoiceStatus, DocumentStatus } from '@prisma/client';
import { SOVEREIGN_GENESIS_DATA } from './dummy-data.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Sovereign Genesis Seed');

  const SCHOOL_ID = 'sch_123';

  await prisma.$transaction(async (tx) => {
    // ─────────────────────────────────────────────
    // 1. CLEAN SLATE (ORDER MATTERS)
    // ─────────────────────────────────────────────
    console.log('🧹 Clearing existing data...');

    // Delete in reverse dependency order
    await tx.counseling.deleteMany();
    await tx.medicalLog.deleteMany();
    await tx.attendance.deleteMany();
    await tx.invoice.deleteMany();
    await tx.identityDocument.deleteMany();
    await tx.parentStudent.deleteMany();
    await tx.student.deleteMany();
    await tx.user.deleteMany();
    await tx.bus.deleteMany();
    await tx.book.deleteMany();
    await tx.school.deleteMany();

    // ─────────────────────────────────────────────
    // 2. SCHOOL
    // ─────────────────────────────────────────────
    console.log('🏫 Seeding School');

    await tx.school.create({
      data: {
        id: SCHOOL_ID,
        name: 'Sovereign High'
      }
    });

    // ─────────────────────────────────────────────
    // 3. PARENTS (USERS)
    // ─────────────────────────────────────────────
    console.log('👨‍👩‍👧‍👦 Seeding Parents');

    for (const parent of SOVEREIGN_GENESIS_DATA.parents) {
      await tx.user.create({
        data: {
          id: parent.id,
          name: parent.name,
          email: parent.email,
          phone: parent.primary_phone,
          role: UserRole.PARENT, // Using enum
          school_id: SCHOOL_ID,
          password_hash: 'seed_placeholder_hash' // Changed to required placeholder
        }
      });
    }

    // ─────────────────────────────────────────────
    // 4. STAFF (USERS)
    // ─────────────────────────────────────────────
    console.log('👨‍🏫 Seeding Staff');

    for (const staff of SOVEREIGN_GENESIS_DATA.staff) {
      await tx.user.create({
        data: {
          id: staff.id,
          name: staff.name,
          email: staff.email,
          phone: staff.phone ?? null,
          role: staff.role as UserRole, // Already enum from dummy-data
          department: staff.department,
          school_id: SCHOOL_ID,
          password_hash: 'seed_placeholder_hash' // Changed to required placeholder
        }
      });
    }

    // ─────────────────────────────────────────────
    // 5. STUDENTS
    // ─────────────────────────────────────────────
    console.log('🎓 Seeding Students');

    for (const student of SOVEREIGN_GENESIS_DATA.students) {
      await tx.student.create({
        data: {
          id: student.id,
          admission_no: student.admission_no,
          name: student.name,
          email: student.email ?? null,
          class: student.class,
          roll: student.roll,
          school_id: SCHOOL_ID
        }
      });
    }

    // --- Create Maps for resolving IDs ---
    const parentRefToIdMap = new Map<string, string>();
    SOVEREIGN_GENESIS_DATA.parents.forEach(p => parentRefToIdMap.set(p.parent_ref, p.id));

    const studentAdmissionNoToIdMap = new Map<string, string>();
    SOVEREIGN_GENESIS_DATA.students.forEach(s => studentAdmissionNoToIdMap.set(s.admission_no, s.id));

    const userRefToIdMap = new Map<string, string>(); // for STAFF and PARENT owner_type for documents
    SOVEREIGN_GENESIS_DATA.parents.forEach(p => userRefToIdMap.set(p.parent_ref, p.id));
    SOVEREIGN_GENESIS_DATA.staff.forEach(s => userRefToIdMap.set(s.staff_no, s.id));


    // ─────────────────────────────────────────────
    // 6. PARENT ↔ STUDENT RELATION (JOIN TABLE)
    // ─────────────────────────────────────────────
    console.log('🔗 Linking Parents & Students');

    for (const link of SOVEREIGN_GENESIS_DATA.parentStudent) {
      const parentId = parentRefToIdMap.get(link.parent_ref);
      const studentId = studentAdmissionNoToIdMap.get(link.admission_no);

      if (!parentId || !studentId) {
        console.warn(`Skipping ParentStudent link due to missing ID: Parent Ref ${link.parent_ref}, Admission No ${link.admission_no}`);
        continue;
      }

      await tx.parentStudent.create({
        data: {
          parent_id: parentId,
          student_id: studentId,
          school_id: SCHOOL_ID,
          relation: link.relation,
          is_primary: link.is_primary,
        }
      });
    }

    // ─────────────────────────────────────────────
    // 7. IDENTITY DOCUMENTS
    // ─────────────────────────────────────────────
    console.log('📄 Seeding Identity Documents');

    for (const doc of SOVEREIGN_GENESIS_DATA.documents) {
      let owner_user_id: string | undefined;
      let owner_student_id: string | undefined;

      if (doc.owner_type === 'PARENT' || doc.owner_type === 'STAFF') {
        owner_user_id = userRefToIdMap.get(doc.owner_key);
      } else if (doc.owner_type === 'STUDENT') {
        owner_student_id = studentAdmissionNoToIdMap.get(doc.owner_key);
      }

      if (!owner_user_id && !owner_student_id) {
          console.warn(`Skipping IdentityDocument due to unresolved owner_key: ${doc.owner_key} (Type: ${doc.owner_type})`);
          continue;
      }

      await tx.identityDocument.create({
        data: {
          doc_type: doc.doc_type,
          file_ref: doc.file_ref,
          masked_id: doc.id_last4 ?? null,
          verification_status: DocumentStatus.PENDING, // Using enum, default is PENDING
          school_id: SCHOOL_ID,
          owner_user_id: owner_user_id,
          owner_student_id: owner_student_id,
        }
      });
    }

    // ─────────────────────────────────────────────
    // 8. BUSES
    // ─────────────────────────────────────────────
    console.log('🚌 Seeding Buses');

    await tx.bus.createMany({
      data: SOVEREIGN_GENESIS_DATA.buses.map((b: any) => ({
        ...b,
        school_id: SCHOOL_ID
      }))
    });

    // ─────────────────────────────────────────────
    // 9. BOOKS
    // ─────────────────────────────────────────────
    console.log('📚 Seeding Books');

    await tx.book.createMany({
      data: SOVEREIGN_GENESIS_DATA.books.map((b: any) => ({
        ...b,
        school_id: SCHOOL_ID
      }))
    });

    // ─────────────────────────────────────────────
    // 10. INVOICES
    // ─────────────────────────────────────────────
    console.log('💰 Seeding Invoices');

    for (const inv of SOVEREIGN_GENESIS_DATA.invoices) {
      await tx.invoice.create({
        data: {
          id: inv.id,
          student_id: inv.student_id,
          base_amount: inv.base_amount,
          discount_amount: inv.discount_amount,
          description: inv.description,
          due_date: new Date(inv.due_date),
          status: InvoiceStatus[inv.status as keyof typeof InvoiceStatus], // Convert string to enum
          utr: inv.utr ?? null,
          school_id: SCHOOL_ID
        }
      });
    }

    // ─────────────────────────────────────────────
    // 11. MEDICAL LOGS
    // ─────────────────────────────────────────────
    console.log('🏥 Seeding Medical Logs');

    for (const log of SOVEREIGN_GENESIS_DATA.medicalLogs) {
      await tx.medicalLog.create({
        data: {
          id: log.id,
          student_id: log.student_id,
          time: new Date(log.time),
          issue: log.issue,
          action: log.action,
          school_id: SCHOOL_ID
        }
      });
    }

    // ─────────────────────────────────────────────
    // 12. COUNSELING
    // ─────────────────────────────────────────────
    console.log('🧠 Seeding Counseling Sessions');

    for (const c of SOVEREIGN_GENESIS_DATA.counseling) {
      await tx.counseling.create({
        data: {
          id: c.id,
          student_id: c.student_id,
          category: c.category,
          note: c.note,
          date: new Date(c.date),
          school_id: SCHOOL_ID
        }
      });
    }
  }); // End transaction

  console.log('✅ Sovereign Genesis Seed Complete');
}

// ─────────────────────────────────────────────

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });