/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box, CheckCircle2, RefreshCw, Wrench, AlertTriangle } from 'lucide-react';
import { Equipment } from '../types';

interface StatsGridProps {
  equipmentList: Equipment[];
}

export default function StatsGrid({ equipmentList }: StatsGridProps) {
  const total = equipmentList.length;
  const available = equipmentList.filter((e) => e.status === 'available').length;
  const borrowed = equipmentList.filter((e) => e.status === 'borrowed').length;
  const brokenCount = equipmentList.filter((e) => e.status === 'broken').length;
  const repairCount = equipmentList.filter((e) => e.status === 'repair').length;

  const statCards = [
    {
      id: 'stat-total',
      title: 'อุปกรณ์คุรุภัณฑ์ทั้งหมด',
      value: total,
      desc: 'รายการหลักในระบบ',
      icon: Box,
      colorClass: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    {
      id: 'stat-available',
      title: 'พร้อมให้ยืมบริโภค',
      value: available,
      desc: 'ใช้งานได้ทันที',
      icon: CheckCircle2,
      colorClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      id: 'stat-borrowed',
      title: 'กำลังถูกยืมไปใช้งาน',
      value: borrowed,
      desc: 'ตรวจสอบประวัติได้',
      icon: RefreshCw,
      colorClass: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    {
      id: 'stat-broken',
      title: 'ชำรุด (พัง) / ส่งศูนย์ซ่อม',
      value: brokenCount + repairCount,
      desc: `ชำรุด ${brokenCount} | ส่งซ่อม ${repairCount}`,
      icon: Wrench,
      colorClass: 'bg-rose-50 text-rose-600 border-rose-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            id={card.id}
            key={card.id}
            className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 tracking-tight">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl border ${card.colorClass} shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {card.value}
              </span>
              <span className="text-xs font-medium text-slate-400 block mt-1">
                {card.desc}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
