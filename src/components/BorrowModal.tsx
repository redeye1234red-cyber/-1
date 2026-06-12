/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calendar, User, Briefcase, FileText, X, AlertOctagon } from 'lucide-react';
import { motion } from 'motion/react';
import { Equipment, BorrowRecord } from '../types';

interface BorrowModalProps {
  equipment: Equipment | null;
  onClose: () => void;
  onSubmit: (record: Omit<BorrowRecord, 'id' | 'status'>) => void;
}

export default function BorrowModal({ equipment, onClose, onSubmit }: BorrowModalProps) {
  const [borrowerName, setBorrowerName] = useState('');
  const [nickname, setNickname] = useState('');
  const [department, setDepartment] = useState('เทคโนโลยีสารสนเทศ (IT)');
  const [borrowDateTime, setBorrowDateTime] = useState('');
  const [returnDateTime, setReturnDateTime] = useState('');
  const [formError, setFormError] = useState('');

  // Auto-fill dates
  useEffect(() => {
    if (equipment) {
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
      setFormError('');
    }
  }, [equipment]);

  if (!equipment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!borrowerName.trim()) {
      setFormError('กรุณากรอก ชื่อ-สกุล ผู้ขอยืม');
      return;
    }
    if (!nickname.trim()) {
      setFormError('กรุณากรอก ชื่อเล่น ผู้ขอยืม');
      return;
    }
    if (!department.trim()) {
      setFormError('กรุณากรอก แผนก หรือฝ่ายงาน');
      return;
    }
    if (!borrowDateTime) {
      setFormError('กรุณาระบุ วัน-เวลาที่เริ่มปฏิบัติการยืม');
      return;
    }
    if (!returnDateTime) {
      setFormError('กรุณาระบุ วัน-เวลาที่กำหนดคืนอุปกรณ์');
      return;
    }

    const t1 = new Date(borrowDateTime).getTime();
    const t2 = new Date(returnDateTime).getTime();
    if (t2 <= t1) {
      setFormError('วัน-เวลาที่กำหนดคืน ต้องเกิดขึ้นภายหลังวัน-เวลาที่เริ่มยืม');
      return;
    }

    onSubmit({
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      serialNum: equipment.serialNum,
      borrowerName: borrowerName.trim(),
      nickname: nickname.trim(),
      department,
      borrowDateTime,
      returnDateTime,
    });
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-100 p-6 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full">
              แบบฟอร์มขอยืมอุปกรณ์ 
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-2">
              กรอกข้อมูลการยืมคุรุภัณฑ์อิเล็กทรอนิกส์
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {/* Read-Only Equipment Details */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              อุปกรณ์ที่เลือกยืม
            </h4>
            <div className="flex items-center space-x-3 mt-1">
              <img
                src={equipment.imageUrl}
                alt={equipment.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="text-sm font-bold text-slate-800">{equipment.name}</p>
                <p className="text-xs text-indigo-600 font-mono mt-0.5">
                  เลขคุรุภัณฑ์: {equipment.serialNum}
                </p>
              </div>
            </div>
          </div>

          {/* Core Personal Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="borrower-name" className="block text-xs font-semibold text-slate-700 mb-1">
                ชื่อ - สกุล <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="borrower-name"
                  type="text"
                  placeholder="เช่น มงคล รุ่งเรือง"
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all"
                  required
                />
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label htmlFor="nickname" className="block text-xs font-semibold text-slate-700 mb-1">
                ชื่อเล่น <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="nickname"
                  type="text"
                  placeholder="เช่น ต้น"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all"
                  required
                />
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Department Choice */}
          <div>
            <label htmlFor="dept" className="block text-xs font-semibold text-slate-700 mb-1">
              แผนก / ฝ่ายงาน <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                id="dept"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all cursor-pointer appearance-none"
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

          {/* Date Pickers */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="borrow-date" className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                วัน-เวลาที่ยืม <span className="text-rose-500">*</span>
              </label>
              <input
                id="borrow-date"
                type="datetime-local"
                value={borrowDateTime}
                onChange={(e) => setBorrowDateTime(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all font-mono"
                required
              />
            </div>

            <div>
              <label htmlFor="return-date" className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                วัน-เวลาที่คืน <span className="text-rose-500">*</span>
              </label>
              <input
                id="return-date"
                type="datetime-local"
                value={returnDateTime}
                onChange={(e) => setReturnDateTime(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all font-mono"
                required
              />
            </div>
          </div>

          {/* Asset/Serial info shown statically but fully formatted */}
          <div className="grid grid-cols-2 gap-3 bg-indigo-50/40 p-3 rounded-xl border border-indigo-50">
            <div>
              <span className="block text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                เลขคุรุภัณฑ์อ้างอิง
              </span>
              <span className="text-xs font-semibold text-indigo-900 font-mono mt-0.5 block">
                {equipment.serialNum}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                ชื่อจัดเก็บในระบบ
              </span>
              <span className="text-xs font-semibold text-indigo-900 truncate mt-0.5 block">
                {equipment.name}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {formError && (
            <div className="flex items-center space-x-1.5 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-medium">
              <AlertOctagon className="w-4.5 h-4.5 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex space-x-2 pt-2">
            <button
              id="btn-borrow-cancel"
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition-colors"
            >
              ยกเลิก
            </button>
            <button
              id="btn-borrow-submit"
              type="submit"
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-colors shadow-sm shadow-indigo-100"
            >
              ยืนยันขอยืมเครื่องมือ
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
