import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Bot, Clock, MapPin, MountainSnow, RotateCcw, ScrollText, Send, Sparkles, Star, Stamp, UtensilsCrossed, X } from 'lucide-react';
import SpotHero from './SpotHero';
import Seal from './Seal';
import CategoryIcon from './CategoryIcon';
import { CATEGORIES, REGION_LABEL } from './spotsData';
import { playStampSound, primeAudio } from './sound';

export function formatDateTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function fireConfetti(el) {
  const r = el?.getBoundingClientRect();
  const origin = r
    ? { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight }
    : { x: 0.5, y: 0.5 };
  const colors = ['#c9252c', '#e8cf93', '#c9a35a', '#1f3d2b', '#ffffff', '#f97316'];
  confetti({ particleCount: 90, spread: 80, startVelocity: 36, origin, colors, scalar: 0.9, zIndex: 9999, disableForReducedMotion: true });
  setTimeout(() => {
    confetti({ particleCount: 55, angle: 60, spread: 60, origin: { x: 0, y: 0.85 }, colors, zIndex: 9999, disableForReducedMotion: true });
    confetti({ particleCount: 55, angle: 120, spread: 60, origin: { x: 1, y: 0.85 }, colors, zIndex: 9999, disableForReducedMotion: true });
  }, 160);
}

/** 傳統木製印章 */
function WoodenStamp() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[14px] z-20 flex justify-center">
      <div className="flex origin-bottom animate-stamp-drop flex-col items-center drop-shadow-[0_18px_16px_rgba(0,0,0,0.35)]">
        <div className="h-12 w-12 rounded-full bg-[radial-gradient(circle_at_35%_30%,#d29a62,#7a4520_70%)]" />
        <div className="-mt-1 h-10 w-7 rounded-b-md bg-gradient-to-r from-[#6b3a17] via-[#a46a3a] to-[#6b3a17]" />
        <div className="h-12 w-40 rounded-xl bg-[repeating-linear-gradient(90deg,#8a5428_0_6px,#a46a3a_6px_11px,#b77a45_11px_15px)] shadow-lg ring-1 ring-black/25" />
        <div className="h-3 w-[150px] rounded-b-md bg-gradient-to-b from-vermilion-600 to-vermilion-800" />
      </div>
    </div>
  );
}

function InfoBlock({ icon: Icon, title, children, className = '' }) {
  return (
    <div className={`rounded-2xl bg-white p-4 ring-1 ring-ricedeep ${className}`}>
      <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-passport-800">
        <Icon size={16} className="text-passport-gold" aria-hidden="true" />
        {title}
      </h3>
      <div className="text-[15px] leading-relaxed text-slate-700">{children}</div>
    </div>
  );
}

function Rating({ value }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex" aria-label={`評分 ${value} / 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} size={18} className={value >= i - 0.25 ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} aria-hidden="true" />
        ))}
      </div>
      <span className="font-bold text-slate-800">{value.toFixed(1)}</span>
      <span className="text-sm text-slate-500">/ 5</span>
    </div>
  );
}

function GeminiGuideCard({ spot }) {
  const reply = `想去「${spot.name}」嗎？建議${spot.bestTime.split('，')[0]}出發。先到「${spot.highlights[0]}」，再把「${spot.highlights[1]}」排進行程。逛累了就去吃${spot.foods[0]}，在地人都這樣安排！`;
  const prompts = ['兩小時怎麼逛？', '附近還有什麼？', '雨天備案'];
  return (
    <section className="rounded-3xl bg-gradient-to-br from-[#4285f4] via-[#9b72cb] to-[#d96570] p-[1.5px]">
      <div className="rounded-[calc(1.5rem-1.5px)] bg-white p-4 md:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 font-bold text-slate-800">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#4285f4] to-[#d96570] text-white">
              <Sparkles size={16} aria-hidden="true" />
            </span>
            Gemini AI 在地導遊
          </h3>
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">介面展示，未接 API</span>
        </div>
        <div className="flex gap-2.5">
          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500">
            <Bot size={15} aria-hidden="true" />
          </span>
          <p className="rounded-2xl rounded-tl-sm bg-slate-50 px-4 py-3 text-[15px] leading-relaxed text-slate-700">{reply}</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {prompts.map((p) => (
            <button key={p} type="button" disabled className="cursor-not-allowed rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-400">
              {p}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-4 pr-1.5">
          <input
            disabled
            aria-label="詢問 AI 導遊（展示用，未啟用）"
            placeholder={`問問 ${spot.short} 的私房玩法…`}
            className="min-w-0 flex-1 cursor-not-allowed bg-transparent text-sm text-slate-400 outline-none placeholder:text-slate-400"
          />
          <button type="button" disabled aria-label="送出（未啟用）" className="grid h-8 w-8 cursor-not-allowed place-items-center rounded-full bg-slate-200 text-slate-400">
            <Send size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default function StampModal({ spot, stampedAt, onStamp, onReset, onClose }) {
  const [phase, setPhase] = useState('idle'); // idle | stamping
  const [justStamped, setJustStamped] = useState(false);
  const [shake, setShake] = useState(false);
  const padRef = useRef(null);
  const timers = useRef([]);
  const collected = Boolean(stampedAt);
  const cat = CATEGORIES[spot.category];

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    setPhase('idle');
    setJustStamped(false);
  }, [spot.id]);
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleStamp = () => {
    if (phase === 'stamping' || collected) return;
    primeAudio();
    setPhase('stamping');
    timers.current.push(
      setTimeout(() => {
        playStampSound();
        setShake(true);
        setJustStamped(true);
        onStamp(spot);
        fireConfetti(padRef.current);
        if (navigator.vibrate) navigator.vibrate(35);
      }, 880),
      setTimeout(() => setShake(false), 1240),
      setTimeout(() => setPhase('idle'), 1400),
    );
  };

  const handleReset = () => {
    if (window.confirm(`確定要重置「${spot.name}」的紀念章嗎？`)) {
      setJustStamped(false);
      onReset(spot);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center md:items-center md:p-6" role="dialog" aria-modal="true" aria-label={spot.name}>
      <div className="absolute inset-0 animate-fade-in bg-passport-900/60 backdrop-blur-sm" onClick={onClose} />
      <article className="relative flex max-h-[94dvh] w-full max-w-3xl animate-pop-in flex-col overflow-hidden rounded-t-[28px] bg-rice shadow-2xl md:rounded-[28px]">
        <div className="overflow-y-auto overscroll-contain">
          {/* 景點主視覺 */}
          <div className="relative">
            <SpotHero spot={spot} className="h-56 md:h-72" />
            <button
              type="button"
              onClick={onClose}
              aria-label="關閉"
              className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-black/35 text-white backdrop-blur transition hover:bg-black/55"
            >
              <X size={20} />
            </button>
            <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-7">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-bold">
                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1" style={{ background: cat.color }}>
                  <CategoryIcon category={spot.category} size={13} aria-hidden="true" />
                  {cat.label}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 backdrop-blur">
                  <MapPin size={12} aria-hidden="true" />
                  {REGION_LABEL[spot.region]}／{spot.county}
                </span>
                <span className="rounded-full bg-black/30 px-2.5 py-1 tracking-wide backdrop-blur">{spot.code}</span>
              </div>
              <h2 className="font-serif text-3xl font-black drop-shadow md:text-[2.6rem] md:leading-tight">{spot.name}</h2>
              <p className="mt-0.5 text-sm text-white/80">{spot.nameEn}</p>
            </div>
          </div>

          <div className="space-y-5 p-5 md:p-7">
            <p className="font-serif text-lg leading-relaxed text-passport-800">{spot.description}</p>

            {/* 蓋章互動區 */}
            <section
              className={`rice-paper relative rounded-3xl border-2 border-dashed border-vermilion-200 p-5 ${shake ? 'animate-shake' : ''}`}
              aria-live="polite"
            >
              <div className="flex flex-col items-center gap-5 sm:flex-row">
                <div ref={padRef} className="relative grid h-44 w-44 shrink-0 place-items-center rounded-2xl bg-[#fffaf0] shadow-inner ring-1 ring-amber-900/10">
                  {collected ? (
                    <div style={{ transform: 'rotate(-6deg)' }}>
                      <div className={justStamped ? 'animate-ink' : ''}>
                        <Seal spot={spot} size={148} />
                      </div>
                    </div>
                  ) : (
                    <div className="grid h-36 w-36 place-items-center rounded-xl border-2 border-dashed border-vermilion-200 text-center text-sm font-bold leading-6 text-vermilion-400/70">
                      蓋章處
                    </div>
                  )}
                  {phase === 'stamping' && <WoodenStamp />}
                </div>

                <div className="flex-1 text-center sm:text-left">
                  {collected ? (
                    <>
                      <p className="font-serif text-2xl font-black tracking-wider text-vermilion-700">【 已收集此章 】</p>
                      <dl className="mt-3 space-y-1 text-[15px] text-slate-700">
                        <div className="flex justify-center gap-2 sm:justify-start">
                          <dt className="text-slate-500">紀念章編號</dt>
                          <dd className="font-bold tracking-wide">{spot.code}</dd>
                        </div>
                        <div className="flex justify-center gap-2 sm:justify-start">
                          <dt className="text-slate-500">蓋章時間</dt>
                          <dd className="font-bold">{formatDateTime(stampedAt)}</dd>
                        </div>
                      </dl>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-3.5 py-1.5 text-sm text-slate-600 transition hover:border-vermilion-400 hover:text-vermilion-700"
                      >
                        <RotateCcw size={14} aria-hidden="true" />
                        誤按了？重置此章
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="font-serif text-xl font-bold text-passport-800">這一頁還空著</p>
                      <p className="mt-1 text-[15px] leading-relaxed text-slate-600">蓋下{spot.short}專屬的朱紅紀念章，收進你的集章冊。</p>
                      <button
                        type="button"
                        onClick={handleStamp}
                        disabled={phase === 'stamping'}
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-vermilion-600 px-6 py-3 font-bold text-white shadow-lg shadow-vermilion-700/30 transition hover:bg-vermilion-700 active:scale-95 disabled:cursor-wait disabled:opacity-80"
                      >
                        <Stamp size={18} aria-hidden="true" />
                        {phase === 'stamping' ? '蓋章中…' : '立即蓋上紀念章'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* 詳細導覽資訊 */}
            <section className="grid gap-3 md:grid-cols-2">
              <InfoBlock icon={Sparkles} title="必訪亮點" className="md:col-span-2">
                <ul className="space-y-1.5">
                  {spot.highlights.map((h) => (
                    <li key={h} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-vermilion-500" aria-hidden="true" />
                      {h}
                    </li>
                  ))}
                </ul>
              </InfoBlock>
              <InfoBlock icon={Clock} title="最佳參觀時機">{spot.bestTime}</InfoBlock>
              <InfoBlock icon={MountainSnow} title="海拔高度">{spot.altitude}</InfoBlock>
              <InfoBlock icon={ScrollText} title="歷史背景" className="md:col-span-2">
                {spot.history}
              </InfoBlock>
              <InfoBlock icon={Star} title="旅客評分">
                <Rating value={spot.rating} />
              </InfoBlock>
              <InfoBlock icon={UtensilsCrossed} title="在地內行推薦美食">
                <div className="flex flex-wrap gap-2">
                  {spot.foods.map((f) => (
                    <span key={f} className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-900 ring-1 ring-amber-200">
                      {f}
                    </span>
                  ))}
                </div>
              </InfoBlock>
            </section>

            <GeminiGuideCard spot={spot} />
          </div>
        </div>
      </article>
    </div>
  );
}
