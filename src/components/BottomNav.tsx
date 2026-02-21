import { Tab } from '../App';
import { Home, User, Image, MessageSquare, BookOpen, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'guestbook', label: '방명록', icon: MessageSquare },
    { id: 'favorites', label: '취향', icon: Star },
    { id: 'blog', label: '블로그', icon: BookOpen },
    { id: 'gallery', label: '사진첩', icon: Image },
  ];

  return (
    <div className="bg-white border-t border-gray-100 px-2 py-4 pb-4 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className="relative flex flex-col items-center justify-center w-12 h-14 group"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute -top-4 w-8 h-1 bg-cyan-500 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className={`p-2 rounded-xl transition-colors duration-200 ${isActive ? 'bg-cyan-50 text-cyan-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[9px] mt-1 font-medium ${isActive ? 'text-cyan-600' : 'text-gray-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
