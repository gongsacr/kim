import { motion } from 'motion/react';
import { Film, Book, Tv, User, Gamepad2 } from 'lucide-react';

export default function FavoritesPage() {
  const movies = [
    { title: '나는 내일 어제의\n너와 만난다', img: 'https://i.postimg.cc/tRSWzY3p/c.webp', comment: '너무슬픔 엉엉슨' },
    { title: '너와 100번째 사랑', img: 'https://i.postimg.cc/J7XPJKCn/neo.webp', comment: '그냥 거기서 계속 살아' },
    { title: '어바웃타임', img: 'https://i.postimg.cc/T27gcpVG/d.webp', comment: '어떠한 순간을\n다시 살게 된다면' },
    { title: '올드보이', img: 'https://i.postimg.cc/y6QcTkmq/b.webp', comment: '입을 함부로 놀리지 말자' },
    { title: '패밀리맨', img: 'https://i.postimg.cc/8cS1DPGQ/1.webp', comment: '톰행크스 영화는 왜 다 재밌을까' },
    { title: '포레스트 검프', img: 'https://i.postimg.cc/fW2mvJcQ/e.webp', comment: '한 번은 꼭 보길 추천' },
    { title: '플립', img: 'https://i.postimg.cc/Qd6ndtc1/peul.webp', comment: '브라이스는 대가리 박자' },
  ];

  const animes = [
    { title: '귀를 기울이면', img: 'https://i.postimg.cc/vBPRRz3w/gwi.webp', comment: '별까지 손이 닿도록' },
    { title: '나만이 없는 거리', img: 'https://i.postimg.cc/h4yT0fLJ/나만이_없는_거리.webp', comment: 'OST goat' },
    { title: '날씨의 아이', img: 'https://i.postimg.cc/MKnR3q5d/날씨의_아이.webp', comment: '네가 준 용기라서 널 위해 쓰고 싶어' },
    { title: '눈동자 속의 암살자', img: 'https://i.postimg.cc/vBK8sbZ3/ko.webp', comment: '좋아하니까!!!(쨍그랑)' },
    { title: '닥터스톤', img: 'https://i.postimg.cc/br75qSj2/dag.webp', comment: '진짜광기' },
    { title: '데스노트', img: 'https://i.postimg.cc/BQRFdk7h/데스노트.webp', comment: '계획대로' },
    { title: '목소리의 형태', img: 'https://i.postimg.cc/Qxv7RwYv/목소리의_형태_결과.webp', comment: 'す ... き!\nつき?' },
    { title: '몬스터', img: 'https://i.postimg.cc/WbxZQCYH/몬스터.webp', comment: '요한...!' },
    { title: '시간을 달리는 소녀', img: 'https://i.postimg.cc/y6QcTkm6/f.webp', comment: '미래에서 기다릴게' },
    { title: '암흑마왕 대추적', img: 'https://i.postimg.cc/xjxMPcvC/g.webp', comment: '당신 같은 남자를\n기다려왔다우' },
    { title: '원펀맨', img: 'https://i.postimg.cc/vmPbbh2t/won.webp', comment: '최강의 남자' },
    { title: '초속 5센티미터', img: 'https://i.postimg.cc/c19wcrQ2/a.webp', comment: 'こんなとこにいる\nはずもないのに' },
    { title: '카구야님은\n고백받고 싶어', img: 'https://i.postimg.cc/htxmgsHt/카구야님.webp', comment: '후지와라 치카;;' },
    { title: '캐릭캐릭 체인지', img: 'https://i.postimg.cc/2SvWmGPL/캐릭캐릭.webp', comment: '아무토마가 진짜다' },
    { title: '하이큐', img: 'https://i.postimg.cc/3wTvwpTk/하이큐.webp', comment: '재능은 꽃피우는 것 센스는 갈고 닦는 것' },
    { title: 'Re:제로', img: 'https://i.postimg.cc/TYBbZFNN/리제로.webp', comment: '렘이 누구야?' },
  ];

  const books = [
    { title: '가재가 노래하는 곳', img: 'https://i.postimg.cc/m2PMpBjZ/가재가_노래하는_곳.webp', comment: '스크랩북에 붙인 사진이었다' },
    { title: '너의 이야기', img: 'https://i.postimg.cc/jdDN3tcx/너의_이야기.webp', comment: 'VR이라도 사랑하고싶어' },
    { title: '명탐정의 규칙', img: 'https://i.postimg.cc/4Njcrq2p/명탐정의_규칙_결과.webp', comment: '김규리선정 "이 미스터리가 재밌다" 2위' },
    { title: '바깥은 여름', img: 'https://i.postimg.cc/XqbV37W3/2.webp', comment: '뜻밖의 표정' },
    { title: '세상에서\n가장 약한 요괴', img: 'https://i.postimg.cc/xTBmWhFV/세상에서_가장_약한_요괴_결과.webp', comment: '푸르스마, 푸르스마나스' },
    { title: '스토리셀러', img: 'https://i.postimg.cc/DyRGtHYk/스토리셀러_결과.webp', comment: '그 여자와 그 남자의 사랑법' },
  ];

  const characters = [
    { title: '다나카 간다무', img: 'https://i.postimg.cc/1zYG1cyj/haem1.webp', comment: '우리 서로이웃해요~' },
    { title: '마이조노 사야카', img: 'https://i.postimg.cc/0NRdnVHc/1c.webp', comment: 'my마이조노' },
    { title: '백인호', img: 'https://i.postimg.cc/GmNP81NC/b3-(1).webp', comment: '난너밖에없어...' },
    { title: '사이하라 슈이치', img: 'https://i.postimg.cc/sxNWfNjh/4.webp', comment: '이런 사이하라랑 시간을 보낼까?' },
    { title: '세라', img: 'https://i.imghippo.com/files/zTO9093CXA.webp', comment: '천사...' },
    { title: '시로가네 미유키', img: 'https://i.postimg.cc/2yKWjKkn/3.webp', comment: '세토카이쵸' },
    { title: '엄', img: 'https://i.imghippo.com/files/xOJW8557YC.webp', comment: '엄' },
    { title: '이루마 미우', img: 'https://i.postimg.cc/Dzkd6xYp/1d.webp', comment: '토끼모양사과' },
    { title: '체인소', img: 'https://i.postimg.cc/J7gB7zVZ/ㅊ.webp', comment: 'so sexy' },
    { title: '카게야마 토비오', img: 'https://i.postimg.cc/FH4GTZKV/nam1-(1).webp', comment: '결혼하자' },
    { title: '파워', img: 'https://i.imghippo.com/files/NM3933Ow.webp', comment: '와시노나와' },
    { title: 'L', img: 'https://i.postimg.cc/76gxf9F7/3.webp', comment: '저는 XL입니다' },
  ];

  const games = [
    { title: '고군분투', img: 'https://i.postimg.cc/c4DkhC6N/고3_1.webp', comment: '손에 땀이;' },
    { title: '단간론파', img: 'https://i.postimg.cc/kgLmjfD7/dan4.webp', comment: '소레와 치가우조' },
    { title: '루미큐브', img: 'https://i.postimg.cc/bdXLc09Y/lu1.webp', comment: '없으면넘겨잇' },
    { title: '마인크래프트', img: 'https://i.postimg.cc/mZqFZgf9/마.webp', comment: '아 멀미나' },
    { title: '뱀파이어 서바이벌', img: 'https://i.imghippo.com/files/DLiB8688BVI.webp', comment: '뱀서매직' },
    { title: '좀비고', img: 'https://i.postimg.cc/xdS0f6QH/nam1.webp', comment: '즐겜해요ㅎㅎ' },
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
          <div className="h-px bg-gray-100"></div>
          <Section title="게임" icon={Gamepad2} items={games} />
        </div>
      </div>
    </div>
  );
}
