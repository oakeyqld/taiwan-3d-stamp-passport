import { useMemo, useState } from 'react';
import { Award, Lock, Route, Trash2, X } from 'lucide-react';
import Seal from './Seal';
import CategoryIcon from './CategoryIcon';
import { CATEGORIES, REGIONS, SORTED_SPOTS, SPOTS, TOTAL_SPOTS, countStamps, getNextRank, getRank } from './spotsData';
import { formatDateTime } from './StampModal';

export default function PassportView({ stamps, explorer, onExplorerChange, onOpenSpot, onClose, onOpenCertificate, onOpenItinerary, onResetAll }) {
  const [region, setRegion] = useState('all');
  const count = countStamps(stamps);
  const pct = Math.round((count / TOTAL_SPOTS) * 100);
  const rank = getRank(count);
  const next = getNextRank(count);

  const list = useMemo(() => SORTED_SPOTS.filter((s) => region === 'all' || s.region === region), [region]);
  const regionStats = useMemo(
    () =>
      REGIONS.slice(1).map((r) => {
        const all = SPOTS.filter((s) => s.region === r.id);
        return { ...r, total: all.length, got: all.filter((s) => stamps[s.id]).length };
      }),
    [stamps],
  );

  return (
    <div className="fixed inset-0 z-40 flex justify-end" role="dialog" aria-modal="true" aria-label="觀光集章冊">
      <div className="absolute inset-0 animate-fade-in bg-passport-900/50 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-3xl animate-slide-in-right flex-col overflow-hidden bg-rice shadow-2xl">
        {/* 護照封面 */}
        <header className="relative shrink-0 overflow-hidden bg-passport-800 px-5 pb-5 pt-5 text-passport-goldLight md:px-7">
          <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full border-[18px] border-passport-gold/10" />
          <div className="pointer-events-none absolute -right-2 top-6 h-32 w-32 rounded-full border-4 border-passport-gold/15" />
          <div className="relative flex items-start justify-between gap-3">
            <div>
              <p className="text-xs tracking-[0.3em] text-passport-gold">TAIWAN STAMP PASSPORT</p>
              <h2 className="mt-1 font-serif text-3xl font-black text-passport-goldLight">觀光集章冊</h2>
            </div>
            <button type="button" onClick={onClose} aria-label="關閉集章冊" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-passport-goldLight transition hover:bg-white/20">
              <X size={20} />
            </button>
          </div>

          <div className="relative mt-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <label className="text-xs text-passport-gold" htmlFor="explorer-name">
                持有人
              </label>
              <input
                id="explorer-name"
                value={explorer}
                onChange={(e) => onExplorerChange(e.target.value.slice(0, 16))}
                placeholder="輸入你的名字"
                className="mt-1 block w-full max-w-xs border-b border-passport-gold/50 bg-transparent pb-1 font-serif text-xl font-bold text-white outline-none placeholder:text-passport-goldLight/40 focus:border-passport-goldLight"
              />
              <div className="mt-4 flex items-center gap-3">
                <span className="text-3xl" aria-hidden="true">
                  {rank.emoji}
                </span>
                <div>
                  <p className="font-serif text-xl font-black text-white">{rank.title}</p>
                  <p className="text-sm text-passport-goldLight/80">
                    {next ? `再收集 ${next.min - count} 枚，晉升「${next.title}」` : '已集滿全台 100 枚紀念章'}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-left md:text-right">
              <p className="font-serif text-5xl font-black leading-none text-white">
                {count}
                <span className="text-2xl text-passport-gold"> / {TOTAL_SPOTS}</span>
              </p>
              <p className="mt-1 text-sm text-passport-goldLight/80">收集進度 {pct}%</p>
            </div>
          </div>

          <div className="relative mt-4 h-2.5 overflow-hidden rounded-full bg-black/30" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-gradient-to-r from-passport-gold to-vermilion-500 transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>

          <div className="relative mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={onOpenItinerary} className="inline-flex items-center gap-1.5 rounded-full bg-passport-gold px-4 py-2 text-sm font-bold text-passport-900 transition hover:bg-passport-goldLight">
              <Route size={16} aria-hidden="true" />
              規劃環島路線
            </button>
            <button type="button" onClick={onOpenCertificate} className="inline-flex items-center gap-1.5 rounded-full border border-passport-gold/60 px-4 py-2 text-sm font-bold text-passport-goldLight transition hover:bg-white/10">
              <Award size={16} aria-hidden="true" />
              查看成就證書
            </button>
            {count > 0 && (
              <button
                type="button"
                onClick={() => window.confirm('確定要清除全部紀念章嗎？此動作無法復原。') && onResetAll()}
                className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-passport-goldLight/70 transition hover:text-white"
              >
                <Trash2 size={15} aria-hidden="true" />
                清除全部
              </button>
            )}
          </div>
        </header>

        {/* 區域進度 + 分頁 */}
        <nav className="scrollbar-none flex shrink-0 gap-2 overflow-x-auto border-b border-ricedeep px-5 py-3 md:px-7" aria-label="區域篩選">
          <TabButton active={region === 'all'} onClick={() => setRegion('all')} label="全部" got={count} total={TOTAL_SPOTS} />
          {regionStats.map((r) => (
            <TabButton key={r.id} active={region === r.id} onClick={() => setRegion(r.id)} label={r.label} got={r.got} total={r.total} />
          ))}
        </nav>

        {/* 章戳網格 */}
        <div className="rice-paper flex-1 overflow-y-auto overscroll-contain px-4 py-5 md:px-7">
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {list.map((spot) => {
              const at = stamps[spot.id];
              return (
                <li key={spot.id}>
                  <button
                    type="button"
                    onClick={() => onOpenSpot(spot)}
                    className={`group flex w-full flex-col items-center rounded-2xl p-2 text-center transition ${
                      at ? 'bg-white/70 hover:bg-white' : 'hover:bg-white/50'
                    }`}
                  >
                    <div className="relative grid aspect-square w-full place-items-center">
                      {at ? (
                        <div style={{ transform: `rotate(${(spot.code.charCodeAt(7) % 9) - 5}deg)` }}>
                          <Seal spot={spot} size={96} rough={false} className="h-auto w-full max-w-[96px]" />
                        </div>
                      ) : (
                        <div className="grid aspect-square w-[82%] place-items-center rounded-2xl border-2 border-dashed border-slate-300/80 text-slate-400 transition group-hover:border-passport-gold">
                          <div className="flex flex-col items-center gap-1">
                            <CategoryIcon category={spot.category} size={20} style={{ color: CATEGORIES[spot.category].color, opacity: 0.45 }} aria-hidden="true" />
                            <Lock size={13} aria-hidden="true" />
                          </div>
                        </div>
                      )}
                    </div>
                    <p className={`mt-1 line-clamp-1 text-[13px] font-bold ${at ? 'text-slate-800' : 'text-slate-500'}`}>{spot.name}</p>
                    <p className="text-[11px] tracking-wide text-slate-400">{at ? formatDateTime(at).slice(0, 10) : spot.code}</p>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </div>
  );
}

function TabButton({ active, onClick, label, got, total }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-bold transition ${
        active ? 'bg-passport-800 text-passport-goldLight' : 'bg-white text-slate-600 ring-1 ring-ricedeep hover:bg-ricedeep'
      }`}
    >
      {label}
      <span className={`ml-1.5 text-xs font-medium ${active ? 'text-passport-gold' : 'text-slate-400'}`}>
        {got}/{total}
      </span>
    </button>
  );
}
