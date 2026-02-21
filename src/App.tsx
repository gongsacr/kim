import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, User, Image, MessageSquare, BookOpen, Star } from 'lucide-react';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from './firebase';

// Components
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Sidebar from './components/Sidebar';
import LoginModal from './components/LoginModal';
import HomePage from './pages/Home';
import GalleryPage from './pages/Gallery';
import GuestbookPage from './pages/Guestbook';
import BlogPage from './pages/Blog';
import FavoritesPage from './pages/Favorites';

// Context
import { AuthProvider } from './contexts/AuthContext';

export type Tab = 'home' | 'blog' | 'favorites' | 'gallery' | 'guestbook';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const incrementVisitor = async () => {
      if (!db) return;
      
      // Check session storage to prevent duplicate counts on refresh
      if (sessionStorage.getItem('visited')) return;
      
      try {
        const statsRef = doc(db, 'visitors', 'stats');
        const statsSnap = await getDoc(statsRef);
        
        if (statsSnap.exists()) {
          await updateDoc(statsRef, {
            count: increment(1)
          });
        } else {
          await setDoc(statsRef, {
            count: 1
          });
        }
        
        sessionStorage.setItem('visited', 'true');
      } catch (error) {
        console.error("Error updating visitor count:", error);
      }
    };
    
    incrementVisitor();
  }, []);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'home': return '메인';
      case 'blog': return '블로그';
      case 'favorites': return '취향';
      case 'gallery': return '사진첩';
      case 'guestbook': return '방명록';
      default: return '';
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-100 flex items-center justify-center font-sans text-gray-800 p-0 sm:p-4 lg:p-8">
        {/* Main Responsive Container */}
        <div className="w-full max-w-md lg:max-w-6xl h-[100dvh] lg:h-[850px] bg-white shadow-2xl overflow-hidden flex flex-col lg:flex-row relative sm:rounded-3xl lg:border-8 border-gray-800">
          
          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex w-72 bg-slate-50 border-r border-gray-100 flex-col flex-shrink-0">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLoginClick={() => setIsLoginModalOpen(true)} />
          </aside>

          {/* Main Content Area Wrapper */}
          <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
            
            {/* Mobile Header */}
            <div className="lg:hidden flex-shrink-0">
              <Header activeTab={activeTab} onLoginClick={() => setIsLoginModalOpen(true)} />
            </div>

            {/* Desktop Header / Title Bar */}
            <div className="hidden lg:flex items-center justify-between px-8 py-6 bg-white border-b border-gray-50 flex-shrink-0">
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">
                {getTabTitle()}
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-50 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-cyan-700 uppercase tracking-widest">Live Session</span>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <main className="flex-1 overflow-y-auto bg-slate-50/50 relative scrollbar-hide">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="min-h-full p-4 lg:p-8"
                >
                  {activeTab === 'home' && <HomePage />}
                  {activeTab === 'blog' && <BlogPage />}
                  {activeTab === 'favorites' && <FavoritesPage />}
                  {activeTab === 'gallery' && <GalleryPage />}
                  {activeTab === 'guestbook' && <GuestbookPage />}
                </motion.div>
              </AnimatePresence>
            </main>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden flex-shrink-0">
              <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          </div>
          
          {/* Login Modal */}
          <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
          
        </div>
      </div>
    </AuthProvider>
  );
}
