import { PrismaClient, UserRole, InvoiceStatus, AttendanceStatus, DocumentStatus } from '@prisma/client';
import { SOVEREIGN_GENESIS_DATA } from './dummy-data.ts';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Sovereign Genesis Seeding Started');

  // We use a transaction to ensure all or nothing
  await prisma.$transaction(async (tx) => {

    /* ------------------------------------------------------------------ */
    /* 1. CLEAN SLATE (ORDER MATTERS)                                     */
    /* ------------------------------------------------------------------ */
    console.log('🧹 Clearing database...');

    // Delete in reverse dependency order
    await tx.identityDocument.deleteMany();
    await tx.parentStudent.deleteMany();
    await tx.medicalLog.deleteMany();
    await tx.counseling.deleteMany();
    await tx.invoice.deleteMany();
    await tx.attendance.deleteMany();
    await tx.student.deleteMany();
    await tx.user.deleteMany();
    await tx.school.deleteMany();

    /* ------------------------------------------------------------------ */
    /* 2. SCHOOL                                                          */
    /* ------------------------------------------------------------------ */
    console.log('🏫 Creating School');

    await tx.school.create({
      data: {
        id: 'sch_123',
        name: 'Sovereign High'
      }
    });

    /* ------------------------------------------------------------------ */
    /* 3. PARENTS (Users)                                                 */
    /* ------------------------------------------------------------------ */
    console.log('👨‍👩‍👧 Creating Parents');

    // Map to store "PRN_001" -> "prn_1" for later linking
    const parentRefToUserId = new Map<string, string>();

    for (const parent of SOVEREIGN_GENESIS_DATA.parents) {
      await tx.user.create({
        data: {
          id: parent.id,
          name: parent.name,
          email: parent.email,
          phone: parent.primary_phone,
          role: UserRole.PARENT,
          school_id: parent.school_id,
          password_hash: 'seed_placeholder_hash' // Matches new schema
        }
      });
      parentRefToUserId.set(parent.parent_ref, parent.id);
    }

    /* ------------------------------------------------------------------ */
    /* 4. STAFF (Users)                                                   */
    /* ------------------------------------------------------------------ */
    console.log('👨‍🏫 Creating Staff');

    for (const staff of SOVEREIGN_GENESIS_DATA.staff) {
      await tx.user.create({
        data: {
          id: staff.id,
          name: staff.name,
          email: staff.email,
          role: staff.role as UserRole,
          department: staff.department,
          school_id: staff.school_id,
          password_hash: 'seed_placeholder_hash'
        }
      });
    }

    /* ------------------------------------------------------------------ */
    /* 5. STUDENTS                                                        */
    /* ------------------------------------------------------------------ */
    console.log('🎓 Creating Students');

    const admissionNoToStudentId = new Map<string, string>();

    for (const student of SOVEREIGN_GENESIS_DATA.students) {
      await tx.student.create({
        data: {
          id: student.id,
          admission_no: student.admission_no,
          name: student.name,
          email: student.email,
          class: student.class,
          roll: student.roll,
          school_id: student.school_id
          // Note: parent_phone is REMOVED because we use relations now
        }
      });
      admissionNoToStudentId.set(student.admission_no, student.id);
    }

    /* ------------------------------------------------------------------ */
    /* 6. PARENT ↔ STUDENT RELATION (EXPLICIT JOIN TABLE)                 */
    /* ------------------------------------------------------------------ */
    console.log('🔗 Linking Parents & Students');

    for (const link of SOVEREIGN_GENESIS_DATA.parentStudent) {
      const parentId = parentRefToUserId.get(link.parent_ref);
      const studentId = admissionNoToStudentId.get(link.admission_no);

      if (!parentId || !studentId) {
        console.warn('⚠️ Invalid parent-student link skipped', link);
        continue;
      }

      await tx.parentStudent.create({
        data: {
          parent_id: parentId,
          student_id: studentId,
          relation: link.relation,
          is_primary: link.is_primary,
          school_id: 'sch_123' // FIXED: Added required school_id
        }
      });
    }

    /* ------------------------------------------------------------------ */
    /* 7. DOCUMENT METADATA                                               */
    /* ------------------------------------------------------------------ */
    console.log('📄 Registering Identity Documents');

    for (const doc of SOVEREIGN_GENESIS_DATA.documents) {
      let ownerStudentId: string | null = null;
      let ownerUserId: string | null = null;

      if (doc.owner_type === 'STUDENT') {
        ownerStudentId = admissionNoToStudentId.get(doc.owner_key) ?? null;
      } else if (doc.owner_type === 'PARENT' || doc.owner_type === 'STAFF') {
        // Parents key is parent_ref (PRN_001), Staff key is staff_no (STF_001) or id
        // For simplicity in this seed, we assume parents use parent_ref map
        ownerUserId = parentRefToUserId.get(doc.owner_key) ?? null;
        
        // If not found in parent map, check if it's a direct staff ID match
        if (!ownerUserId) {
           // Basic check if it matches a staff ID directly
           const staffExists = SOVEREIGN_GENESIS_DATA.staff.find(s => s.staff_no === doc.owner_key);
           if (staffExists) ownerUserId = staffExists.id;
        }
      }

      if (!ownerStudentId && !ownerUserId) {
        // Warning suppressed for brevity, un-comment if debugging needed
        // console.warn('⚠️ Document owner missing or not mapped', doc.owner_key);
        continue;
      }

      await tx.identityDocument.create({
        data: {
          owner_student_id: ownerStudentId,
          owner_user_id: ownerUserId,
          doc_type: doc.doc_type,
          file_ref: doc.file_ref,
          masked_id: doc.id_last4 ?? null,
          verification_status: DocumentStatus.PENDING,
          school_id: 'sch_123'
        }
      });
    }

    /* ------------------------------------------------------------------ */
    /* 8. FINANCE (INVOICES)                                              */
    /* ------------------------------------------------------------------ */
    console.log('💰 Creating Invoices');

    for (const invoice of SOVEREIGN_GENESIS_DATA.invoices) {
      await tx.invoice.create({
        data: {
          id: invoice.id,
          student_id: invoice.student_id,
          base_amount: invoice.base_amount,
          discount_amount: invoice.discount_amount,
          description: invoice.description,
          due_date: new Date(invoice.due_date),
          status: invoice.status as InvoiceStatus,
          utr: invoice.utr,
          school_id: invoice.school_id
        }
      });
    }

    /* ------------------------------------------------------------------ */
    /* 9. MEDICAL + COUNSELING                                            */
    /* ------------------------------------------------------------------ */
    console.log('🏥 Creating Medical & Counseling Logs');

    for (const log of SOVEREIGN_GENESIS_DATA.medicalLogs) {
      await tx.medicalLog.create({
        data: {
          id: log.id,
          student_id: log.student_id,
          time: new Date(log.time),
          issue: log.issue,
          action: log.action,
          school_id: log.school_id
        }
      });
    }

    for (const session of SOVEREIGN_GENESIS_DATA.counseling) {
      await tx.counseling.create({
        data: {
          id: session.id,
          student_id: session.student_id,
          category: session.category,
          note: session.note,
          date: new Date(session.date),
          school_id: session.school_id
        }
      });
    }

    console.log('✅ Transaction Complete');
  });

  console.log('🎉 Sovereign Genesis Seeded Successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });