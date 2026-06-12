/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EquipmentStatus = 'available' | 'borrowed' | 'broken' | 'repair';

export interface Equipment {
  id: string;
  name: string;
  serialNum: string; // เลขครุภัณฑ์
  category: string;  // ประเภทอุปกรณ์
  status: EquipmentStatus;
  imageUrl: string;
  repairCount: number; // สถิติจำนวนครั้งส่งซ่อม/พัง
  borrowCount: number; // สถิติจำนวนครั้งที่ถูกยืม
  description?: string;
}

export type BorrowStatus = 'pending' | 'borrowing' | 'returned';

export interface BorrowRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  serialNum: string;
  borrowerName: string; // ชื่อ-สกุล
  nickname: string;      // ชื่อเล่น
  department: string;    // แผนก
  borrowDateTime: string; // วัน-เวลาที่ยืม
  returnDateTime: string; // วัน-เวลาที่กำหนดคืน
  actualReturnDateTime?: string; // วันเวลาที่คืนจริง (ถ้าคืนแล้ว)
  status: BorrowStatus;
}

export interface AdminUser {
  loggedIn: boolean;
  pin: string;
}
