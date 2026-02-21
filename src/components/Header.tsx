import { useState } from 'react';
import { Tab } from '../App';
import { Bell, Menu, Lock, Unlock, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LogoutModal from './LogoutModal';

interface HeaderProps {
  activeTab: Tab;
  onLoginClick: () => void;
}

export default function Header({ activeTab, onLoginClick }: HeaderProps) {
  const { isAdmin, logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const getTitle = () => {
    switch (activeTab) {
      case 'home': return '메인';
      case 'blog': return '블로그';
      case 'favorites': return '취향';
      case 'gallery': return '사진첩';
      case 'guestbook': return '방명록';
      default: return '미니홈피';
    }
  };

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      <header className="bg-white px-5 py-4 flex justify-between items-center border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <h1 className="font-bold text-lg text-gray-800 tracking-tight font-mono">
            {getTitle()}
          </h1>
        </div>
        
        <div className="flex gap-3 items-center">
          {isAdmin ? (
            <button 
              onClick={() => setIsLogoutModalOpen(true)}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          ) : (
            <button 
              onClick={onLoginClick}
              className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-full transition-colors"
              title="Admin Login"
            >
              <Lock size={20} />
            </button>
          )}
        </div>
      </header>

      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
        onLogout={handleLogout} 
      />
    </>
  );
}
