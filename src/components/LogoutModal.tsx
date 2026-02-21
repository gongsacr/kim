import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { X, LogOut, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function LogoutModal({ isOpen, onClose, onLogout }: LogoutModalProps) {
  const [visitorCount, setVisitorCount] = useState<number>(0);

  useEffect(() => {
    if (!isOpen || !db) return;

    const unsubscribe = onSnapshot(doc(db, 'visitors', 'stats'), (doc) => {
      if (doc.exists()) {
        setVisitorCount(doc.data().count || 0);
      }
    });

    return () => unsubscribe();
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-white w-full max-w-xs p-6 rounded-2xl shadow-xl pointer-events-auto mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2 text-red-600">
                  <LogOut size={18} />
                  로그아웃
                </h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-6 text-center">
                관리자 계정에서 로그아웃 하시겠습니까?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={onLogout}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  로그아웃
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100 flex justify-center items-center gap-2 text-xs text-gray-400">
                <Users size={14} />
                <span>Total Visitors: <span className="font-mono font-bold text-gray-600">{visitorCount.toLocaleString()}</span></span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
