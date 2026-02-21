import { motion } from 'motion/react';
import { Film, Book, Star, Tv, User } from 'lucide-react';

export default function FavoritesPage() {
  const movies = [
    { title: '초속 5센티미터', img: 'https://i.postimg.cc/c19wcrQ2/a.webp', comment: 'こんなとこにいる\nはずもないのに' },
    { title: '올드보이', img: 'https://i.postimg.cc/y6QcTkmq/b.webp', comment: '투머치토크는 오평' },
    { title: '나는 내일 어제의\n너와 만난다', img: 'https://i.postimg.cc/tRSWzY3p/c.webp', comment: '마음이 변하지 않으니까\n여기에 있는데' },
    { title: '어바웃타임', img: 'https://i.postimg.cc/T27gcpVG/d.webp', comment: '어떠한 순간을\n다시 살게 된다면' },
    { title: '포레스트 검프', img: 'https://i.postimg.cc/fW2mvJcQ/e.webp', comment: 'Run, Forrest, Run!' },
    { title: '시간을 달리는 소녀', img: 'https://i.postimg.cc/y6QcTkm6/f.webp', comment: '미래에서 기다릴게' },
    { title: '암흑마왕 대추적', img: 'https://i.postimg.cc/xjxMPcvC/g.webp', comment: '당신 같은 남자를\n기다려왔다우' },
    { title: '목소리의 형태', img: 'https://i.postimg.cc/Qxv7RwYv/목소리의_형태_결과.webp', comment: 'す ... き!\nつき?' },
    { title: '날씨의 아이', img: 'https://i.postimg.cc/MKnR3q5d/날씨의_아이.webp', comment: '네가 준 용기라서 널 위해 쓰고 싶어' },
    { title: '패밀리맨', img: 'https://i.postimg.cc/8cS1DPGQ/1.webp', comment: '가족의 소중함' },
  ];

  const animes = [
    { title: '하이큐', img: 'https://i.postimg.cc/3wTvwpTk/하이큐.webp', comment: '재능은 꽃피우는 것 센스는 갈고 닦는 것' },
    { title: '몬스터', img: 'https://i.postimg.cc/WbxZQCYH/몬스터.webp', comment: '도쿠타 텐마...' },
    { title: '데스노트', img: 'https://i.postimg.cc/BQRFdk7h/데스노트.webp', comment: '계획대로' },
    { title: '나만이 없는 거리', img: 'https://i.postimg.cc/h4yT0fLJ/나만이_없는_거리.webp', comment: '그저 아이리' },
    { title: 'Re:제로', img: 'https://i.postimg.cc/TYBbZFNN/리제로.webp', comment: '렘이 누구야?' },
    { title: '카구야님은\n고백받고 싶어', img: 'https://i.postimg.cc/htxmgsHt/카구야님.webp', comment: '스탠포드 대학에 응시해, 시노미야.' },
    { title: '캐릭캐릭 체인지', img: 'https://i.postimg.cc/2SvWmGPL/캐릭캐릭.webp', comment: '나의 마음을 UN LOCK!' },
  ];

  const books = [
    { title: '가재가 노래하는 곳', img: 'https://i.postimg.cc/m2PMpBjZ/가재가_노래하는_곳.webp', comment: '그녀의 비밀이 숨겨져 있는 곳' },
    { title: '명탐정의 규칙', img: 'https://i.postimg.cc/4Njcrq2p/명탐정의_규칙_결과.webp', comment: '김규리선정 "이 미스터리가 재밌다" 2위' },
    { title: '스토리셀러', img: 'https://i.postimg.cc/DyRGtHYk/스토리셀러_결과.webp', comment: '그 여자와 그 남자의 사랑법' },
    { title: '너의 이야기', img: 'https://i.postimg.cc/jdDN3tcx/너의_이야기.webp', comment: 'VR이라도 사랑하고싶어' },
    { title: '세상에서\n가장 약한 요괴', img: 'https://i.postimg.cc/xTBmWhFV/세상에서_가장_약한_요괴_결과.webp', comment: '푸르스마, 푸르스마나스' },
    { title: '바깥은 여름', img: 'https://i.postimg.cc/XqbV37W3/2.webp', comment: '뜻밖의 표정' },
  ];

  const characters = [
    { title: '카게야마 토비오', img: 'https://i.postimg.cc/XJwVpLRZ/2.webp', comment: '결혼하자' },
    { title: '체인소 덴지', img: 'https://i.postimg.cc/QN41qHpy/2.webp', comment: '체인소사마 사이쿄!' },
    { title: '시로가네 미유키', img: 'https://i.postimg.cc/2yKWjKkn/3.webp', comment: '다크서클금발벽안' },
    { title: '사이하라 슈이치', img: 'https://i.postimg.cc/sxNWfNjh/4.webp', comment: '소레와치가우요' },
    { title: '엘', img: 'https://i.postimg.cc/76gxf9F7/3.webp', comment: '야가미쿤~' },
    { title: '다나카 간다무', img: 'https://i.postimg.cc/63d9yckW/1.webp', comment: '두근두근사육일지' },
    { title: '파워', img: 'https://i.postimg.cc/kGpSMpJN/8.webp', comment: '2종보통' },
    { title: '이루마 미우', img: 'https://i.postimg.cc/W3M2h8Bq/4.webp', comment: '토끼모양사과' },
    { title: '마이조노 사야카', img: 'https://i.postimg.cc/DZq2869J/5.webp', comment: '초고교급 쿨뷰티미녀' },
  ];

  const Section = ({ title, icon: Icon, items }: { title: string, icon: any, items: any[] }) => (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Icon className="text-cyan-600" size={20} />
        <h3 className="text-lg font-bold text-gray-700">{title}</h3>
      </div>
      
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group flex flex-col gap-2"
          >
            <div className="w-full aspect-[2/3] relative overflow-hidden bg-gray-100 rounded-lg shadow-sm border border-gray-100">
              <img 
                src={item.img} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-gray-800 mb-1 truncate text-center whitespace-pre-wrap leading-tight">{item.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed break-keep text-center whitespace-pre-wrap">
                {item.comment}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="space-y-12">
          <Section title="영화" icon={Film} items={movies} />
          <div className="h-px bg-gray-100"></div>
          <Section title="애니" icon={Tv} items={animes} />
          <div className="h-px bg-gray-100"></div>
          <Section title="책" icon={Book} items={books} />
          <div className="h-px bg-gray-100"></div>
          <Section title="캐릭터" icon={User} items={characters} />
        </div>
      </div>
    </div>
  );
}
