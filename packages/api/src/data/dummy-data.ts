import { UserRole, Book, Bus, HostelRoom, Invoice, BankTransaction, StudentResult } from '../../../../types.ts';

// --- GENESIS CONSTANTS ---
const SCHOOL_ID_1 = 'sch_123'; // Sovereign High
const SCHOOL_ID_2 = 'sch_456'; // DAV Public
const TIMESTAMP_NOW = new Date().toISOString();

// ---------------------------------------------------------------------------
// NOTE: This file is a DEV/SEED fixture. DO NOT store real PII here.
// file_ref paths correspond to ZIP structure: documents/students/STD_{ADMISSION_NO}/...
// ---------------------------------------------------------------------------

// --- 1. PARENTS (one record per person; parent_ref used as folder key in ZIP) ---
export const DUMMY_PARENTS = [
  { id: 'prn_1', parent_ref: 'PRN_001', name: 'Rajesh Kumar', primary_phone: '+919876543210', email: 'rajesh.k@demo.com', school_id: SCHOOL_ID_1, documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/parents/PRN_001/aadhaar.pdf', id_last4: '3210' }, { doc_type: 'DRIVING_LICENSE', file_ref: 'documents/parents/PRN_001/dl.jpg', id_last4: '4321' }] },
  { id: 'prn_2', parent_ref: 'PRN_002', name: 'Sita Kumar', primary_phone: '+919876543211', email: 'sita.k@demo.com', school_id: SCHOOL_ID_1, documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/parents/PRN_002/aadhaar.pdf', id_last4: '3211' }] },
  { id: 'prn_3', parent_ref: 'PRN_003', name: 'Vikram Singh', primary_phone: '+919876543212', email: 'vikram.s@demo.com', school_id: SCHOOL_ID_1, documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/parents/PRN_003/aadhaar.pdf', id_last4: '3212' }] },
  { id: 'prn_4', parent_ref: 'PRN_004', name: 'Meera Joshi', primary_phone: '+919876543213', email: 'meera.j@demo.com', school_id: SCHOOL_ID_1, documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/parents/PRN_004/aadhaar.pdf', id_last4: '3213' }] },
  { id: 'prn_5', parent_ref: 'PRN_005', name: 'Anil Patel', primary_phone: '+919876543214', email: 'anil.p@demo.com', school_id: SCHOOL_ID_1, documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/parents/PRN_005/aadhaar.pdf', id_last4: '3214' }] },
  { id: 'prn_6', parent_ref: 'PRN_006', name: 'Sunita Rao', primary_phone: '+919876543215', email: 'sunita.r@demo.com', school_id: SCHOOL_ID_1, documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/parents/PRN_006/aadhaar.pdf', id_last4: '3215' }] },
  { id: 'prn_7', parent_ref: 'PRN_007', name: 'Ramesh Verma', primary_phone: '+919876543216', email: 'ramesh.v@demo.com', school_id: SCHOOL_ID_1, documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/parents/PRN_007/aadhaar.pdf', id_last4: '3216' }] },
  { id: 'prn_8', parent_ref: 'PRN_008', name: 'Priya Nair', primary_phone: '+919876543217', email: 'priya.n@demo.com', school_id: SCHOOL_ID_1, documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/parents/PRN_008/aadhaar.pdf', id_last4: '3217' }] },
  { id: 'prn_9', parent_ref: 'PRN_009', name: 'Rohit Shah', primary_phone: '+919876543218', email: 'rohit.s@demo.com', school_id: SCHOOL_ID_1, documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/parents/PRN_009/aadhaar.pdf', id_last4: '3218' }] },
  { id: 'prn_10', parent_ref: 'PRN_010', name: 'Anita Desai', primary_phone: '+919876543219', email: 'anita.d@demo.com', school_id: SCHOOL_ID_1, documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/parents/PRN_010/aadhaar.pdf', id_last4: '3219' }] },
  { id: 'prn_11', parent_ref: 'PRN_011', name: 'Kamal Gupta', primary_phone: '+919876543220', email: 'kamal.g@demo.com', school_id: SCHOOL_ID_1, documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/parents/PRN_011/aadhaar.pdf', id_last4: '3220' }] },
  { id: 'prn_12', parent_ref: 'PRN_012', name: 'Nidhi Mehra', primary_phone: '+919876543221', email: 'nidhi.m@demo.com', school_id: SCHOOL_ID_1, documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/parents/PRN_012/aadhaar.pdf', id_last4: '3221' }] },
  { id: 'prn_13', parent_ref: 'PRN_013', name: 'Anoop Menon', primary_phone: '+919876543222', email: 'anoop.m@demo.com', school_id: SCHOOL_ID_1, documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/parents/PRN_013/aadhaar.pdf', id_last4: '3222' }] },
  { id: 'prn_14', parent_ref: 'PRN_014', name: 'Geeta Sharma', primary_phone: '+919876543223', email: 'geeta.s@demo.com', school_id: SCHOOL_ID_1, documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/parents/PRN_014/aadhaar.pdf', id_last4: '3223' }] },
  { id: 'prn_15', parent_ref: 'PRN_015', name: 'Vikas Reddy', primary_phone: '+919876543224', email: 'vikas.r@demo.com', school_id: SCHOOL_ID_1, documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/parents/PRN_015/aadhaar.pdf', id_last4: '3224' }] },
  { id: 'prn_16', parent_ref: 'PRN_016', name: 'Shilpa Iyer', primary_phone: '+919876543225', email: 'shilpa.i@demo.com', school_id: SCHOOL_ID_1, documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/parents/PRN_016/aadhaar.pdf', id_last4: '3225' }] },
  { id: 'prn_17', parent_ref: 'PRN_017', name: 'Manish Kulkarni', primary_phone: '+919876543226', email: 'manish.k@demo.com', school_id: SCHOOL_ID_1, documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/parents/PRN_017/aadhaar.pdf', id_last4: '3226' }] },
  { id: 'prn_18', parent_ref: 'PRN_018', name: 'Sonal Kapoor', primary_phone: '+919876543227', email: 'sonal.k@demo.com', school_id: SCHOOL_ID_1, documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/parents/PRN_018/aadhaar.pdf', id_last4: '3227' }] },
  { id: 'prn_19', parent_ref: 'PRN_019', name: 'Deepak Yadav', primary_phone: '+919876543228', email: 'deepak.y@demo.com', school_id: SCHOOL_ID_1, documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/parents/PRN_019/aadhaar.pdf', id_last4: '3228' }] },
  { id: 'prn_20', parent_ref: 'PRN_020', name: 'Rekha Singh', primary_phone: '+919876543229', email: 'rekha.s@demo.com', school_id: SCHOOL_ID_1, documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/parents/PRN_020/aadhaar.pdf', id_last4: '3229' }] }
];

// --- 2. PARENT-STUDENT MAPPING (explicit many-to-many) ---
export const DUMMY_PARENT_STUDENT = [
  // PRN_001 -> multiple children (siblings)
  { parent_ref: 'PRN_001', admission_no: '2026-0001', relation: 'FATHER', is_primary: true },
  { parent_ref: 'PRN_001', admission_no: '2026-0002', relation: 'FATHER', is_primary: true },

  // Single child relationships
  { parent_ref: 'PRN_002', admission_no: '2026-0003', relation: 'MOTHER', is_primary: true },
  { parent_ref: 'PRN_003', admission_no: '2026-0004', relation: 'FATHER', is_primary: true },
  { parent_ref: 'PRN_004', admission_no: '2026-0005', relation: 'MOTHER', is_primary: true },
  { parent_ref: 'PRN_005', admission_no: '2026-0006', relation: 'FATHER', is_primary: true },
  { parent_ref: 'PRN_006', admission_no: '2026-0007', relation: 'MOTHER', is_primary: true },
  { parent_ref: 'PRN_007', admission_no: '2026-0008', relation: 'FATHER', is_primary: true },
  { parent_ref: 'PRN_008', admission_no: '2026-0009', relation: 'MOTHER', is_primary: true },
  { parent_ref: 'PRN_009', admission_no: '2026-0010', relation: 'FATHER', is_primary: true },
  { parent_ref: 'PRN_010', admission_no: '2026-0011', relation: 'MOTHER', is_primary: true },
  { parent_ref: 'PRN_011', admission_no: '2026-0012', relation: 'FATHER', is_primary: true },
  { parent_ref: 'PRN_012', admission_no: '2026-0013', relation: 'MOTHER', is_primary: true },
  { parent_ref: 'PRN_013', admission_no: '2026-0014', relation: 'FATHER', is_primary: true },
  { parent_ref: 'PRN_014', admission_no: '2026-0015', relation: 'MOTHER', is_primary: true },
  { parent_ref: 'PRN_015', admission_no: '2026-0016', relation: 'FATHER', is_primary: true },
  { parent_ref: 'PRN_016', admission_no: '2026-0017', relation: 'MOTHER', is_primary: true },
  { parent_ref: 'PRN_017', admission_no: '2026-0018', relation: 'FATHER', is_primary: true },
  { parent_ref: 'PRN_018', admission_no: '2026-0019', relation: 'MOTHER', is_primary: true },
  { parent_ref: 'PRN_019', admission_no: '2026-0020', relation: 'FATHER', is_primary: true },
  { parent_ref: 'PRN_020', admission_no: '2026-0021', relation: 'MOTHER', is_primary: true },

  // Add a few more sibling links
  { parent_ref: 'PRN_011', admission_no: '2026-0022', relation: 'FATHER', is_primary: false },
  { parent_ref: 'PRN_012', admission_no: '2026-0023', relation: 'MOTHER', is_primary: false },
  { parent_ref: 'PRN_013', admission_no: '2026-0024', relation: 'FATHER', is_primary: false },
  { parent_ref: 'PRN_014', admission_no: '2026-0025', relation: 'MOTHER', is_primary: false }
];

// --- 3. STUDENTS (30 example students) ---
export const DUMMY_STUDENTS = [
  { id: 'std_1', admission_no: '2026-0001', name: 'Aarav Kumar', email: 'aarav.k@sovereign.edu', class: '10-A', roll: 1, parent_refs: ['PRN_001'], school_id: SCHOOL_ID_1,
    documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0001/aadhaar.pdf', id_last4: '1111' }, { doc_type: 'PHOTO', file_ref: 'documents/students/2026-0001/photo.jpg' }] },
  { id: 'std_2', admission_no: '2026-0002', name: 'Diya Sharma', email: 'diya.s@sovereign.edu', class: '10-A', roll: 2, parent_refs: ['PRN_001'], school_id: SCHOOL_ID_1,
    documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0002/aadhaar.pdf', id_last4: '2222' }] },
  { id: 'std_3', admission_no: '2026-0003', name: 'Ishaan Patel', email: 'ishaan.p@sovereign.edu', class: '10-A', roll: 3, parent_refs: ['PRN_002'], school_id: SCHOOL_ID_1,
    documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0003/aadhaar.pdf', id_last4: '3333' }] },
  { id: 'std_4', admission_no: '2026-0004', name: 'Ananya Gupta', email: 'ananya.g@sovereign.edu', class: '10-B', roll: 1, parent_refs: ['PRN_003'], school_id: SCHOOL_ID_1,
    documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0004/aadhaar.pdf', id_last4: '4444' }] },
  { id: 'std_5', admission_no: '2026-0005', name: 'Vihaan Singh', email: 'vihaan.s@sovereign.edu', class: '10-B', roll: 2, parent_refs: ['PRN_004'], school_id: SCHOOL_ID_1,
    documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0005/aadhaar.pdf', id_last4: '5555' }] },
  { id: 'std_6', admission_no: '2026-0006', name: 'Aditi Rao', email: 'aditi.r@sovereign.edu', class: '9-A', roll: 1, parent_refs: ['PRN_005'], school_id: SCHOOL_ID_1,
    documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0006/aadhaar.pdf', id_last4: '6666' }] },
  { id: 'std_7', admission_no: '2026-0007', name: 'Kabir Das', email: 'kabir.d@sovereign.edu', class: '9-A', roll: 2, parent_refs: ['PRN_006'], school_id: SCHOOL_ID_1,
    documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0007/aadhaar.pdf', id_last4: '7777' }] },
  { id: 'std_8', admission_no: '2026-0008', name: 'Meera Iyer', email: 'meera.i@sovereign.edu', class: '9-B', roll: 1, parent_refs: ['PRN_007'], school_id: SCHOOL_ID_1,
    documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0008/aadhaar.pdf', id_last4: '8888' }] },
  { id: 'std_9', admission_no: '2026-0009', name: 'Rohan Joshi', email: 'rohan.j@sovereign.edu', class: '8-A', roll: 1, parent_refs: ['PRN_008'], school_id: SCHOOL_ID_1,
    documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0009/aadhaar.pdf', id_last4: '9999' }] },
  { id: 'std_10', admission_no: '2026-0010', name: 'Sanya Malhotra', email: 'sanya.m@sovereign.edu', class: '8-A', roll: 2, parent_refs: ['PRN_009'], school_id: SCHOOL_ID_1,
    documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0010/aadhaar.pdf', id_last4: '1010' }] },

  { id: 'std_11', admission_no: '2026-0011', name: 'Arjun Reddy', email: 'arjun.r@sovereign.edu', class: '12-Sci', roll: 1, parent_refs: ['PRN_010'], school_id: SCHOOL_ID_1,
    documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0011/aadhaar.pdf', id_last4: '1111' }] },
  { id: 'std_12', admission_no: '2026-0012', name: 'Priya Menon', email: 'priya.m@sovereign.edu', class: '12-Sci', roll: 2, parent_refs: ['PRN_011'], school_id: SCHOOL_ID_1,
    documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0012/aadhaar.pdf', id_last4: '1212' }] },
  { id: 'std_13', admission_no: '2026-0013', name: 'Karan Johar', email: 'karan.j@sovereign.edu', class: '12-Com', roll: 1, parent_refs: ['PRN_012'], school_id: SCHOOL_ID_1,
    documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0013/aadhaar.pdf', id_last4: '1313' }] },
  { id: 'std_14', admission_no: '2026-0014', name: 'Simran Kaur', email: 'simran.k@sovereign.edu', class: '12-Com', roll: 2, parent_refs: ['PRN_013'], school_id: SCHOOL_ID_1,
    documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0014/aadhaar.pdf', id_last4: '1414' }] },
  { id: 'std_15', admission_no: '2026-0015', name: 'Rahul Dravid', email: 'rahul.d@sovereign.edu', class: '11-Sci', roll: 1, parent_refs: ['PRN_014'], school_id: SCHOOL_ID_1,
    documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0015/aadhaar.pdf', id_last4: '1515' }] },
  { id: 'std_16', admission_no: '2026-0016', name: 'Anjali Tendulkar', email: 'anjali.t@sovereign.edu', class: '11-Sci', roll: 2, parent_refs: ['PRN_015'], school_id: SCHOOL_ID_1,
    documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0016/aadhaar.pdf', id_last4: '1616' }] },
  { id: 'std_17', admission_no: '2026-0017', name: 'Vikram Batra', email: 'vikram.b@sovereign.edu', class: '11-Arts', roll: 1, parent_refs: ['PRN_016'], school_id: SCHOOL_ID_1,
    documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0017/aadhaar.pdf', id_last4: '1717' }] },
  { id: 'std_18', admission_no: '2026-0018', name: 'Neha Dhupia', email: 'neha.d@sovereign.edu', class: '11-Arts', roll: 2, parent_refs: ['PRN_017'], school_id: SCHOOL_ID_1,
    documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0018/aadhaar.pdf', id_last4: '1818' }] },
  { id: 'std_19', admission_no: '2026-0019', name: 'Siddharth Malhotra', email: 'siddharth.m@sovereign.edu', class: '6-A', roll: 1, parent_refs: ['PRN_018'], school_id: SCHOOL_ID_1,
    documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0019/aadhaar.pdf', id_last4: '1919' }] },
  { id: 'std_20', admission_no: '2026-0020', name: 'Kiara Advani', email: 'kiara.a@sovereign.edu', class: '6-A', roll: 2, parent_refs: ['PRN_019'], school_id: SCHOOL_ID_1,
    documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0020/aadhaar.pdf', id_last4: '2020' }] },

  { id: 'std_21', admission_no: '2026-0021', name: 'Arnav Deshmukh', email: 'arnav.d@sovereign.edu', class: '7-B', roll: 3, parent_refs: ['PRN_020'], school_id: SCHOOL_ID_1,
    documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0021/aadhaar.pdf', id_last4: '2121' }] },
  { id: 'std_22', admission_no: '2026-0022', name: 'Nayan Gupta', email: 'nayan.g@sovereign.edu', class: '7-B', roll: 4, parent_refs: ['PRN_011'], school_id: SCHOOL_ID_1,
    documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0022/aadhaar.pdf', id_last4: '2222' }] },
  { id: 'std_23', admission_no: '2026-0023', name: 'Mehul Sharma', email: 'mehul.s@sovereign.edu', class: '8-C', roll: 5, parent_refs: ['PRN_012'], school_id: SCHOOL_ID_1,
    documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0023/aadhaar.pdf', id_last4: '2323' }] },
  { id: 'std_24', admission_no: '2026-0024', name: 'Ritu Verma', email: 'ritu.v@sovereign.edu', class: '8-C', roll: 6, parent_refs: ['PRN_013'], school_id: SCHOOL_ID_1,
    documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0024/aadhaar.pdf', id_last4: '2424' }] },
  { id: 'std_25', admission_no: '2026-0025', name: 'Kunal Chopra', email: 'kunal.c@sovereign.edu', class: '9-C', roll: 7, parent_refs: ['PRN_014'], school_id: SCHOOL_ID_1,
    documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0025/aadhaar.pdf', id_last4: '2525' }] },
  { id: 'std_26', admission_no: '2026-0026', name: 'Anushka Sen', email: 'anushka.s@sovereign.edu', class: '9-C', roll: 8, parent_refs: ['PRN_015'], school_id: SCHOOL_ID_1,
    documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0026/aadhaar.pdf', id_last4: '2626' }] },
  { id: 'std_27', admission_no: '2026-0027', name: 'Tahir Khan', email: 'tahir.k@sovereign.edu', class: '10-C', roll: 9, parent_refs: ['PRN_016'], school_id: SCHOOL_ID_1,
    documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0027/aadhaar.pdf', id_last4: '2727' }] },
  { id: 'std_28', admission_no: '2026-0028', name: 'Rhea Kapoor', email: 'rhea.k@sovereign.edu', class: '10-C', roll: 10, parent_refs: ['PRN_017'], school_id: SCHOOL_ID_1,
    documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0028/aadhaar.pdf', id_last4: '2828' }] },
  { id: 'std_29', admission_no: '2026-0029', name: 'Dev Patil', email: 'dev.p@sovereign.edu', class: '11-Com', roll: 11, parent_refs: ['PRN_018'], school_id: SCHOOL_ID_1,
    documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0029/aadhaar.pdf', id_last4: '2929' }] },
  { id: 'std_30', admission_no: '2026-0030', name: 'Isha Bhat', email: 'isha.b@sovereign.edu', class: '11-Com', roll: 12, parent_refs: ['PRN_019'], school_id: SCHOOL_ID_1,
    documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0030/aadhaar.pdf', id_last4: '3030' }] }
];

// --- 4. STAFF (20 staff with staff_no and docs) ---
export const DUMMY_STAFF = [
  { id: 'stf_1', staff_no: 'STF_001', name: 'Principal User', email: 'principal@sovereign.edu', role: UserRole.PRINCIPAL, department: 'Administration', school_id: SCHOOL_ID_1, documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/staff/STF_001/aadhaar.pdf', id_last4: '4001' }] },
  { id: 'stf_2', staff_no: 'STF_002', name: 'VP User', email: 'vp@sovereign.edu', role: UserRole.VICE_PRINCIPAL, department: 'Academics', school_id: SCHOOL_ID_1, documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/staff/STF_002/aadhaar.pdf', id_last4: '4002' }] },
  { id: 'stf_3', staff_no: 'STF_003', name: 'HOD Physics', email: 'hod.phy@sovereign.edu', role: UserRole.HOD, department: 'Physics', school_id: SCHOOL_ID_1, documents: [{ doc_type: 'AADHAAR', file_ref: 'documents/staff/STF_003/aadhaar.pdf', id_last4: '4003' }] },
  { id: 'stf_4', staff_no: 'STF_004', name: 'Physics Teacher', email: 'teacher.phy1@sovereign.edu', role: UserRole.TEACHER, department: 'Physics', school_id: SCHOOL_ID_1, documents: [] },
  { id: 'stf_5', staff_no: 'STF_005', name: 'Maths Teacher', email: 'teacher.math@sovereign.edu', role: UserRole.TEACHER, department: 'Mathematics', school_id: SCHOOL_ID_1, documents: [] },
  { id: 'stf_6', staff_no: 'STF_006', name: 'Hindi Teacher', email: 'teacher.hindi@sovereign.edu', role: UserRole.TEACHER, department: 'Hindi', school_id: SCHOOL_ID_1, documents: [] },
  { id: 'stf_7', staff_no: 'STF_007', name: 'Music Teacher', email: 'teacher.music@sovereign.edu', role: UserRole.TEACHER, department: 'Music', school_id: SCHOOL_ID_1, documents: [] },
  { id: 'stf_8', staff_no: 'STF_008', name: 'PE Teacher', email: 'teacher.pe@sovereign.edu', role: UserRole.TEACHER, department: 'Physical Education', school_id: SCHOOL_ID_1, documents: [] },
  { id: 'stf_9', staff_no: 'STF_009', name: 'Finance Mgr', email: 'finance@sovereign.edu', role: UserRole.FINANCE_MANAGER, department: 'Accounts', school_id: SCHOOL_ID_1, documents: [{ doc_type: 'PAN', file_ref: 'documents/staff/STF_009/pan.pdf', id_last4: 'F999' }] },
  { id: 'stf_10', staff_no: 'STF_010', name: 'School Nurse', email: 'nurse@sovereign.edu', role: UserRole.NURSE, department: 'Infirmary', school_id: SCHOOL_ID_1, documents: [] },
  { id: 'stf_11', staff_no: 'STF_011', name: 'Counselor', email: 'counselor@sovereign.edu', role: UserRole.COUNSELOR, department: 'Wellness', school_id: SCHOOL_ID_1, documents: [] },
  { id: 'stf_12', staff_no: 'STF_012', name: 'Security Head', email: 'security@sovereign.edu', role: UserRole.SECURITY_HEAD, department: 'Security', school_id: SCHOOL_ID_1, documents: [] },
  { id: 'stf_13', staff_no: 'STF_013', name: 'Librarian', email: 'librarian@sovereign.edu', role: UserRole.LIBRARIAN, department: 'Library', school_id: SCHOOL_ID_1, documents: [] },
  { id: 'stf_14', staff_no: 'STF_014', name: 'Warden', email: 'warden@sovereign.edu', role: UserRole.WARDEN, department: 'Hostel', school_id: SCHOOL_ID_1, documents: [] },
  { id: 'stf_15', staff_no: 'STF_015', name: 'IT Admin', email: 'it.admin@sovereign.edu', role: UserRole.IT_ADMIN, department: 'IT', school_id: SCHOOL_ID_1, documents: [] },
  { id: 'stf_16', staff_no: 'STF_016', name: 'Receptionist', email: 'reception@sovereign.edu', role: UserRole.RECEPTIONIST, department: 'Front Desk', school_id: SCHOOL_ID_1, documents: [] },
  { id: 'stf_17', staff_no: 'STF_017', name: 'Estate Manager', email: 'estate@sovereign.edu', role: UserRole.ESTATE_MANAGER, department: 'Facilities', school_id: SCHOOL_ID_1, documents: [] },
  { id: 'stf_18', staff_no: 'STF_018', name: 'Inventory Manager', email: 'inventory@sovereign.edu', role: UserRole.INVENTORY_MANAGER, department: 'Stores', school_id: SCHOOL_ID_1, documents: [] },
  { id: 'stf_19', staff_no: 'STF_019', name: 'Fleet Manager', email: 'fleet@sovereign.edu', role: UserRole.FLEET_MANAGER, department: 'Transport', school_id: SCHOOL_ID_1, documents: [] },
  { id: 'stf_20', staff_no: 'STF_020', name: 'Exam Controller', email: 'exam.cell@sovereign.edu', role: UserRole.EXAM_CELL, department: 'Exams', school_id: SCHOOL_ID_1, documents: [] }
];

// --- 5. DOCUMENTS (central index for seed test & ZIP manifest simulation) ---
export const DUMMY_DOCUMENTS = [
  // Students (a subset - many more exist in student objects above)
  { owner_type: 'STUDENT', owner_key: '2026-0001', doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0001/aadhaar.pdf', id_last4: '1111' },
  { owner_type: 'STUDENT', owner_key: '2026-0001', doc_type: 'PHOTO', file_ref: 'documents/students/2026-0001/photo.jpg' },
  { owner_type: 'STUDENT', owner_key: '2026-0002', doc_type: 'AADHAAR', file_ref: 'documents/students/2026-0002/aadhaar.pdf', id_last4: '2222' },
  // Parents
  { owner_type: 'PARENT', owner_key: 'PRN_001', doc_type: 'AADHAAR', file_ref: 'documents/parents/PRN_001/aadhaar.pdf', id_last4: '3210' },
  { owner_type: 'PARENT', owner_key: 'PRN_001', doc_type: 'DRIVING_LICENSE', file_ref: 'documents/parents/PRN_001/dl.jpg', id_last4: '4321' },
  // Staff
  { owner_type: 'STAFF', owner_key: 'STF_001', doc_type: 'AADHAAR', file_ref: 'documents/staff/STF_001/aadhaar.pdf', id_last4: '4001' }
];

// --- 6. BOOKS (kept modest) ---
export const DUMMY_BOOKS: Book[] = [
  { isbn: '978-01', title: 'Concepts of Physics Vol 1', author: 'H.C. Verma', status: 'AVAILABLE' },
  { isbn: '978-02', title: 'Concepts of Physics Vol 2', author: 'H.C. Verma', status: 'ISSUED', issuedTo: 'std_15' },
  { isbn: '978-03', title: 'Mathematics Class X', author: 'R.D. Sharma', status: 'AVAILABLE' },
  { isbn: '978-04', title: 'Science Class X', author: 'Lakhmir Singh', status: 'ISSUED', issuedTo: 'std_1' },
  { isbn: '978-05', title: 'History of India', author: 'Bipin Chandra', status: 'AVAILABLE' },
  { isbn: '978-06', title: 'Wings of Fire', author: 'A.P.J. Abdul Kalam', status: 'AVAILABLE' },
  { isbn: '978-07', title: 'The Discovery of India', author: 'Jawaharlal Nehru', status: 'ISSUED', issuedTo: 'std_17' },
  { isbn: '978-08', title: 'Train to Pakistan', author: 'Khushwant Singh', status: 'AVAILABLE' },
  { isbn: '978-09', title: 'God of Small Things', author: 'Arundhati Roy', status: 'AVAILABLE' },
  { isbn: '978-10', title: 'White Tiger', author: 'Aravind Adiga', status: 'ISSUED', issuedTo: 'std_18' },
];

// --- 7. BUSES (Matching Schema Requirements) ---
export const DUMMY_BUSES = [
  { 
    id: 'bus_1', 
    plateNumber: 'MP-09-0001', 
    driverName: 'Ramesh Singh', 
    capacity: 40, 
    routeId: 'R-01', 
    insuranceExpiry: '2026-01-01T00:00:00Z', 
    school_id: SCHOOL_ID_1 
  },
  { 
    id: 'bus_2', 
    plateNumber: 'MP-09-0002', 
    driverName: 'Suresh Kumar', 
    capacity: 35, 
    routeId: 'R-02', 
    insuranceExpiry: '2026-02-01T00:00:00Z', 
    school_id: SCHOOL_ID_1 
  },
  { 
    id: 'bus_3', 
    plateNumber: 'MP-09-0003', 
    driverName: 'Mahesh Yadav', 
    capacity: 50, 
    routeId: 'R-03', 
    insuranceExpiry: '2026-03-01T00:00:00Z', 
    school_id: SCHOOL_ID_1 
  }
];

// --- 8. HOSTEL ---
export const DUMMY_HOSTEL: HostelRoom[] = [
  { roomNumber: '101', capacity: 4, occupied: 3, gender: 'BOYS', students: ['std_1', 'std_3', 'std_5'] },
  { roomNumber: '102', capacity: 4, occupied: 4, gender: 'BOYS', students: ['std_7', 'std_9', 'std_11', 'std_13'] },
  { roomNumber: '201', capacity: 4, occupied: 2, gender: 'GIRLS', students: ['std_2', 'std_4'] },
];

// --- 9. INVOICES (Matching Schema Naming) ---
export const DUMMY_INVOICES = [
  { 
    id: 'INV-001', 
    student_id: 'std_1', 
    base_amount: 5000, 
    discount_amount: 0, 
    description: 'Term 1 Fees', 
    due_date: '2026-04-10T00:00:00Z', 
    status: 'PAID', 
    utr: 'UPI123456789012', 
    school_id: SCHOOL_ID_1 
  },
  { 
    id: 'INV-002', 
    student_id: 'std_2', 
    base_amount: 5000, 
    discount_amount: 0, 
    description: 'Term 1 Fees', 
    due_date: '2026-04-10T00:00:00Z', 
    status: 'PENDING', 
    school_id: SCHOOL_ID_1 
  },
  { 
    id: 'INV-003', 
    student_id: 'std_3', 
    base_amount: 2500, 
    discount_amount: 0, 
    description: 'Bus Fees', 
    due_date: '2026-04-10T00:00:00Z', 
    status: 'VERIFIED', 
    utr: 'NEFT0987654321', 
    school_id: SCHOOL_ID_1 
  },
  { 
    id: 'INV-004', 
    student_id: 'std_4', 
    base_amount: 5000, 
    discount_amount: 0, 
    description: 'Term 1 Fees', 
    due_date: '2026-04-10T00:00:00Z', 
    status: 'PENDING', 
    school_id: SCHOOL_ID_1 
  },
  { 
    id: 'INV-005', 
    student_id: 'std_5', 
    base_amount: 5000, 
    discount_amount: 0, 
    description: 'Term 1 Fees', 
    due_date: '2026-04-10T00:00:00Z', 
    status: 'PAID', 
    utr: 'UPI987654321098', 
    school_id: SCHOOL_ID_1 
  }
];

// --- 10. HOMEWORK ---
export const DUMMY_HOMEWORK = [
  { id: 'hw_1', class: '10-A', subject: 'Physics', title: 'Newton Laws', dueDate: '2026-10-28T00:00:00Z', status: 'PENDING' },
  { id: 'hw_2', class: '10-A', subject: 'Math', title: 'Quadratic Equations', dueDate: '2026-10-29T00:00:00Z', status: 'SUBMITTED' },
  { id: 'hw_3', class: '9-B', subject: 'History', title: 'Mughal Empire', dueDate: '2026-10-30T00:00:00Z', status: 'PENDING' }
];

// --- 11. MEDICAL LOGS (structured) ---
export const DUMMY_MEDICAL_LOGS = [
  { id: 'med_1', time: '2026-01-10T09:30:00Z', student_id: 'std_9', issue: 'Fever', action: 'Paracetamol given, Parents called', school_id: SCHOOL_ID_1 },
  { id: 'med_2', time: '2026-01-10T11:15:00Z', student_id: 'std_6', issue: 'Minor Cut', action: 'Dressed & Bandaged', school_id: SCHOOL_ID_1 },
  { id: 'med_3', time: '2026-01-10T13:00:00Z', student_id: 'std_1', issue: 'Headache', action: 'Rest in infirmary', school_id: SCHOOL_ID_1 }
];

// --- 12. GATE & RECEPTION LOGS ---
export const DUMMY_GATE_LOGS = [
  { id: 'g_1', type: 'VISITOR', name: 'Ramesh Courier', purpose: 'Amazon Delivery', time: '2026-01-10T10:30:00Z', status: 'EXITED', school_id: SCHOOL_ID_1 },
  { id: 'g_2', type: 'PARENT', name: 'Mrs. Sharma', purpose: 'Fee Payment', time: '2026-01-10T11:15:00Z', status: 'INSIDE', student_id: 'std_2', school_id: SCHOOL_ID_1 }
];

export const DUMMY_RECEPTION_VISITORS = [
  { id: 'rv_1', name: 'Vikram Singh', student_id: 'std_9', purpose: 'Meeting Principal', time: '2026-01-10T09:00:00Z', status: 'WAITING' },
  { id: 'rv_2', name: 'Anita Desai', student_id: 'std_12', purpose: 'Early Pickup', time: '2026-01-10T12:30:00Z', status: 'APPROVED' }
];

// --- 13. MAINTENANCE TICKETS ---
export const DUMMY_TICKETS = [
  { id: 'T-101', location: 'Chemistry Lab', issue: 'Leaking Tap', priority: 'MEDIUM', status: 'OPEN', reportedBy: 'HOD Physics' },
  { id: 'T-102', location: 'Class 5-B', issue: 'Broken Bench', priority: 'LOW', status: 'ASSIGNED', reportedBy: 'Class Teacher' }
];

// --- 14. SYLLABUS ---
export const DUMMY_SYLLABUS = [
  { id: 1, teacher: 'HOD Physics', subject: 'Physics', class: '10-A', completed: 65, target: 70, status: 'ON_TRACK' },
  { id: 2, teacher: 'Teacher Maths', subject: 'Maths', class: '10-A', completed: 80, target: 80, status: 'AHEAD' }
];

// --- 15. COUNSELING SESSIONS ---
export const DUMMY_COUNSELING = [
  { id: 'c_1', student_id: 'std_21', category: 'Behavioral', note: 'Showing signs of withdrawal. Recommended art therapy.', date: '2026-01-08T10:00:00Z', school_id: SCHOOL_ID_1 },
  { id: 'c_2', student_id: 'std_12', category: 'Academic Stress', note: 'Anxious about exams. Counseling scheduled.', date: '2026-01-09T11:00:00Z', school_id: SCHOOL_ID_1 }
];

// --- MASTER EXPORT ---
export const SOVEREIGN_GENESIS_DATA = {
  parents: DUMMY_PARENTS,
  parentStudent: DUMMY_PARENT_STUDENT,
  students: DUMMY_STUDENTS,
  staff: DUMMY_STAFF,
  documents: DUMMY_DOCUMENTS,
  books: DUMMY_BOOKS,
  buses: DUMMY_BUSES,
  hostel: DUMMY_HOSTEL,
  invoices: DUMMY_INVOICES,
  homework: DUMMY_HOMEWORK,
  medicalLogs: DUMMY_MEDICAL_LOGS,
  gateLogs: DUMMY_GATE_LOGS,
  visitors: DUMMY_RECEPTION_VISITORS,
  tickets: DUMMY_TICKETS,
  syllabus: DUMMY_SYLLABUS,
  counseling: DUMMY_COUNSELING
};
