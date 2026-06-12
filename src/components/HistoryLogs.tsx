/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Clock, CheckSquare, Search, AlertCircle, CalendarRange, UserCheck, RefreshCw } from 'lucide-react';
import { BorrowRecord } from '../types';

interface HistoryLogsProps {
  records: BorrowRecord[];
  isAdmin: boolean;
  onConfirmReturn: (recordId: string) => void;
}

export default function HistoryLogs({ records, isAdmin, onConfirmReturn }: HistoryLogsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'borrowing' | 'returned'>('all');

  // Format Date beautifully
  const formatThaiDate = (dateTimeStr: string) => {
    try {
      const d = new Date(dateTimeStr);
      if (isNaN(d.getTime())) return dateTimeStr;
      
      return d.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' น.';
    } catch {
      return dateTimeStr;
    }
  };

  // Helper to determine if a borrowing is overdue (past current time)
  const isOverdue = (record: BorrowRecord) => {
    if (record.status !== 'borrowing') return false;
    const returnTime = new Date(record.returnDateTime).getTime();
    const now = Date.now();
    return now > returnTime;
  };

  // Check how many items are overdue or unreturned
  const unreturnedCount = records.filter(r => r.status === 'borrowing').length;
  const overdueRecords = records.filter(isOverdue);
  const overdueCount = overdueRecords.length;

  // Search and status screening
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.serialNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.department.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && r.status === statusFilter;
  });

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
      
      {/* Admin Warning Panel for Unreturned Items */}
      {isAdmin && unreturnedCount > 0 && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-orange-100 rounded-xl text-orange-700 mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-orange-950">
                แจ้งเตือนแอดมิน: แฟ้มงานอุปกรณ์ค้างส่งคืน ({unreturnedCount} รายการ)
              </h4>
              <p className="text-xs text-orange-700 mt-0.5">
                มีอุปกรณ์ภายนอกระบบที่ยังอยู่ในความครอบครองของผู้ยืม และขณะนี้มี{' '}
                <span className="font-bold underline text-rose-600 font-mono">
                  {overdueCount} รายการที่ใกล้หรือเลยกำหนดส่งคืน
                </span>{' '}
                กรุณาตรวจสอบผู้รับผิดชอบด้านล่างด่วน
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header with Search and Tabs */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <CalendarRange className="w-5 h-5 text-indigo-600 mr-2" />
            ประวัติการยืม & ตรวจสอบรายการส่งคืน
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            สืบค้นข้อมูลประวัติผู้ยืม ค้นหาด้วยชื่อ สังกัด แผนก หรือเลขครุภัณฑ์ย่อย
          </p>
        </div>

        {/* Live History Search */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="ค้นหาประวัติ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:bg-white focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-400"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Status filter selection tabs */}
      <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl self-start max-w-sm">
        <button
          onClick={() => setStatusFilter('all')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          ทั้งหมด ({records.length})
        </button>
        <button
          onClick={() => setStatusFilter('borrowing')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            statusFilter === 'borrowing'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          ค้างคืน ({records.filter(r => r.status === 'borrowing').length})
        </button>
        <button
          onClick={() => setStatusFilter('returned')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            statusFilter === 'returned'
              ? 'bg-emerald-500 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          คืนแล้ว ({records.filter(r => r.status === 'returned').length})
        </button>
      </div>

      {/* Log list / table */}
      <div className="overflow-x-auto border border-slate-100 rounded-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-100">
              <th className="p-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">ผู้ยืม / สังกัด</th>
              <th className="p-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">อุปกรณ์</th>
              <th className="p-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">เลขครุภัณฑ์</th>
              <th className="p-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">กำหนดเวลา ยืม-คืน</th>
              <th className="p-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">สถานะ</th>
              {isAdmin && <th className="p-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">ควบคุม</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} className="py-8 text-center text-xs font-medium text-slate-400">
                  ไม่พบร่องรอยบันทึกการคอร์สยืมตามเงื่อนไขที่กำหนด
                </td>
              </tr>
            ) : (
              filteredRecords.map((record) => {
                const isLate = isOverdue(record);
                return (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Borrower Identity */}
                    <td className="p-3.5">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0">
                          {record.nickname}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{record.borrowerName}</p>
                          <p className="text-[10px] text-slate-400 font-medium">แผนก: {record.department}</p>
                        </div>
                      </div>
                    </td>

                    {/* Equipment Details */}
                    <td className="p-3.5">
                      <span className="text-xs font-extrabold text-slate-800 block">
                        {record.equipmentName}
                      </span>
                    </td>

                    {/* Serial Asset */}
                    <td className="p-3.5">
                      <span className="text-xs text-indigo-600 font-bold font-mono bg-indigo-50/50 px-2 py-0.5 rounded-lg border border-indigo-50">
                        {record.serialNum}
                      </span>
                    </td>

                    {/* Times */}
                    <td className="p-3.5 text-xs text-slate-600">
                      <div className="space-y-0.5 font-medium">
                        <p className="flex items-center">
                          <span className="text-[10px] text-slate-400 font-semibold w-10">ยืม:</span>
                          <span className="font-mono">{formatThaiDate(record.borrowDateTime)}</span>
                        </p>
                        <p className={`flex items-center ${isLate ? 'text-rose-600 font-bold' : ''}`}>
                          <span className="text-[10px] text-slate-400 font-semibold w-10">คืน:</span>
                          <span className="font-mono">{formatThaiDate(record.returnDateTime)}</span>
                        </p>
                        {record.actualReturnDateTime && (
                          <p className="flex items-center text-emerald-600">
                            <span className="text-[10px] text-slate-400 font-semibold w-10">จริง:</span>
                            <span className="font-mono font-bold">{formatThaiDate(record.actualReturnDateTime)}</span>
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Loan State Badges */}
                    <td className="p-3.5 text-center">
                      {record.status === 'borrowing' ? (
                        isLate ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">
                            <AlertCircle className="w-3.5 h-3.5 mr-1 text-rose-500" />
                            เลยกำหนดคืน !
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                            <Clock className="w-3.5 h-3.5 mr-1 text-amber-500" />
                            กำลังยืม...
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                          <UserCheck className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                          คืนแล้วสวนเรียบร้อย
                        </span>
                      )}
                    </td>

                    {/* Admin Action Buttons */}
                    {isAdmin && (
                      <td className="p-3.5 text-right">
                        {record.status === 'borrowing' ? (
                          <button
                            id={`btn-return-confirm-${record.id}`}
                            onClick={() => onConfirmReturn(record.id)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] shadow-sm transition-colors cursor-pointer"
                          >
                            <CheckSquare className="w-3.5 h-3.5" />
                            <span>ยืนยันคืนของ</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold italic">เสร็จสิ้นแล้ว</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
