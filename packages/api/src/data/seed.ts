import { PrismaClient, UserRole, InvoiceStatus, AttendanceStatus, DocumentStatus } from '@prisma/client';
import { SOVEREIGN_GENESIS_DATA } from './dummy-data.ts';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Sovereign Genesis Seeding Started');

  await prisma.$transaction(async (tx) => {
    /* ------------------------------------------------------------------ */
    /* 1. CLEAN SLATE (ORDER MATTERS FOR FOREIGN KEYS)                    */
    /* ------------------------------------------------------------------ */
    console.log('🧹 Clearing database...');
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
    console.log('🏫 Creating Genesis School');
    const createdSchool = await tx.school.create({
      data: {
        name: 'Sovereign High',
        settings_json: {}
      }
    });

    /* ------------------------------------------------------------------ */
    /* 3. PARENTS (Users)                                                 */
    /* ------------------------------------------------------------------ */
    console.log('👨‍👩‍👧 Creating Parents');
    const parentRefToUserId = new Map<string, string>();

    for (const parent of SOVEREIGN_GENESIS_DATA.parents) {
      const createdParent = await tx.user.create({
        data: {
          name: parent.name,
          email: parent.email,
          phone: parent.primary_phone,
          role: UserRole.PARENT,
          school_id: createdSchool.id,
          password_hash: 'seed_placeholder_hash'
        }
      });
      parentRefToUserId.set(parent.parent_ref, createdParent.id);
    }

    /* ------------------------------------------------------------------ */
    /* 4. STAFF (Users)                                                   */
    /* ------------------------------------------------------------------ */
    console.log('👨‍🏫 Creating Staff');
    const staffNoToUserId = new Map<string, string>();

    for (const staff of SOVEREIGN_GENESIS_DATA.staff) {
      const createdStaff = await tx.user.create({
        data: {
          name: staff.name,
          email: staff.email,
          role: staff.role as UserRole,
          department: staff.department,
          school_id: createdSchool.id,
          password_hash: 'seed_placeholder_hash'
        }
      });
      staffNoToUserId.set(staff.staff_no, createdStaff.id);
    }

    /* ------------------------------------------------------------------ */
    /* 5. STUDENTS                                                        */
    /* ------------------------------------------------------------------ */
    console.log('🎓 Creating Students');
    const admissionNoToStudentId = new Map<string, string>();
    const dummyIdToRealStudentId = new Map<string, string>();

    for (const student of SOVEREIGN_GENESIS_DATA.students) {
      const createdStudent = await tx.student.create({
        data: {
          admission_no: student.admission_no,
          name: student.name,
          email: student.email,
          class: student.class,
          roll: student.roll,
          school_id: createdSchool.id
        }
      });
      admissionNoToStudentId.set(student.admission_no, createdStudent.id);
      dummyIdToRealStudentId.set(student.id, createdStudent.id);
    }

    /* ------------------------------------------------------------------ */
    /* 6. PARENT ↔ STUDENT RELATION (EXPLICIT JOIN TABLE)                 */
    /* ------------------------------------------------------------------ */
    console.log('🔗 Linking Parents & Students');
    for (const link of SOVEREIGN_GENESIS_DATA.parentStudent) {
      const parentId = parentRefToUserId.get(link.parent_ref);
      const studentId = admissionNoToStudentId.get(link.admission_no);

      if (parentId && studentId) {
        await tx.parentStudent.create({
          data: {
            parent_id: parentId,
            student_id: studentId,
            relation: link.relation,
            is_primary: link.is_primary,
            school_id: createdSchool.id
          }
        });
      }
    }

    /* ------------------------------------------------------------------ */
    /* 7. IDENTITY DOCUMENTS                                              */
    /* ------------------------------------------------------------------ */
    console.log('📄 Registering Identity Documents');
    for (const doc of SOVEREIGN_GENESIS_DATA.documents) {
      let ownerStudentId: string | null = null;
      let ownerUserId: string | null = null;

      if (doc.owner_type === 'STUDENT') {
        ownerStudentId = admissionNoToStudentId.get(doc.owner_key) ?? null;
      } else if (doc.owner_type === 'PARENT') {
        ownerUserId = parentRefToUserId.get(doc.owner_key) ?? null;
      } else if (doc.owner_type === 'STAFF') {
        ownerUserId = staffNoToUserId.get(doc.owner_key) ?? null;
      }

      if (ownerStudentId || ownerUserId) {
        await tx.identityDocument.create({
          data: {
            owner_student_id: ownerStudentId,
            owner_user_id: ownerUserId,
            doc_type: doc.doc_type,
            file_ref: doc.file_ref,
            masked_id: doc.id_last4 ?? null,
            verification_status: DocumentStatus.PENDING,
            school_id: createdSchool.id
          }
        });
      }
    }

    /* ------------------------------------------------------------------ */
    /* 8. FINANCE (INVOICES)                                              */
    /* ------------------------------------------------------------------ */
    console.log('💰 Creating Invoices');
    for (const invoice of SOVEREIGN_GENESIS_DATA.invoices) {
      const realStudentId = dummyIdToRealStudentId.get(invoice.student_id);
      if (realStudentId) {
        await tx.invoice.create({
          data: {
            student_id: realStudentId,
            base_amount: invoice.base_amount,
            discount_amount: invoice.discount_amount,
            description: invoice.description,
            due_date: new Date(invoice.due_date),
            status: invoice.status as InvoiceStatus,
            utr: invoice.utr,
            school_id: createdSchool.id
          }
        });
      }
    }

    /* ------------------------------------------------------------------ */
    /* 9. MEDICAL & COUNSELING LOGS                                       */
    /* ------------------------------------------------------------------ */
    console.log('🏥 Creating Logs');
    for (const log of SOVEREIGN_GENESIS_DATA.medicalLogs) {
      const realStudentId = dummyIdToRealStudentId.get(log.student_id);
      if (realStudentId) {
        await tx.medicalLog.create({
          data: {
            student_id: realStudentId,
            time: new Date(log.time),
            issue: log.issue,
            action: log.action,
            school_id: createdSchool.id
          }
        });
      }
    }
    
    console.log('✅ Seeding Complete');
  });
}

main()
  .catch((e) => {
    console.error('❌ Seed failed', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });