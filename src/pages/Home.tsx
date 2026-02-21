import { motion } from 'motion/react';
import { Heart, Music, Smile, Sun, Calendar, Instagram, Star, User } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-6 flex flex-col items-center">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden w-full max-w-xs">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-10"></div>
        
        <div className="relative mt-4 mb-4">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-200">
            <img 
              src="https://i.postimg.cc/15QqCNWX/daunlodeu.jpg" 
              alt="Profile" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-gray-800">김규리</h2>
        <p className="text-sm text-gray-500 mt-1 mb-4">@kimguuri</p>
        
        <div className="bg-gray-50 rounded-xl p-3 w-full text-sm text-gray-600 italic border border-gray-100 mb-6">
          "옥정동 로드마스터"
        </div>

        {/* Profile Details */}
        <div className="w-full space-y-4 text-left">
          {/* Birthday */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 flex-shrink-0">
              <Calendar size={16} />
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase font-bold mb-1">생일</div>
              <div className="text-sm font-medium text-gray-700">4월 4일</div>
            </div>
          </div>

          {/* MBTI */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500 flex-shrink-0">
              <Star size={16} />
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase font-bold mb-1">MBTI</div>
              <div className="text-sm font-medium text-gray-700">INFP</div>
            </div>
          </div>

          {/* Instagram */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-500 flex-shrink-0">
              <Instagram size={16} />
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase font-bold mb-1">인스타그램</div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="text-gray-400 text-xs">본계정</span> 
                  <a href="https://instagram.com/kimguuri" target="_blank" rel="noreferrer" className="hover:text-cyan-600 transition-colors">
                    @kimguuri
                  </a>
                </div>
                <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="text-gray-400 text-xs">부계정</span> 
                  <a href="https://instagram.com/1__0__0__4__" target="_blank" rel="noreferrer" className="hover:text-cyan-600 transition-colors">
                    @1__0__0__4__
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Favorite Quote */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
              <Heart size={16} />
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase font-bold mb-1">좋아하는 문장</div>
              <div className="text-sm font-medium text-gray-700 italic">
                "영화는 골라서 꾸는 꿈이다"
              </div>
            </div>
          </div>

          {/* Hobbies */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-500 flex-shrink-0">
              <Smile size={16} />
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase font-bold mb-1">취미</div>
              <div className="flex flex-wrap gap-2">
                {['배구', '독서', '다꾸'].map((hobby) => (
                  <span key={hobby} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
