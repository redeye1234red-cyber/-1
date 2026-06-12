/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  SlidersHorizontal,
  Wrench,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  FileText,
  BarChart3,
  ListFilter,
  Box,
  CalendarRange,
  LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Data types & assets
import { Equipment, BorrowRecord, EquipmentStatus } from './types';
import { INITIAL_EQUIPMENT, INITIAL_BORROW_RECORDS, CATEGORIES } from './data';

// Custom sub-components
import Navbar from './components/Navbar';
import StatsGrid from './components/StatsGrid';
import BorrowPage from './components/BorrowPage';
import EquipmentModal from './components/EquipmentModal';
import HistoryLogs from './components/HistoryLogs';
import ChartsView from './components/ChartsView';

export default function App() {
  // Master states
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Active view tab state (catalog, borrow, history, charts)
  const [activeTab, setActiveTab] = useState<'catalog' | 'borrow' | 'history' | 'charts'>('catalog');

  // Filters & layout inside the catalog tab
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  
  // Custom status filter checkboxes
  const [filterStatuses, setFilterStatuses] = useState<{
    available: boolean;
    borrowed: boolean;
    broken: boolean;
    repair: boolean;
  }>({
    available: true,
    borrowed: true,
    broken: true,
    repair: true,
  });

  // Modal / selector triggers
  const [selectedEqForBorrow, setSelectedEqForBorrow] = useState<Equipment | null>(null);
  const [selectedEqForEdit, setSelectedEqForEdit] = useState<Equipment | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Load initial settings & data from LocalStorage
  useEffect(() => {
    const savedEq = localStorage.getItem('local_school_equipment');
    const savedRecs = localStorage.getItem('local_school_borrow_records');
    const savedAdmin = localStorage.getItem('local_school_is_admin');

    if (savedEq) {
      setEquipmentList(JSON.parse(savedEq));
    } else {
      setEquipmentList(INITIAL_EQUIPMENT);
      localStorage.setItem('local_school_equipment', JSON.stringify(INITIAL_EQUIPMENT));
    }

    if (savedRecs) {
      setBorrowRecords(JSON.parse(savedRecs));
    } else {
      setBorrowRecords(INITIAL_BORROW_RECORDS);
      localStorage.setItem('local_school_borrow_records', JSON.stringify(INITIAL_BORROW_RECORDS));
    }

    if (savedAdmin) {
      setIsAdmin(JSON.parse(savedAdmin));
    }
  }, []);

  // Save states to LocalStorage helper
  const saveEquipmentToStorage = (updatedList: Equipment[]) => {
    setEquipmentList(updatedList);
    localStorage.setItem('local_school_equipment', JSON.stringify(updatedList));
  };

  const saveRecordsToStorage = (updatedRecords: BorrowRecord[]) => {
    setBorrowRecords(updatedRecords);
    localStorage.setItem('local_school_borrow_records', JSON.stringify(updatedRecords));
  };

  // Auth handles
  const handleAdminLogin = (pinInput: string): boolean => {
    // Starting credentials pin is 1234
    if (pinInput === '1234') {
      setIsAdmin(true);
      localStorage.setItem('local_school_is_admin', JSON.stringify(true));
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.setItem('local_school_is_admin', JSON.stringify(false));
  };

  // User submits a booking request
  const handleBorrowRequestSubmit = (data: Omit<BorrowRecord, 'id' | 'status'>) => {
    const newRecord: BorrowRecord = {
      ...data,
      id: `rec-${Date.now()}`,
      status: 'borrowing',
    };

    // Update equipment list status -> borrowed and increment borrow count
    const updatedEqList = equipmentList.map((eq) => {
      if (eq.id === data.equipmentId) {
        return {
          ...eq,
          status: 'borrowed' as EquipmentStatus,
          borrowCount: eq.borrowCount + 1,
        };
      }
      return eq;
    });

    saveEquipmentToStorage(updatedEqList);
    saveRecordsToStorage([newRecord, ...borrowRecords]);
    setSelectedEqForBorrow(null);
  };

  // Admin approves return of equipment back to database
  const handleConfirmReturn = (recordId: string) => {
    const record = borrowRecords.find((r) => r.id === recordId);
    if (!record) return;

    const now = new Date();
    const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

    // Update record status to returned
    const updatedRecords = borrowRecords.map((r) => {
      if (r.id === recordId) {
        return {
          ...r,
          status: 'returned' as const,
          actualReturnDateTime: localNow,
        };
      }
      return r;
    });

    // Revert equipment status back to available
    const updatedEqList = equipmentList.map((eq) => {
      if (eq.id === record.equipmentId) {
        return {
          ...eq,
          status: 'available' as EquipmentStatus,
        };
      }
      return eq;
    });

    saveEquipmentToStorage(updatedEqList);
    saveRecordsToStorage(updatedRecords);
  };

  // Admin adds/edits piece of equipment
  const handleSaveEquipment = (eq: Equipment) => {
    const exists = equipmentList.some((e) => e.id === eq.id);
    let updatedList: Equipment[] = [];

    if (exists) {
      updatedList = equipmentList.map((e) => (e.id === eq.id ? eq : e));
    } else {
      updatedList = [...equipmentList, eq];
    }

    saveEquipmentToStorage(updatedList);
    setEquipmentList(updatedList);
    setSelectedEqForEdit(null);
    setShowAddModal(false);
  };

  // Filter criteria computation for catalog rendering
  const filteredEquipment = equipmentList.filter((eq) => {
    const matchesSearch =
      eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.serialNum.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (eq.description && eq.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'ทั้งหมด' || eq.category === selectedCategory;
    const matchesStatus = filterStatuses[eq.status];

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate unreturned notifications
  const unreturnedCount = borrowRecords.filter((r) => r.status === 'borrowing').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans transition-all pb-16 antialiased">
      
      {/* Top Navigation Frame */}
      <Navbar isAdmin={isAdmin} onLogin={handleAdminLogin} onLogout={handleAdminLogout} />

      {/* Main content body container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-7">
        
        {/* Quick Intro Banner Card */}
        <section className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-slate-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-500/20 text-indigo-200 text-xs font-bold rounded-full border border-indigo-400/20 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal & Office Asset Locker</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
              ตู้เก็บของอัจฉริยะ ยืม-คืนคุรุภัณฑ์แผนก
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100/80 leading-relaxed font-medium">
              เพิ่มระดับความโปร่งใสในการคอร์สยืมพัสดุส่วนตัว แยกหมวดหมู่อุปกรณ์ชำรุดรอซ่อมบำรุง 
              พร้อมติดตามผู้ครอบครองและระบบวิเคราะห์ข้อมูลเครื่องมือเสียหรือยืมยอดฮิตบ่อยที่สุด
            </p>
          </div>
        </section>

        {/* Dashboard Live Counters bar */}
        <section className="space-y-3">
          <StatsGrid equipmentList={equipmentList} />
        </section>

        {/* Navigation Core View Switcher tabs - IMPORTANT FOR THE SEPARATION ASPECT */}
        <div className="border-b border-slate-200 pb-1">
          <nav className="flex flex-wrap gap-1" aria-label="Tabs">
            <button
              id="tab-catalog"
              onClick={() => setActiveTab('catalog')}
              className={`inline-flex items-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>1. คลังอุปกรณ์ทั้งหมด</span>
            </button>

            <button
              id="tab-borrow"
              onClick={() => setActiveTab('borrow')}
              className={`inline-flex items-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
                activeTab === 'borrow'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>2. หน้าแบบฟอร์มขอยืมของ</span>
              {selectedEqForBorrow && (
                <span className="ml-1.5 w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
              )}
            </button>

            <button
              id="tab-history"
              onClick={() => setActiveTab('history')}
              className={`inline-flex items-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <CalendarRange className="w-4 h-4" />
              <span>3. บันทึกและตรวจของค้างส่ง</span>
              {unreturnedCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-orange-500 text-white leading-none">
                  {unreturnedCount}
                </span>
              )}
            </button>

            <button
              id="tab-charts"
              onClick={() => setActiveTab('charts')}
              className={`inline-flex items-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'charts'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>4. รายงานกราฟสถิติ</span>
            </button>
          </nav>
        </div>

        {/* Dynamic Inner Tab View */}
        <div className="mt-4">
          <AnimatePresence mode="wait">
            {activeTab === 'catalog' && (
              <motion.div
                key="catalog-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
              >
                {/* Search & Left Filters */}
                <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 flex items-center">
                      <SlidersHorizontal className="w-4 h-4 text-indigo-600 mr-2" />
                      กล่องจัดระเบียบอุปกรณ์
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">
                      พิมพ์ชื่อรุ่น หรือเลือกหมวดพังชำรุดซ่อมแซม
                    </p>
                  </div>

                  {/* Search queries input */}
                  <div className="space-y-1.5">
                    <label htmlFor="catalog-search" className="block text-xs font-bold text-slate-600">
                      สืบค้นด่วน
                    </label>
                    <div className="relative">
                      <input
                        id="catalog-search"
                        type="text"
                        placeholder="ชื่อตัวเครื่อง / คีย์ผลิตภัณฑ์ / สเปก..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:bg-white focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-400"
                      />
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  {/* Filter checkbox options */}
                  <div className="space-y-2 border-t border-slate-100 pt-4">
                    <span className="block text-xs font-bold text-slate-700">
                      เลือกแสดงแยกเฉพาะกลุ่ม:
                    </span>
                    <div className="space-y-2 mt-2">
                      <label className="flex items-center space-x-2.5 text-xs font-semibold text-slate-600 hover:text-slate-950 cursor-pointer p-1 rounded hover:bg-slate-50 transition-all">
                        <input
                          type="checkbox"
                          checked={filterStatuses.available}
                          onChange={(e) => setFilterStatuses({ ...filterStatuses, available: e.target.checked })}
                          className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500"
                        />
                        <span className="flex items-center">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                          ว่างพร้อมให้ยืม (Available)
                        </span>
                      </label>

                      <label className="flex items-center space-x-2.5 text-xs font-semibold text-slate-600 hover:text-slate-950 cursor-pointer p-1 rounded hover:bg-slate-50 transition-all">
                        <input
                          type="checkbox"
                          checked={filterStatuses.borrowed}
                          onChange={(e) => setFilterStatuses({ ...filterStatuses, borrowed: e.target.checked })}
                          className="w-4 h-4 rounded text-amber-600 border-slate-300 focus:ring-amber-500"
                        />
                        <span className="flex items-center">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-2" />
                          ถูกยืมครองอยู่ (Borrowed)
                        </span>
                      </label>

                      <label className="flex items-center space-x-2.5 text-xs font-semibold text-rose-700 hover:text-rose-950 cursor-pointer p-1 rounded bg-rose-50/20 hover:bg-rose-50/50 border border-transparent hover:border-rose-100 transition-all">
                        <input
                          type="checkbox"
                          checked={filterStatuses.broken}
                          onChange={(e) => setFilterStatuses({ ...filterStatuses, broken: e.target.checked })}
                          className="w-4 h-4 rounded text-rose-600 border-rose-300 focus:ring-rose-500"
                        />
                        <span className="flex items-center font-bold">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 mr-2 animate-pulse" />
                          ชำรุดพังเสียหาย (Broken)
                        </span>
                      </label>

                      <label className="flex items-center space-x-2.5 text-xs font-semibold text-indigo-700 hover:text-indigo-950 cursor-pointer p-1 rounded bg-indigo-50/20 hover:bg-indigo-50/50 border border-transparent hover:border-indigo-100 transition-all">
                        <input
                          type="checkbox"
                          checked={filterStatuses.repair}
                          onChange={(e) => setFilterStatuses({ ...filterStatuses, repair: e.target.checked })}
                          className="w-4 h-4 rounded text-indigo-600 border-indigo-300"
                        />
                        <span className="flex items-center font-bold">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 mr-2" />
                          อยู่ส่งเคลมศูนย์ (Repairing)
                        </span>
                      </label>
                    </div>

                    <button
                      onClick={() => setFilterStatuses({ available: true, borrowed: true, broken: true, repair: true })}
                      className="text-[10px] text-indigo-600 hover:underline font-bold mt-2 block text-right w-full"
                    >
                      [แสดงสถานะของทั้งหมด]
                    </button>
                  </div>

                  {/* Admin controls inside catalog area */}
                  {isAdmin && (
                    <div className="border-t border-slate-100 pt-5 space-y-2">
                      <span className="block text-xs font-bold text-slate-800">เครื่องมือจัดการคลัง (สิทธิ์แอดมิน)</span>
                      <button
                        onClick={() => {
                          setSelectedEqForEdit(null);
                          setShowAddModal(true);
                        }}
                        className="w-full inline-flex items-center justify-center space-x-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>เพิ่มลงทะเบียนอุปกรณ์ใหม่</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Grid Lists */}
                <div className="lg:col-span-8 space-y-5">
                  <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
                    {CATEGORIES.map((cat) => {
                      const isSelected = selectedCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                            isSelected
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredEquipment.length === 0 ? (
                      <div className="col-span-2 bg-white rounded-3xl p-10 border border-slate-100 text-center space-y-3">
                        <div className="inline-flex p-3 bg-slate-50 text-slate-400 rounded-full">
                          <ListFilter className="w-6 h-6" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-800">ไม่พบคุรุภัณฑ์</h4>
                        <p className="text-[11px] text-slate-500">โปรดลองเลือกประเภทหรือเปิดเครื่องสุ่มดูชิ้นอื่น</p>
                      </div>
                    ) : (
                      filteredEquipment.map((eq) => (
                        <div
                          key={eq.id}
                          className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                        >
                          {/* Image box */}
                          <div className="relative aspect-[16/9] w-full bg-slate-100">
                            <img
                              src={eq.imageUrl}
                              alt={eq.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />

                            <div className="absolute top-2.5 right-2.5">
                              {eq.status === 'available' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-white">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  พร้อมใช้งาน
                                </span>
                              )}
                              {eq.status === 'borrowed' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white">
                                  <Clock className="w-3 h-3 mr-1" />
                                  ถูกยืมใช้งาน
                                </span>
                              )}
                              {eq.status === 'repair' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-600 text-white">
                                  <Wrench className="w-3 h-3 mr-1" />
                                  ศูนย์ซ่อม
                                </span>
                              )}
                              {eq.status === 'broken' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-600 text-white animate-pulse">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  ชำรุดเสียหาย
                                </span>
                              )}
                            </div>

                            <div className="absolute bottom-2.5 left-2.5">
                              <span className="text-[9px] font-extrabold text-white bg-slate-900/65 px-2 py-0.5 rounded">
                                {eq.category}
                              </span>
                            </div>
                          </div>

                          {/* Detail fields */}
                          <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-extrabold text-indigo-600 font-mono">
                                  {eq.serialNum}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  ยืมไป {eq.borrowCount} ครั้ง
                                </span>
                              </div>

                              <h4 className="text-xs font-extrabold text-slate-800 line-clamp-1">{eq.name}</h4>
                              <p className="text-[10px] text-slate-400 line-clamp-1 leading-normal">
                                {eq.description || 'ไม่มีคำอธิบายหรือรายละเอียดอื่นเกี่ยวกับชิ้นอุปกรณ์นี้'}
                              </p>
                            </div>

                            <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                              {eq.status === 'borrowed' ? (
                                <span className="text-[10px] text-slate-400 font-medium">
                                  ผู้ครอบครอง:{' '}
                                  <strong className="text-amber-700">
                                    {borrowRecords.find((r) => r.equipmentId === eq.id && r.status === 'borrowing')?.nickname || 'แผนกอื่น'}
                                  </strong>
                                </span>
                              ) : eq.status === 'repair' ? (
                                <span className="text-[10px] text-indigo-600 font-bold">
                                  พังรวม {eq.repairCount ?? 0} ครั้ง
                                </span>
                              ) : (
                                <span className="text-[10px] text-emerald-600 font-bold">
                                  ว่างเปล่า ให้จองได้
                                </span>
                              )}

                              <div className="flex space-x-1">
                                {isAdmin && (
                                  <button
                                    onClick={() => {
                                      setSelectedEqForEdit(eq);
                                      setShowAddModal(true);
                                    }}
                                    className="px-2 py-1 text-[10px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-md cursor-pointer"
                                  >
                                    แก้ไข
                                  </button>
                                )}

                                {eq.status === 'available' ? (
                                  <button
                                    onClick={() => {
                                      setSelectedEqForBorrow(eq);
                                      setActiveTab('borrow'); // REDIRECT USER INSTANTLY TO THE SEPARATED FORM VIEW
                                    }}
                                    className="px-3.5 py-1 text-[10px] font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-md cursor-pointer"
                                  >
                                    ขอยืมย่อย
                                  </button>
                                ) : (
                                  <button
                                    disabled
                                    className="px-3.5 py-1 text-[10px] text-slate-400 bg-slate-100 rounded-md cursor-not-allowed"
                                  >
                                    ไม่ว่าง
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'borrow' && (
              <motion.div
                key="borrow-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Isolated specialized Borrow Register Request components */}
                <BorrowPage
                  equipmentList={equipmentList}
                  selectedEquipment={selectedEqForBorrow}
                  onBackToCatalog={() => {
                    setSelectedEqForBorrow(null);
                    setActiveTab('catalog');
                  }}
                  onSubmit={handleBorrowRequestSubmit}
                />
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <HistoryLogs
                  records={borrowRecords}
                  isAdmin={isAdmin}
                  onConfirmReturn={handleConfirmReturn}
                />
              </motion.div>
            )}

            {activeTab === 'charts' && (
              <motion.div
                key="charts-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <ChartsView equipmentList={equipmentList} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </main>

      {/* Floating admin equipment settings creator/editor modal backdrop */}
      <AnimatePresence>
        {showAddModal && (
          <EquipmentModal
            equipment={selectedEqForEdit}
            onClose={() => {
              setSelectedEqForEdit(null);
              setShowAddModal(false);
            }}
            onSubmit={handleSaveEquipment}
          />
        )}
      </AnimatePresence>

      {/* Static visual layout Footer */}
      <footer id="app-footer" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 border-t border-slate-200 pt-6 text-center">
        <p className="text-xs text-slate-400 font-medium">
          ระบบสารสนเทศยืม-คืนอุปกรณ์ส่วนตัวและเครื่องใช้ไฟฟ้าพัสดุแผนก © 2026. ออกแบบด้วยองค์ประกอบ UI ที่ลงตัวอย่างมีระดับ
        </p>
      </footer>
    </div>
  );
}
