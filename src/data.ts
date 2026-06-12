/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Equipment, BorrowRecord } from './types';

export const INITIAL_EQUIPMENT: Equipment[] = [
  {
    id: 'eq-1',
    name: 'MacBook Pro 16" (M3 Max)',
    serialNum: 'คพ.67-0012/01',
    category: 'โน้ตบุ๊ก & คอมพิวเตอร์',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600',
    repairCount: 1,
    borrowCount: 15,
    description: 'ชิป M3 Max, RAM 36GB, SSD 1TB สำหรับงานกราฟิกและตัดต่อวิดีโอประสิทธิภาพสูง'
  },
  {
    id: 'eq-2',
    name: 'iPad Pro 11" (M4)',
    serialNum: 'คพ.67-0043/05',
    category: 'แท็บเล็ต & อุปกรณ์พกพา',
    status: 'borrowed',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=600',
    repairCount: 0,
    borrowCount: 22,
    description: 'iPad Pro พร้อม Apple Pencil Pro และ Magic Keyboard สำหรับทวนงาน ท่องเว็บ วาดรูป'
  },
  {
    id: 'eq-3',
    name: 'Canon EOS R6 Mark II',
    serialNum: 'กล.66-0152/01',
    category: 'กล้อง & อุปกรณ์สตูดิโอ',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600',
    repairCount: 3,
    borrowCount: 18,
    description: 'กล้องฟูลเฟรมมิเรอร์เลส เลนส์ Kit 24-105mm F4 L IS USM ถ่ายภาพนิ่งและวิดีโอระดับมืออาชีพ'
  },
  {
    id: 'eq-4',
    name: 'Epson EB-FH52 Projector',
    serialNum: 'ฉภ.65-0089/03',
    category: 'โปรเจคเตอร์ & หน้าจอ',
    status: 'repair',
    imageUrl: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&q=80&w=600',
    repairCount: 5,
    borrowCount: 8,
    description: 'ความคมชัด Full HD, ความสว่าง 4,000 Lumens สำหรับเปิดประชุม สัมมนา ฉายภาพขนาดใหญ่'
  },
  {
    id: 'eq-5',
    name: 'DJI Mic 2 (เซ็ตไมค์ไร้สายคู่)',
    serialNum: 'สอ.67-0105/02',
    category: 'กล้อง & อุปกรณ์สตูดิโอ',
    status: 'broken',
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=600',
    repairCount: 4,
    borrowCount: 12,
    description: 'ไมโครโฟนไร้สายขนาดพกพา เสียงคมชัด ตัดเสียงรบกวนอัจฉริยะ (ขณะนี้พัง รอส่งศูนย์ซ่อม)'
  },
  {
    id: 'eq-6',
    name: 'Dell Latitude 3440 Laptop',
    serialNum: 'คพ.66-0211/08',
    category: 'โน้ตบุ๊ก & คอมพิวเตอร์',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=600',
    repairCount: 2,
    borrowCount: 10,
    description: 'Intel Core i5, RAM 16GB สำหรับใช้ทำงานทั่วไป เทรนนิ่ง หรือนำเสนองานนอกสถานที่'
  },
  {
    id: 'eq-7',
    name: 'Logitech MX Master 3S',
    serialNum: 'อป.67-0092/12',
    category: 'อุปกรณ์เสริม & สายสัญญาณ',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=600',
    repairCount: 0,
    borrowCount: 25,
    description: 'เมาส์ไร้สายยอดนิยม ออกแบบตามหลักสรีรศาสตร์ แม่นยำสูง ลื่นไหล เงียบเป็นพิเศษ'
  },
  {
    id: 'eq-8',
    name: 'HyperDrive VIPER 10-in-2 USB-C Hub',
    serialNum: 'อป.66-0301/04',
    category: 'อุปกรณ์เสริม & สายสัญญาณ',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=600',
    repairCount: 1,
    borrowCount: 30,
    description: 'ตัวแปลงพอร์ตอเนกประสงค์ขยาย HDMI สองจอ, USB-A, SD Card, และสายแลน RJ45'
  }
];

export const INITIAL_BORROW_RECORDS: BorrowRecord[] = [
  {
    id: 'rec-1',
    equipmentId: 'eq-2',
    equipmentName: 'iPad Pro 11" (M4)',
    serialNum: 'คพ.67-0043/05',
    borrowerName: 'สมเกียรติ พัฒนดี',
    nickname: 'เกียรติ',
    department: 'เทคโนโลยีสารสนเทศ (IT)',
    borrowDateTime: '2026-06-08T09:00',
    returnDateTime: '2026-06-12T17:00',
    status: 'borrowing'
  },
  {
    id: 'rec-2',
    equipmentId: 'eq-1',
    equipmentName: 'MacBook Pro 16" (M3 Max)',
    serialNum: 'คพ.67-0012/01',
    borrowerName: 'ณิชาภัทร อรุณรุ่ง',
    nickname: 'ชาภัทร',
    department: 'ฝ่ายการตลาดและคอนเทนต์',
    borrowDateTime: '2026-06-05T10:00',
    returnDateTime: '2026-06-08T16:00',
    actualReturnDateTime: '2026-06-08T15:30',
    status: 'returned'
  },
  {
    id: 'rec-3',
    equipmentId: 'eq-8',
    equipmentName: 'HyperDrive VIPER 10-in-2 USB-C Hub',
    serialNum: 'อป.66-0301/04',
    borrowerName: 'วิศรุต สุขเกษม',
    nickname: 'บอย',
    department: 'ฝ่ายบริการลูกค้า (Support)',
    borrowDateTime: '2026-06-09T13:30',
    returnDateTime: '2026-06-15T12:00',
    status: 'borrowing'
  },
  {
    id: 'rec-4',
    equipmentId: 'eq-3',
    equipmentName: 'Canon EOS R6 Mark II',
    serialNum: 'กล.66-0152/01',
    borrowerName: 'จิราพร ใจซื่อ',
    nickname: 'แป้ง',
    department: 'ฝ่ายสื่อสารองค์กร (PR)',
    borrowDateTime: '2026-06-01T08:30',
    returnDateTime: '2026-06-03T18:00',
    actualReturnDateTime: '2026-06-03T17:45',
    status: 'returned'
  },
  {
    id: 'rec-5',
    equipmentId: 'eq-6',
    equipmentName: 'Dell Latitude 3440 Laptop',
    serialNum: 'คพ.66-0211/08',
    borrowerName: 'ปวีณา ยะลา',
    nickname: 'มุก',
    department: 'บัญชีและการเงิน',
    borrowDateTime: '2026-06-01T09:00',
    returnDateTime: '2026-06-05T17:00',
    actualReturnDateTime: '2026-06-07T10:00', // Late return
    status: 'returned'
  }
];

export const CATEGORIES = [
  'ทั้งหมด',
  'โน้ตบุ๊ก & คอมพิวเตอร์',
  'แท็บเล็ต & อุปกรณ์พกพา',
  'กล้อง & อุปกรณ์สตูดิโอ',
  'โปรเจคเตอร์ & หน้าจอ',
  'อุปกรณ์เสริม & สายสัญญาณ'
];
