import { useState, useEffect, FormEvent } from 'react';
import { Send, User, Trash2, AlertTriangle, X, Check } from 'lucide-react';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseInitialized } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

interface GuestbookMessage {
  id: string;
  name: string;
  text: string;
  createdAt: any;
  avatarSeed: string; // To keep the avatar consistent
}

export default function GuestbookPage() {
  const { isAdmin } = useAuth();
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseInitialized || !db) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GuestbookMessage[];
      setMessages(newMessages);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (!isFirebaseInitialized) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Firebase Setup Required</h3>
        <p className="text-sm text-gray-500 max-w-xs">
          Please configure your Firebase credentials in the secrets panel to use the guestbook.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !nickname.trim()) {
      alert('닉네임과 내용을 모두 입력해주세요.');
      return;
    }
    
    try {
      await addDoc(collection(db, 'guestbook'), {
        name: nickname,
        text: inputText,
        createdAt: serverTimestamp(),
        avatarSeed: Math.random().toString(36).substring(7)
      });
      setInputText('');
      // Keep nickname for convenience
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("방명록 작성 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'guestbook', id));
      setDeletingId(null);
    } catch (error) {
      console.error("Error removing document: ", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Input Area */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 sticky top-0 z-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임"
              className="w-32 h-10 bg-gray-50 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-100 transition-all font-bold"
              maxLength={10}
            />
          </div>
          
          <div className="relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="방명록을 남겨주세요..."
              className="w-full h-10 bg-gray-50 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-100 transition-all pr-10"
            />
            <button 
              type="submit"
              className="absolute right-1 top-1 p-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors shadow-sm"
            >
              <Send size={14} />
            </button>
          </div>
        </form>
      </div>

      {/* Message List */}
      <div className="space-y-4 pb-4">
        {loading ? (
          <div className="text-center py-10 text-gray-400">로딩 중...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10 text-gray-400">첫 번째 방명록을 남겨보세요!</div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-bold text-gray-800 truncate">{msg.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-mono whitespace-nowrap">{formatDate(msg.createdAt)}</span>
                      {isAdmin && (
                        <div className="flex items-center">
                          <AnimatePresence mode="wait">
                            {deletingId === msg.id ? (
                              <motion.div
                                key="confirm"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="flex items-center gap-1 bg-red-50 p-0.5 rounded-lg ml-2"
                              >
                                <button
                                  onClick={() => handleDelete(msg.id)}
                                  className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                  title="삭제 확인"
                                >
                                  <Check size={12} />
                                </button>
                                <button
                                  onClick={() => setDeletingId(null)}
                                  className="p-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 transition-colors"
                                  title="취소"
                                >
                                  <X size={12} />
                                </button>
                              </motion.div>
                            ) : (
                              <motion.button 
                                key="delete"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setDeletingId(msg.id)}
                                className="text-gray-300 hover:text-red-500 transition-colors ml-2"
                              >
                                <Trash2 size={14} />
                              </motion.button>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed break-words whitespace-pre-wrap">{msg.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
