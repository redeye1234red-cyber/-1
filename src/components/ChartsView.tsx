/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { BarChart3, Wrench, ShieldAlert } from 'lucide-react';
import { Equipment } from '../types';

interface ChartsViewProps {
  equipmentList: Equipment[];
}

const COLORS = [
  '#4f46e5', // indigo-600
  '#06b6d4', // cyan-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#f43f5e', // rose-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#3b82f6', // blue-500
];

export default function ChartsView({ equipmentList }: ChartsViewProps) {
  // Sort equipment list for top charts
  const topBorrowed = [...equipmentList]
    .sort((a, b) => b.borrowCount - a.borrowCount)
    .slice(0, 5)
    .map(e => ({
      name: e.name.length > 18 ? `${e.name.substring(0, 16)}...` : e.name,
      'จำนวนครั้งที่ยืม': e.borrowCount,
    }));

  const topRepaired = [...equipmentList]
    .filter(e => e.repairCount > 0)
    .sort((a, b) => b.repairCount - a.repairCount)
    .slice(0, 5)
    .map(e => ({
      name: e.name.length > 18 ? `${e.name.substring(0, 16)}...` : e.name,
      'จำนวนครั้งที่เสีย/ส่งซ่อม': e.repairCount,
    }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Borrow Stats Chart */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <BarChart3 className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              กราฟสถิติ: อุปกรณ์ที่ถูกยืมบ่อยสูงสุด (Top 5 ยืมบ่อย)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            แสดงจำนวนผู้เรียกใช้อดุมการยืมเครื่องมือเป็นทวีคูณ
          </p>
        </div>

        <div className="h-64 sm:h-72 w-full mt-2">
          {topBorrowed.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400 font-medium">
              ยังไม่มีสถิติการยืมที่จะประมวลผลเป็นกราฟได้
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topBorrowed} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #f1f5f9',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  }}
                />
                <Bar dataKey="จำนวนครั้งที่ยืม" radius={[6, 6, 0, 0]}>
                  {topBorrowed.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Repair Stats Chart */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <Wrench className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              กราฟสถิติ: อุปกรณ์ส่งซ่อม/ชำรุดช็อต (Top 5 เสียบ่อย)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            ระบุความเสื่อมถอยคฤหาสน์ของคุรุภัณฑ์ เพื่อวางแผนจัดซื้อทดแทน
          </p>
        </div>

        <div className="h-64 sm:h-72 w-full mt-2">
          {topRepaired.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400 font-medium">
              ยังไม่มีรายงานสถิติการชำรุดซ่อมแซมบันทึกในระบบ
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={topRepaired}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <XAxis
                  type="number"
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #f1f5f9',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}
                />
                <Bar dataKey="จำนวนครั้งที่เสีย/ส่งซ่อม" radius={[0, 6, 6, 0]}>
                  {topRepaired.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(COLORS.length - 1 - index) % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

    </div>
  );
}
