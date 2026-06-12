/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LogIn, LogOut, Shield, Key, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  isAdmin: boolean;
  onLogin: (pin: string) => boolean;
  onLogout: () => void;
}

export default function Navbar({ isAdmin, onLogin, onLogout }: NavbarProps) {
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(pinInput);
    if (success) {
      setPinInput('');
      setErrorMsg('');
      setShowPinModal(false);
    } else {
      setErrorMsg('รหัส PIN ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
      setPinInput('');
    }
  };

  return (
    <header id="app-header" className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Title */}
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-sm flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
                ระบบจัดการยืมอุปกรณ์ส่วนตัว
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Asset Borrowing System
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3">
            {isAdmin ? (
              <div className="flex items-center space-x-2">
                <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                  แอดมิน (Admin Mode)
                </span>
                <button
                  id="btn-logout"
                  onClick={onLogout}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-50 text-xs font-medium transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>ออกจากระบบ</span>
                </button>
              </div>
            ) : (
              <button
                id="btn-login-trigger"
                onClick={() => {
                  setErrorMsg('');
                  setPinInput('');
                  setShowPinModal(true);
                }}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>เข้าสู่ระบบแอดมิน</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Admin Login Dialog */}
      <AnimatePresence>
        {showPinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-100 p-6 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-full mb-4">
                  <Key className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  เข้าสู่ระบบผู้ดูแลระบบ (Admin)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  กรุณากรอกรหัส PIN คีย์เวิร์ดส่วนตัว (รหัสเริ่มต้นของระบบคือ <strong className="text-indigo-600 font-semibold font-mono">1234</strong>)
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
                <div>
                  <label htmlFor="pin-input" className="block text-xs font-semibold text-slate-600 mb-1">
                    รหัสผ่าน PIN 4 หลัก
                  </label>
                  <input
                    id="pin-input"
                    type="password"
                    maxLength={4}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    placeholder="••••"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full text-center tracking-widest text-lg font-bold bg-slate-50 border border-slate-200 rounded-xl py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-300"
                    autoFocus
                  />
                </div>

                {errorMsg && (
                  <div className="flex items-center space-x-1.5 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-100">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    id="btn-login-cancel"
                    type="button"
                    onClick={() => setShowPinModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition-colors"
                  >
                    ยกเลิก
                  </button>
                  <button
                    id="btn-login-submit"
                    type="submit"
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-colors shadow-sm shadow-indigo-100"
                  >
                    ยืนยัน
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
