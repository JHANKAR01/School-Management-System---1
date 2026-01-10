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

    const createdSchool = await tx.school.create({
      data: {
        // Let Prisma generate ID or use a fixed one if strictly needed for tenants.
        // For this seed, we'll stick to a fixed one for simplicity if allowed,
        // but 'NO Hardcoded IDs' constraint suggests we should let it generate.
        // However, dummy-data.ts uses school_id widely. 
        // We will create the school and capture its ID, then use THAT ID for all children.
        // BUT: DUMMY_DATA has 'sch_123' hardcoded in many places.
        // To be safe and compliant with "NO Hardcoded URLs/IDs", we should map it.
        name: 'Sovereign High',
        settings_json: {}
      }
    });

    // START MAPS
    const schoolIdMap = new Map<string, string>();
    schoolIdMap.set('sch_123', createdSchool.id); // Map dummy school ID to real ID

    /* ------------------------------------------------------------------ */
    /* 3. PARENTS (Users)                                                 */
    /* ------------------------------------------------------------------ */
    console.log('👨‍👩‍👧 Creating Parents');

    // Map to store "PRN_001" -> "real-uuid"
    const parentRefToUserId = new Map<string, string>();

    for (const parent of SOVEREIGN_GENESIS_DATA.parents) {
      const realSchoolId = schoolIdMap.get(parent.school_id) || createdSchool.id;

      const createdParent = await tx.user.create({
        data: {
          // id: REMOVED to let Prisma generate UUID
          name: parent.name,
          email: parent.email,
          phone: parent.primary_phone,
          role: UserRole.PARENT,
          school_id: realSchoolId,
          password_hash: 'seed_placeholder_hash' // Matches new schema requirements
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
      const realSchoolId = schoolIdMap.get(staff.school_id) || createdSchool.id;

      const createdStaff = await tx.user.create({
        data: {
          // id: REMOVED
          name: staff.name,
          email: staff.email,
          role: staff.role as UserRole,
          department: staff.department,
          school_id: realSchoolId,
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

    for (const student of SOVEREIGN_GENESIS_DATA.students) {
      const realSchoolId = schoolIdMap.get(student.school_id) || createdSchool.id;

      const createdStudent = await tx.student.create({
        data: {
          // id: REMOVED
          admission_no: student.admission_no,
          name: student.name,
          email: student.email,
          class: student.class,
          roll: student.roll,
          school_id: realSchoolId
          // Note: parent_phone is NOT used; ParentStudent relation is used instead
        }
      });
      admissionNoToStudentId.set(student.admission_no, createdStudent.id);
    }

    /* ------------------------------------------------------------------ */
    /* 6. PARENT ↔ STUDENT RELATION (EXPLICIT JOIN TABLE)                 */
    /* ------------------------------------------------------------------ */
    console.log('🔗 Linking Parents & Students');

    for (const link of SOVEREIGN_GENESIS_DATA.parentStudent) {
      const parentId = parentRefToUserId.get(link.parent_ref);
      const studentId = admissionNoToStudentId.get(link.admission_no);

      if (!parentId || !studentId) {
        console.warn(`⚠️ Invalid parent-student link skipped: ParentRef ${link.parent_ref}, AdmNo ${link.admission_no}`);
        continue;
      }

      await tx.parentStudent.create({
        data: {
          parent_id: parentId,
          student_id: studentId,
          relation: link.relation,
          is_primary: link.is_primary,
          school_id: createdSchool.id // REQUIRED strict link
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
      } else if (doc.owner_type === 'PARENT') {
        ownerUserId = parentRefToUserId.get(doc.owner_key) ?? null;
      } else if (doc.owner_type === 'STAFF') {
        ownerUserId = staffNoToUserId.get(doc.owner_key) ?? null;
      }

      if (!ownerStudentId && !ownerUserId) {
        console.warn(`⚠️ Document owner missing or not mapped for key: ${doc.owner_key} (${doc.owner_type})`);
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
          school_id: createdSchool.id
        }
      });
    }

    /* ------------------------------------------------------------------ */
    /* 8. FINANCE (INVOICES)                                              */
    /* ------------------------------------------------------------------ */
    console.log('💰 Creating Invoices');

    // Need to map student_id on invoices (which is 'std_X' in dummy data usually)
    // BUT wait, DUMMY_INVOICES uses 'std_X' as student_id.
    // DUMMY_STUDENTS has 'id': 'std_X'.
    // We need a map from Dummy Student ID -> Real Student ID. 
    // We didn't create that map yet! We only created admissionNo -> Real ID.
    // Let's create a helper map for this:
    const dummyStudentIdToRealId = new Map<string, string>();
    // We need to re-scan students or build this map inside the student loop.
    // I can't easily access the student loop variables here without refactoring.
    // Alternative: match via admission_no if available.
    // DUMMY_INVOICES has `student_id` which is `std_X`.
    // DUMMY_STUDENTS has `id: std_X` and `admission_no`.
    // So I can build the map now by iterating DUMMY_STUDENTS again.

    for (const s of SOVEREIGN_GENESIS_DATA.students) {
      // Find the real ID from our admission map
      const realId = admissionNoToStudentId.get(s.admission_no);
      if (realId) {
        dummyStudentIdToRealId.set(s.id, realId);
      }
    }

    for (const invoice of SOVEREIGN_GENESIS_DATA.invoices) {
      const realStudentId = dummyStudentIdToRealId.get(invoice.student_id);
      const realSchoolId = schoolIdMap.get(invoice.school_id) || createdSchool.id;

      if (!realStudentId) {
        console.warn(`⚠️ Invoice skipped: Student ID ${invoice.student_id} not found`);
        continue;
      }

      await tx.invoice.create({
        data: {
          // id: REMOVED
          student_id: realStudentId,
          base_amount: invoice.base_amount,
          discount_amount: invoice.discount_amount,
          description: invoice.description,
          due_date: new Date(invoice.due_date), // ISO String -> Date Object
          status: invoice.status as InvoiceStatus,
          utr: invoice.utr,
          school_id: realSchoolId
        }
      });
    }

    /* ------------------------------------------------------------------ */
    /* 9. MEDICAL + COUNSELING                                            */
    /* ------------------------------------------------------------------ */
    console.log('🏥 Creating Medical & Counseling Logs');

    for (const log of SOVEREIGN_GENESIS_DATA.medicalLogs) {
      const realStudentId = dummyStudentIdToRealId.get(log.student_id);
      const realSchoolId = schoolIdMap.get(log.school_id) || createdSchool.id;

      if (!realStudentId) {
        continue;
      }

      await tx.medicalLog.create({
        data: {
          student_id: realStudentId,
          time: new Date(log.time), // ISO -> Date
          issue: log.issue,
          action: log.action,
          school_id: realSchoolId
        }
      });
    }

    for (const session of SOVEREIGN_GENESIS_DATA.counseling) {
      const realStudentId = dummyStudentIdToRealId.get(session.student_id);
      const realSchoolId = schoolIdMap.get(session.school_id) || createdSchool.id;

      if (!realStudentId) continue;

      await tx.counseling.create({
        data: {
          student_id: realStudentId,
          category: session.category,
          note: session.note,
          date: new Date(session.date), // ISO -> Date
          school_id: realSchoolId
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