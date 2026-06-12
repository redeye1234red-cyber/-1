/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calendar, User, Briefcase, FileText, CheckCircle2, ChevronRight, AlertOctagon, CornerUpLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { Equipment, BorrowRecord } from '../types';

interface BorrowPageProps {
  equipmentList: Equipment[];
  selectedEquipment: Equipment | null;
  onSubmit: (record: Omit<BorrowRecord, 'id' | 'status'>) => void;
  onBackToCatalog: () => void;
}

export default function BorrowPage({
  equipmentList,
  selectedEquipment,
  onSubmit,
  onBackToCatalog,
}: BorrowPageProps) {
  // Local state for the selected equipment within the page
  const [activeEqId, setActiveEqId] = useState<string>('');
  
  // Form fields
  const [borrowerName, setBorrowerName] = useState('');
  const [nickname, setNickname] = useState('');
  const [department, setDepartment] = useState('เทคโนโลยีสารสนเทศ (IT)');
  const [borrowDateTime, setBorrowDateTime] = useState('');
  const [returnDateTime, setReturnDateTime] = useState('');
  const [formError, setFormError] = useState('');
  const [showSuccessTip, setShowSuccessTip] = useState(false);

  // Sync selected equipment from parent triggers
  useEffect(() => {
    if (selectedEquipment) {
      setActiveEqId(selectedEquipment.id);
    } else {
      // Find the first available equipment to pre-set
      const firstAvailable = equipmentList.find((e) => e.status === 'available');
      if (firstAvailable) {
        setActiveEqId(firstAvailable.id);
      } else if (equipmentList.length > 0) {
        setActiveEqId(equipmentList[0].id);
      }
    }
  }, [selectedEquipment, equipmentList]);

  // Set default dates
  useEffect(() => {
    const now = new Date();
    const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    
    const inThreeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const localThreeDays = new Date(inThreeDays.getTime() - inThreeDays.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

    setBorrowDateTime(localNow);
    setReturnDateTime(localThreeDays);
  }, []);

  // Retrieve current active equipment information
  const currentEquipment = equipmentList.find((e) => e.id === activeEqId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!currentEquipment) {
      setFormError('กรุณาเลือกอุปกรณ์ที่ต้องการขอยืม');
      return;
    }

    if (currentEquipment.status !== 'available') {
      setFormError('ขออภัย อุปกรณ์ชิ้นนี้ไม่ว่างให้ยืมในขณะนี้');
      return;
    }

    if (!borrowerName.trim()) {
      setFormError('กรุณากรอก ชื่อ-สกุล ผู้ขอยืม');
      return;
    }
    if (!nickname.trim()) {
      setFormError('กรุณากรอก ชื่อเล่น ผู้ขอยืม');
      return;
    }
    if (!department) {
      setFormError('กรุณาเลือกหรือระบุแผนก');
      return;
    }
    if (!borrowDateTime) {
      setFormError('กรุณาระบุ วัน-เวลาที่เริ่มยืม');
      return;
    }
    if (!returnDateTime) {
      setFormError('กรุณาระบุ วัน-เวลาที่กำหนดส่งคืน');
      return;
    }

    const t1 = new Date(borrowDateTime).getTime();
    const t2 = new Date(returnDateTime).getTime();
    if (t2 <= t1) {
      setFormError('วัน-เวลาที่กำหนดส่งคืน ต้องเกิดขึ้นหลังจากวัน-เวลาที่ยืม');
      return;
    }

    onSubmit({
      equipmentId: currentEquipment.id,
      equipmentName: currentEquipment.name,
      serialNum: currentEquipment.serialNum,
      borrowerName: borrowerName.trim(),
      nickname: nickname.trim(),
      department,
      borrowDateTime,
      returnDateTime,
    });

    // Clean inputs
    setBorrowerName('');
    setNickname('');
    setShowSuccessTip(true);
    setTimeout(() => {
      setShowSuccessTip(false);
      onBackToCatalog();
    }, 1800);
  };

  const departments = [
    'เทคโนโลยีสารสนเทศ (IT)',
    'ฝ่ายการตลาดและคอนเทนต์',
    'ฝ่ายบริการลูกค้า (Support)',
    'ฝ่ายสื่อสารองค์กร (PR)',
    'บัญชีและการเงิน',
    'ฝ่ายทรัพยากรบุคคล (HR)',
    'ฝ่ายขายและพัฒนาธุรกิจ (Sales)',
    'ผู้ใช้งานส่วนตัว / แขกบริการ'
  ];

  // List of equipment options that are available
  const availableEquipmentList = equipmentList;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Selection Left Column */}
      <div className="lg:col-span-5 space-y-5">
        <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900">
              1. เลือกอุปกรณ์ที่ต้องการยืม
            </h3>
            <button
              onClick={onBackToCatalog}
              className="inline-flex items-center text-[11px] text-indigo-600 hover:text-indigo-800 font-bold space-x-1"
            >
              <CornerUpLeft className="w-3.5 h-3.5" />
              <span>กลับหน้าคลัง</span>
            </button>
          </div>

          <div>
            <label htmlFor="eq-picker" className="block text-xs font-semibold text-slate-500 mb-1">
              ค้นหาหรือคลิกเลือกอุปกรณ์ย่อย
            </label>
            <select
              id="eq-picker"
              value={activeEqId}
              onChange={(e) => {
                setActiveEqId(e.target.value);
                setFormError('');
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:bg-white focus:border-indigo-500 focus:outline-none cursor-pointer"
            >
              {availableEquipmentList.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.name} ({eq.status === 'available' ? 'ว่าง' : eq.status}) - {eq.serialNum}
                </option>
              ))}
            </select>
          </div>

          {currentEquipment ? (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-200 border border-slate-200 relative">
                <img
                  src={currentEquipment.imageUrl}
                  alt={currentEquipment.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2.5 right-2.5">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white shadow-xs ${
                    currentEquipment.status === 'available' ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}>
                    {currentEquipment.status === 'available' ? 'ว่างพร้อมยืม' : 'ไม่ว่าง'}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold text-indigo-600 font-mono tracking-wider">
                  เลขคุรุภัณฑ์: {currentEquipment.serialNum}
                </span>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  {currentEquipment.name}
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {currentEquipment.description || 'ไม่มีคำอธิบายหรือรายละเอียดอื่นเกี่ยวกับชิ้นอุปกรณ์นี้'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-slate-200/55">
                <div className="bg-white p-2 rounded-lg border border-slate-100">
                  <span className="block text-[9px] text-slate-400 font-bold">รวมถูกยืมไปแล้ว</span>
                  <span className="text-xs font-bold text-slate-700">{currentEquipment.borrowCount} ครั้ง</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-100">
                  <span className="block text-[9px] text-slate-400 font-bold">เคยส่งซ่อมเคลม</span>
                  <span className="text-xs font-bold text-slate-700">{currentEquipment.repairCount} ครั้ง</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic text-center py-4">
              ขณะนี้ไม่มีอุปกรณ์คุรุภัณฑ์ใดจัดเก็บในฐานข้อมูล
            </p>
          )}
        </div>
      </div>

      {/* Main Borrow Form Card Right Column */}
      <div className="lg:col-span-7">
        <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
          <div>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              หน้าขอยืมของ (Dedicated Borrow Request Form)
            </span>
            <h3 className="text-base font-black text-slate-900 mt-2">
              2. กรอกข้อมูลส่วนบุคคลและระบุเวลากำหนดคืน
            </h3>
            <p className="text-xs text-slate-500">
              กรุณาระบุข้อมูลทุกช่องที่มีเครื่องหมายดอกจันสีแดงเพื่อส่งเรื่องให้ผู้ดูแลพิจารณา
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Input fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="form-borrower" className="block text-xs font-semibold text-slate-700 mb-1">
                  ชื่อ - นามสกุลจริง <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="form-borrower"
                    type="text"
                    placeholder="เช่น มงคล รุ่งเรืองสกุล"
                    value={borrowerName}
                    onChange={(e) => setBorrowerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                    required
                  />
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label htmlFor="form-nickname" className="block text-xs font-semibold text-slate-700 mb-1">
                  ชื่อเล่นในการทำงาน <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="form-nickname"
                    type="text"
                    placeholder="เช่น นนท์"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                    required
                  />
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Department Selection */}
            <div>
              <label htmlFor="form-dept" className="block text-xs font-semibold text-slate-700 mb-1">
                ระบุแผนก / ฝ่ายของท่าน <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="form-dept"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold focus:bg-white focus:border-indigo-500 focus:outline-none transition-all cursor-pointer appearance-none animate-none"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Date and Time selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="form-start-date" className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  วัน-เวลาที่เบิกยืม <span className="text-rose-500">*</span>
                </label>
                <input
                  id="form-start-date"
                  type="datetime-local"
                  value={borrowDateTime}
                  onChange={(e) => setBorrowDateTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold focus:bg-white focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="form-end-date" className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  กำหนดวัน-เวลาคืน <span className="text-rose-500">*</span>
                </label>
                <input
                  id="form-end-date"
                  type="datetime-local"
                  value={returnDateTime}
                  onChange={(e) => setReturnDateTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold focus:bg-white focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Verification card */}
            {currentEquipment && (
              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between text-xs">
                <div>
                  <p className="text-indigo-950 font-bold">ยืนยันจับคู่ข้อมูลคุรุภัณฑ์:</p>
                  <p className="text-slate-500 text-[10px] mt-0.5">
                    รุ่น: {currentEquipment.name} ({currentEquipment.serialNum})
                  </p>
                </div>
                <span className="text-[10px] text-indigo-700 font-extrabold bg-indigo-100 px-2 py-0.5 rounded-md">
                  พร้อมเชื่อมต่อประวัติ
                </span>
              </div>
            )}

            {formError && (
              <div className="flex items-center space-x-1.5 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold">
                <AlertOctagon className="w-4.5 h-4.5 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {showSuccessTip && (
              <div className="flex items-center justify-center space-x-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xs font-black animate-bounce shadow">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>ยื่นประสงค์ขอยืมสำเร็จ! ระบบกำลังนำพาท่านกลับหน้าหลัก</span>
              </div>
            )}

            <div className="flex space-x-3 pt-3">
              <button
                type="button"
                onClick={onBackToCatalog}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-extrabold transition-all cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                id="btn-confirm-page-borrow"
                type="submit"
                disabled={showSuccessTip}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all shadow-sm shadow-indigo-200 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>ยืนยันบันทึกขอยืม</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        </div>
      </div>

    </div>
  );
}
