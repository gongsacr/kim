import { Tab } from '../App';
import { Home, MessageSquare, Star, BookOpen, Image, Lock, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  onLoginClick: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onLoginClick }: SidebarProps) {
  const { isAdmin, logout } = useAuth();

  const tabs = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'guestbook', label: '방명록', icon: MessageSquare },
    { id: 'favorites', label: '취향', icon: Star },
    { id: 'blog', label: '블로그', icon: BookOpen },
    { id: 'gallery', label: '사진첩', icon: Image },
  ];

  return (
    <div className="flex flex-col h-full p-6">
      <div className="mb-10">
        <h1 className="text-2xl font-black text-cyan-600 tracking-tighter italic">김규리의 홈피</h1>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">KIM GYURI'S HOME</p>
      </div>

      <nav className="flex-1 space-y-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-200' 
                  : 'text-gray-500 hover:bg-white hover:text-cyan-600 hover:shadow-sm'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="font-bold text-sm">{tab.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-100">
        {isAdmin ? (
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-bold text-sm">로그아웃</span>
          </button>
        ) : (
          <button
            onClick={onLoginClick}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
          >
            <Lock size={20} />
            <span className="font-bold text-sm">관리자 로그인</span>
          </button>
        )}
      </div>
    </div>
  );
}
