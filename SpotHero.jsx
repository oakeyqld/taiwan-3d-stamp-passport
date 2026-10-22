import { useId, useState } from 'react';

/**
 * 景點主視覺：若資料有 image 則顯示實景照片，
 * 否則（或圖片載入失敗時）顯示依分類繪製的插畫風景。
 */

const SKIES = {
  nature: ['#8fd3f4', '#e6f7d9'],
  coast: ['#4fb3e8', '#d7f1fb'],
  culture: ['#f6c28b', '#fde9c8'],
  landmark: ['#9b8cf2', '#f9d1e4'],
  food: ['#1b1440', '#6b2b4a'],
};

function NatureScene() {
  return (
    <g>
      <circle cx="630" cy="110" r="42" fill="#fff7cf" />
      <polygon points="0,290 120,170 230,250 360,110 480,240 600,150 800,270 800,400 0,400" fill="#5fae6a" opacity="0.65" />
      <polygon points="360,110 334,146 350,141 362,156 376,142 388,148" fill="#ffffff" />
      <polygon points="0,340 150,225 280,315 430,205 570,325 700,235 800,310 800,400 0,400" fill="#2f7d45" />
      {[40, 110, 520, 610, 690, 760].map((x, i) => (
        <polygon key={x} points={`${x},${370 - (i % 2) * 14} ${x + 16},${330 - (i % 2) * 14} ${x + 32},${370 - (i % 2) * 14}`} fill="#1d5530" />
      ))}
      <g fill="#ffffff" opacity="0.85">
        <ellipse cx="170" cy="95" rx="60" ry="18" />
        <ellipse cx="210" cy="82" rx="38" ry="18" />
      </g>
    </g>
  );
}

function CoastScene() {
  return (
    <g>
      <circle cx="590" cy="160" r="56" fill="#fff3c2" />
      <polygon points="430,250 520,215 610,250" fill="#3f8a6a" opacity="0.7" />
      <rect y="248" width="800" height="152" fill="#1f7fb8" />
      {[270, 300, 335].map((y, i) => (
        <path key={y} d={`M0 ${y} Q 100 ${y - 10} 200 ${y} T 400 ${y} T 600 ${y} T 800 ${y}`} stroke="#ffffff" strokeOpacity={0.45 - i * 0.1} strokeWidth="4" fill="none" />
      ))}
      <path d="M0 330 Q 160 300 320 360 L 320 400 L 0 400 Z" fill="#f1d9a0" />
      <path d="M120 360 Q 130 260 175 200" stroke="#8a5a32" strokeWidth="11" fill="none" strokeLinecap="round" />
      <g fill="#249a55">
        <path d="M175 200 Q 120 170 80 210 Q 130 190 175 205 Z" />
        <path d="M175 200 Q 230 165 275 205 Q 220 190 175 205 Z" />
        <path d="M175 200 Q 160 140 115 140 Q 160 160 172 205 Z" />
        <path d="M175 200 Q 200 140 245 145 Q 195 165 178 205 Z" />
      </g>
      <circle cx="168" cy="210" r="7" fill="#6b4423" />
      <circle cx="182" cy="212" r="7" fill="#6b4423" />
    </g>
  );
}

function CultureScene() {
  return (
    <g>
      <circle cx="160" cy="110" r="40" fill="#fff4d6" />
      <polygon points="0,300 200,230 420,280 620,220 800,280 800,400 0,400" fill="#d9a46c" opacity="0.5" />
      <rect x="250" y="250" width="300" height="110" fill="#b91c1c" />
      {[275, 335, 395, 455, 515].map((x) => (
        <rect key={x} x={x} y="255" width="12" height="105" fill="#7f1d1d" />
      ))}
      <path d="M200 252 Q 230 236 260 236 L 540 236 Q 570 236 600 252 L 585 222 Q 560 228 540 220 L 260 220 Q 240 228 215 222 Z" fill="#7a1f1f" />
      <path d="M240 222 Q 270 180 400 172 Q 530 180 560 222 Z" fill="#9b2c2c" />
      <path d="M232 204 Q 250 200 262 190" stroke="#e9b44c" strokeWidth="5" fill="none" />
      <path d="M568 204 Q 550 200 538 190" stroke="#e9b44c" strokeWidth="5" fill="none" />
      <rect x="360" y="290" width="80" height="70" fill="#3b0d0d" />
      {[300, 500].map((x) => (
        <g key={x}>
          <line x1={x} y1="236" x2={x} y2="256" stroke="#3b0d0d" strokeWidth="2" />
          <ellipse cx={x} cy="270" rx="15" ry="18" fill="#ef4444" />
          <rect x={x - 8} y="250" width="16" height="4" fill="#e9b44c" />
        </g>
      ))}
      <rect y="360" width="800" height="40" fill="#c9a37a" />
    </g>
  );
}

function LandmarkScene() {
  const cabins = ['#ef4444', '#f97316', '#facc15', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];
  return (
    <g>
      <g fill="#5b3fa8" opacity="0.55">
        {[[0, 290, 70], [80, 270, 50], [140, 300, 90], [440, 280, 60], [520, 260, 80], [620, 300, 70], [700, 275, 100]].map(([x, y, w]) => (
          <rect key={x} x={x} y={y} width={w} height={400 - y} />
        ))}
      </g>
      <g fill="#4c2c8f">
        <polygon points="560,360 580,140 600,140 620,360" />
        {[170, 205, 240, 275, 310].map((y) => (
          <polygon key={y} points={`${568},${y} ${612},${y} ${618},${y + 22} ${562},${y + 22}`} fill="#6d4bc4" />
        ))}
        <rect x="586" y="95" width="8" height="48" />
      </g>
      <g transform="translate(260 215)">
        <polygon points="0,0 -60,160 -45,160 0,20 45,160 60,160" fill="#e2e8f0" />
        <circle r="110" fill="none" stroke="#ff6fae" strokeWidth="9" />
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1={-110 * Math.cos((i * Math.PI) / 4)} y1={-110 * Math.sin((i * Math.PI) / 4)} x2={110 * Math.cos((i * Math.PI) / 4)} y2={110 * Math.sin((i * Math.PI) / 4)} stroke="#ffd1e6" strokeWidth="4" />
        ))}
        {cabins.map((c, i) => {
          const a = (i / 8) * Math.PI * 2;
          return <rect key={c} x={Math.cos(a) * 110 - 13} y={Math.sin(a) * 110 - 13} width="26" height="26" rx="5" fill={c} />;
        })}
        <circle r="13" fill="#facc15" />
      </g>
      <rect y="372" width="800" height="28" fill="#3b2577" />
    </g>
  );
}

function FoodScene() {
  const bulbs = Array.from({ length: 16 }, (_, i) => i);
  return (
    <g>
      <path d="M0 90 Q 200 150 400 95 T 800 100" stroke="#3a2b55" strokeWidth="2" fill="none" />
      {bulbs.map((i) => {
        const x = 25 + i * 50;
        const y = 98 + Math.sin(i * 0.9) * 22 + 12;
        return <circle key={i} cx={x} cy={y} r="7" fill={i % 3 ? '#fde047' : '#fb923c'} opacity="0.95" />;
      })}
      {[60, 300, 540].map((x, k) => (
        <g key={x}>
          <rect x={x} y="230" width="200" height="140" fill="#2a1d3d" />
          <rect x={x + 15} y="275" width="170" height="70" fill={['#f59e0b', '#ef4444', '#facc15'][k]} opacity="0.85" />
          {[0, 1, 2, 3, 4].map((s) => (
            <rect key={s} x={x + s * 40} y="200" width="40" height="32" fill={s % 2 ? '#ffffff' : '#dc2626'} />
          ))}
          {[0, 1, 2].map((s) => (
            <path key={s} d={`M${x + 60 + s * 40} 268 q -10 -15 0 -30 q 10 -15 0 -30`} stroke="#ffffff" strokeOpacity="0.5" strokeWidth="3" fill="none" />
          ))}
        </g>
      ))}
      <rect y="370" width="800" height="30" fill="#12091f" />
    </g>
  );
}

const SCENES = { nature: NatureScene, coast: CoastScene, culture: CultureScene, landmark: LandmarkScene, food: FoodScene };

export default function SpotHero({ spot, className = '' }) {
  const [imgOk, setImgOk] = useState(Boolean(spot.image));
  const uid = useId().replace(/:/g, '');
  const sky = SKIES[spot.category] || SKIES.nature;
  const Scene = SCENES[spot.category] || NatureScene;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={sky[0]} />
            <stop offset="1" stopColor={sky[1]} />
          </linearGradient>
        </defs>
        <rect width="800" height="400" fill={`url(#sky-${uid})`} />
        <Scene />
      </svg>
      {imgOk && (
        <img
          src={spot.image}
          alt={spot.name}
          loading="lazy"
          onError={() => setImgOk(false)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
    </div>
  );
}
