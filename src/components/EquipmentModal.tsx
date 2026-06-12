/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Image, Save, AlertTriangle, Plus, Tag } from 'lucide-react';
import { motion } from 'motion/react';
import { Equipment, EquipmentStatus } from '../types';
import { CATEGORIES } from '../data';

interface EquipmentModalProps {
  equipment: Equipment | null; // If null, user is adding a new one
  onClose: () => void;
  onSubmit: (eq: Equipment) => void;
}

const DEFAULT_IMAGES_BY_CAT: Record<string, string> = {
  'โน้ตบุ๊ก & คอมพิวเตอร์': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600',
  'แท็บเล็ต & อุปกรณ์พกพา': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=600',
  'กล้อง & อุปกรณ์สตูดิโอ': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600',
  'โปรเจคเตอร์ & หน้าจอ': 'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&q=80&w=600',
  'อุปกรณ์เสริม & สายสัญญาณ': 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=600',
};

export default function EquipmentModal({ equipment, onClose, onSubmit }: EquipmentModalProps) {
  const [name, setName] = useState('');
  const [serialNum, setSerialNum] = useState('');
  const [category, setCategory] = useState('โน้ตบุ๊ก & คอมพิวเตอร์');
  const [status, setStatus] = useState<EquipmentStatus>('available');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [repairCount, setRepairCount] = useState(0);
  const [borrowCount, setBorrowCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (equipment) {
      setName(equipment.name);
      setSerialNum(equipment.serialNum);
      setCategory(equipment.category);
      setStatus(equipment.status);
      setImageUrl(equipment.imageUrl);
      setDescription(equipment.description || '');
      setRepairCount(equipment.repairCount);
      setBorrowCount(equipment.borrowCount);
    } else {
      // Clear for new additions
      setName('');
      setSerialNum('');
      setCategory('โน้ตบุ๊ก & คอมพิวเตอร์');
      setStatus('available');
      setImageUrl('');
      setDescription('');
      setRepairCount(0);
      setBorrowCount(0);
    }
    setErrorMsg('');
  }, [equipment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMsg('กรุณาระบุ ชื่อคุรุภัณฑ์/ชื่ออุปกรณ์');
      return;
    }
    if (!serialNum.trim()) {
      setErrorMsg('กรุณาระบุ เลขคุรุภัณฑ์');
      return;
    }

    // Assign fallback image based on category if empty
    let finalImageUrl = imageUrl.trim();
    if (!finalImageUrl) {
      finalImageUrl = DEFAULT_IMAGES_BY_CAT[category] || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=600';
    }

    const payload: Equipment = {
      id: equipment ? equipment.id : `eq-${Date.now()}`,
      name: name.trim(),
      serialNum: serialNum.trim(),
      category,
      status,
      imageUrl: finalImageUrl,
      description: description.trim(),
      repairCount,
      borrowCount,
    };

    onSubmit(payload);
  };

  const statusOptions: { value: EquipmentStatus; label: string; colorClass: string }[] = [
    { value: 'available', label: 'ใช้งานได้ปกติ (Available)', colorClass: 'bg-emerald-50 text-emerald-700 font-semibold' },
    { value: 'borrowed', label: 'ถูกยืมใช้งาน (Borrowed)', colorClass: 'bg-amber-50 text-amber-700 font-semibold' },
    { value: 'repair', label: 'ส่งศูนย์ซ่อม/เช็คอาการ (Repairing)', colorClass: 'bg-indigo-50 text-indigo-700 font-semibold' },
    { value: 'broken', label: 'ชำรุด/พังเสียหาย (Broken)', colorClass: 'bg-rose-50 text-rose-700 font-semibold' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-100 p-6 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {equipment ? 'แก้ไขรายละเอียดคุรุภัณฑ์' : 'เพิ่มอุปกรณ์ชนิดใหม่เข้าระบบ'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {equipment ? `แก้ไข ID อุปกรณ์: ${equipment.id}` : 'ระบุข้อมูลเฉพาะเพื่อลงทะเบียนของส่วนตัว/แผนก'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {/* Main Info */}
          <div>
            <label htmlFor="eq-name" className="block text-xs font-semibold text-slate-700 mb-1">
              ชื่อคุรุภัณฑ์ / อุปกรณ์ <span className="text-rose-500">*</span>
            </label>
            <input
              id="eq-name"
              type="text"
              placeholder="เช่น Dell UltraSharp 27 Monitor"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="eq-serial" className="block text-xs font-semibold text-slate-700 mb-1">
                เลขครุภัณฑ์ / บาร์โค้ด <span className="text-rose-500">*</span>
              </label>
              <input
                id="eq-serial"
                type="text"
                placeholder="เช่น คพ.67-0105/01"
                value={serialNum}
                onChange={(e) => setSerialNum(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="eq-category" className="block text-xs font-semibold text-slate-700 mb-1">
                ประเภทอุปกรณ์ <span className="text-rose-500">*</span>
              </label>
              <select
                id="eq-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all cursor-pointer appearance-none"
              >
                {CATEGORIES.filter(c => c !== 'ทั้งหมด').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Current Status Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 font-bold">
              สถานะการใช้งานปัจจุบัน
            </label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((opt) => {
                const isSelected = status === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setStatus(opt.value);
                      // Auto-increment repair counts for chart visualization demo when marking broken or repair!
                      if ((opt.value === 'repair' || opt.value === 'broken') && status !== opt.value) {
                        setRepairCount(prev => prev + 1);
                      }
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      isSelected
                        ? `${opt.colorClass} border-slate-400 ring-2 ring-indigo-50`
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{opt.label.split(' ')[0]}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {opt.value}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image & Description */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="eq-img" className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                <Image className="w-3.5 h-3.5 mr-1 text-slate-400" />
                รูปภาพลิงก์ประกอบ (Unsplash)
              </label>
              <input
                id="eq-img"
                type="url"
                placeholder="ว่างไว้เพื่อใช้รูปเริ่มต้นตามหมวดหมู่"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all font-mono"
              />
            </div>

            <div>
              <label htmlFor="eq-desc" className="block text-xs font-semibold text-slate-700 mb-1">
                รายละเอียดคำอธิบายสั้นๆ
              </label>
              <input
                id="eq-desc"
                type="text"
                placeholder="เช่น ความจุ, สเปกย่อย, มีสติกเกอร์แปะด้านหลัง"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Statistics Adjustments for Analytics Tuning */}
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              แดชบอร์ดสถิติวิเคราะห์ (สถิติซ่อม/ยืม ยืดหยุ่นได้สำหรับใช้ส่วนตัว)
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="repair-count" className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                  จำนวนครั้งที่ซ่อม/พังบ่อยสุด
                </label>
                <input
                  id="repair-count"
                  type="number"
                  min="0"
                  value={repairCount}
                  onChange={(e) => setRepairCount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="borrow-count" className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                  จำนวนครั้งที่ถููกยืมบ่อยสุด
                </label>
                <input
                  id="borrow-count"
                  type="number"
                  min="0"
                  value={borrowCount}
                  onChange={(e) => setBorrowCount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-center space-x-1 border border-rose-100 text-rose-700 p-2.5 rounded-xl bg-rose-50 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex space-x-2 pt-1">
            <button
              id="btn-eq-cancel"
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition-colors"
            >
              ยกเลิก
            </button>
            <button
              id="btn-eq-save"
              type="submit"
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-colors shadow-sm shadow-indigo-100 flex items-center justify-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{equipment ? 'บันทึกการแก้ไข' : 'เพิ่มอุปกรณ์ใหม่'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
