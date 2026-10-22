import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import {
  BookOpen, Box, ChevronDown, ChevronUp, Minus, Moon, Plus, RotateCcw, Route, Search, SlidersHorizontal, Square, Stamp, Sun, Sunset, X,
} from 'lucide-react';
import TaiwanMap3D from './TaiwanMap3D';
import StampModal from './StampModal';
import PassportView from './PassportView';
import ItineraryModal from './ItineraryModal';
import CategoryIcon from './CategoryIcon';
import { CATEGORIES, CATEGORY_ORDER, REGIONS, SPOTS, TOTAL_SPOTS, countStamps, getRank } from './spotsData';
import { spotPosition } from './geo';

const CertificateView = lazy(() => import('./CertificateView'));

const STORAGE_KEY = 'tw3d-stamp-passport-v1';

function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return { stamps: p.stamps || {}, explorer: p.explorer || '' };
    }
  } catch {
    /* 無法讀取時使用預設值 */
  }
  return { stamps: {}, explorer: '' };
}

const MOOD_OPTIONS = [
  { id: 'day', label: '日間清朗', icon: Sun },
  { id: 'sunset', label: '金黃夕陽', icon: Sunset },
  { id: 'night', label: '璀璨夜景', icon: Moon },
];

/* 三種光影模式對應的介面樣式 */
const THEMES = {
  day: {
    sky: 'bg-gradient-to-b from-[#4aa8e0] via-[#d6eef8] via-45% to-[#d6eef8]',
    panel: 'bg-white/80 text-slate-800 border border-white/70 shadow-xl shadow-sky-900/10 backdrop-blur-xl',
    muted: 'text-slate-500',
    chip: 'bg-white/70 text-slate-600 hover:bg-white border border-slate-200/80',
    chipOn: 'bg-passport-800 text-passport-goldLight border border-passport-800',
    btn: 'bg-white/85 text-slate-700 hover:bg-white border border-white/80 shadow-lg shadow-sky-900/10 backdrop-blur-xl',
    btnOn: 'bg-passport-800 text-passport-goldLight',
    input: 'bg-white/90 text-slate-800 placeholder:text-slate-400 border-slate-200',
  },
  sunset: {
    sky: 'bg-gradient-to-b from-[#4c3f8f] via-[#f6b48c] via-45% to-[#f6b48c]',
    panel: 'bg-orange-50/80 text-stone-800 border border-orange-100/80 shadow-xl shadow-orange-900/20 backdrop-blur-xl',
    muted: 'text-stone-500',
    chip: 'bg-white/60 text-stone-600 hover:bg-white/90 border border-orange-200/80',
    chipOn: 'bg-gradient-to-r from-orange-500 to-vermilion-500 text-white border border-orange-500',
    btn: 'bg-orange-50/85 text-stone-700 hover:bg-white border border-orange-100 shadow-lg shadow-orange-900/20 backdrop-blur-xl',
    btnOn: 'bg-gradient-to-r from-orange-500 to-vermilion-500 text-white',
    input: 'bg-white/85 text-stone-800 placeholder:text-stone-400 border-orange-200',
  },
  night: {
    sky: 'bg-gradient-to-b from-[#020617] via-[#0a1024] via-45% to-[#0a1024]',
    panel: 'bg-slate-900/70 text-slate-100 border border-cyan-400/30 shadow-[0_0_30px_rgba(34,211,238,0.18)] backdrop-blur-xl',
    muted: 'text-slate-400',
    chip: 'bg-slate-800/70 text-slate-300 hover:bg-slate-700 border border-slate-700',
    chipOn: 'bg-cyan-400 text-slate-950 border border-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.75)]',
    btn: 'bg-slate-900/80 text-cyan-100 hover:bg-slate-800 border border-cyan-400/40 shadow-[0_0_18px_rgba(34,211,238,0.25)] backdrop-blur-xl',
    btnOn: 'bg-cyan-400 text-slate-950 shadow-[0_0_14px_rgba(34,211,238,0.8)]',
    input: 'bg-slate-950/70 text-slate-100 placeholder:text-slate-500 border-cyan-400/30',
  },
};

function MapButton({ label, onClick, active, theme, children, sub }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={`flex h-11 w-11 flex-col items-center justify-center transition ${active ? theme.btnOn : 'hover:bg-black/5'}`}
    >
      {children}
      {sub && <span className="-mt-0.5 text-[10px] font-bold leading-none">{sub}</span>}
    </button>
  );
}

export default function App() {
  const [{ stamps, explorer }, setStore] = useState(loadStore);
  const [mood, setMood] = useState('day');
  const [viewMode, setViewMode] = useState('3d');
  const [region, setRegion] = useState('all');
  const [cats, setCats] = useState([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [panel, setPanel] = useState(null); // 'passport' | 'certificate' | 'itinerary'
  const [command, setCommand] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(() => (typeof window === 'undefined' ? true : window.innerWidth >= 768));

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ stamps, explorer }));
    } catch {
      /* 隱私模式等情況下無法寫入時略過 */
    }
  }, [stamps, explorer]);

  const theme = THEMES[mood];
  const count = countStamps(stamps);
  const rank = getRank(count);

  const send = useCallback((cmd) => setCommand({ ...cmd, id: Date.now() + Math.random() }), []);
  const openSpot = useCallback(
    (spot) => {
      setSelected(spot);
      send({ type: 'focus', position: spotPosition(spot) });
    },
    [send],
  );
  const stamp = useCallback((spot) => setStore((s) => ({ ...s, stamps: { ...s.stamps, [spot.id]: new Date().toISOString() } })), []);
  const unstamp = useCallback(
    (spot) =>
      setStore((s) => {
        const next = { ...s.stamps };
        delete next[spot.id];
        return { ...s, stamps: next };
      }),
    [],
  );
  const setExplorer = useCallback((name) => setStore((s) => ({ ...s, explorer: name })), []);
  const closeSpot = useCallback(() => setSelected(null), []);
  const closePanel = useCallback(() => setPanel(null), []);

  const q = query.trim().toLowerCase();
  const matches = useCallback(
    (s) => !q || s.name.toLowerCase().includes(q) || s.nameEn.toLowerCase().includes(q) || s.county.includes(q) || s.code.toLowerCase().includes(q),
    [q],
  );
  const filtered = useMemo(
    () => SPOTS.filter((s) => (region === 'all' || s.region === region) && (cats.length === 0 || cats.includes(s.category)) && matches(s)),
    [region, cats, matches],
  );
  const results = q ? filtered.slice(0, 6) : [];

  const toggleCat = (id) => setCats((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  const activeFilters = (region !== 'all' ? 1 : 0) + cats.length + (q ? 1 : 0);

  return (
    <div className={`relative h-[100dvh] w-full overflow-hidden ${theme.sky}`}>
      <div className="absolute inset-0">
        <TaiwanMap3D
          spots={filtered}
          stamps={stamps}
          selectedId={selected?.id}
          mood={mood}
          viewMode={viewMode}
          command={command}
          onSelectSpot={openSpot}
        />
      </div>

      {/* 頂部列 */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-wrap items-start justify-between gap-2 p-3 md:p-4">
        <div className={`pointer-events-auto flex items-center gap-2.5 rounded-2xl py-1.5 pl-1.5 pr-3 sm:gap-3 sm:py-2 sm:pl-2 sm:pr-4 ${theme.panel}`}>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-vermilion-600 text-white shadow-md shadow-vermilion-700/30">
            <Stamp size={20} aria-hidden="true" />
          </div>
          <div className="leading-tight">
            <h1 className="font-serif text-[15px] font-black md:text-lg">台灣 3D 旅遊導覽</h1>
            <p className={`hidden text-[11px] sm:block ${theme.muted}`}>Taiwan 3D Travel Guide &amp; Stamp Passport</p>
          </div>
        </div>

        <div className="pointer-events-auto order-3 flex w-full justify-center lg:order-none lg:w-auto">
          <div className={`flex rounded-2xl p-1 ${theme.panel}`} role="radiogroup" aria-label="光影模式">
            {MOOD_OPTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={mood === id}
                onClick={() => setMood(id)}
                className={`flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-bold transition sm:px-3 ${mood === id ? theme.btnOn : 'opacity-75 hover:opacity-100'}`}
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <button type="button" onClick={() => setPanel('itinerary')} className={`flex h-11 items-center gap-2 rounded-2xl px-3 text-sm font-bold transition md:px-4 ${theme.btn}`}>
            <Route size={18} aria-hidden="true" />
            <span className="hidden sm:inline">行程規劃</span>
          </button>
          <button type="button" onClick={() => setPanel('passport')} className="flex h-11 items-center gap-2 rounded-2xl bg-passport-800 px-3 text-sm font-bold text-passport-goldLight shadow-lg shadow-passport-900/30 transition hover:bg-passport-700 md:px-4">
            <BookOpen size={18} aria-hidden="true" />
            <span className="hidden sm:inline">集章冊</span>
            <span className="rounded-full bg-vermilion-600 px-2 py-0.5 text-xs text-white">
              {count}/{TOTAL_SPOTS}
            </span>
          </button>
        </div>
      </header>

      {/* 篩選面板 */}
      <div className="absolute left-3 top-[124px] z-10 w-[calc(100%-5rem)] max-w-sm md:left-4 lg:top-[84px]">
        <button
          type="button"
          onClick={() => setFiltersOpen((o) => !o)}
          aria-expanded={filtersOpen}
          className={`flex h-10 items-center gap-2 rounded-2xl px-3 text-sm font-bold md:hidden ${theme.btn}`}
        >
          <SlidersHorizontal size={16} aria-hidden="true" />
          篩選景點
          {activeFilters > 0 && <span className="rounded-full bg-vermilion-600 px-1.5 text-xs text-white">{activeFilters}</span>}
        </button>

        {filtersOpen && (
          <div className={`mt-2 max-h-[calc(100dvh-240px)] animate-pop-in overflow-y-auto rounded-2xl p-3 md:mt-0 ${theme.panel}`}>
            <div className="relative">
              <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.muted}`} aria-hidden="true" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜尋景點、縣市或編號"
                aria-label="搜尋景點"
                className={`w-full rounded-xl border py-2 pl-9 pr-9 text-sm outline-none ${theme.input}`}
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} aria-label="清除搜尋" className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 ${theme.muted}`}>
                  <X size={15} />
                </button>
              )}
            </div>
            {results.length > 0 && (
              <ul className="mt-2 space-y-0.5">
                {results.map((s) => (
                  <li key={s.id}>
                    <button type="button" onClick={() => openSpot(s)} className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-black/5">
                      <CategoryIcon category={s.category} size={15} style={{ color: CATEGORIES[s.category].color }} aria-hidden="true" />
                      <span className="font-bold">{s.name}</span>
                      <span className={`ml-auto text-xs ${theme.muted}`}>{s.county}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <p className={`mb-1.5 mt-3 text-xs font-bold ${theme.muted}`}>區域</p>
            <div className="flex flex-wrap gap-1.5">
              {REGIONS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRegion(r.id)}
                  aria-pressed={region === r.id}
                  className={`rounded-full px-3 py-1 text-sm font-bold transition ${region === r.id ? theme.chipOn : theme.chip}`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <p className={`mb-1.5 mt-3 text-xs font-bold ${theme.muted}`}>分類</p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setCats([])}
                aria-pressed={cats.length === 0}
                className={`rounded-full px-3 py-1 text-sm font-bold transition ${cats.length === 0 ? theme.chipOn : theme.chip}`}
              >
                全部
              </button>
              {CATEGORY_ORDER.map((id) => {
                const on = cats.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleCat(id)}
                    aria-pressed={on}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold transition ${on ? theme.chipOn : theme.chip}`}
                  >
                    <CategoryIcon category={id} size={14} style={on ? undefined : { color: CATEGORIES[id].color }} aria-hidden="true" />
                    {CATEGORIES[id].label}
                  </button>
                );
              })}
            </div>
            <p className={`mt-3 text-xs ${theme.muted}`}>
              地圖上顯示 {filtered.length} 個景點
              {filtered.length === 0 && '，請放寬篩選條件'}
            </p>
          </div>
        )}
      </div>

      {/* 地圖控制 */}
      <nav className="absolute right-3 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-2 md:right-4" aria-label="地圖控制">
        <div className={`flex flex-col overflow-hidden rounded-2xl ${theme.panel}`}>
          <MapButton label="3D 透視視角" active={viewMode === '3d'} onClick={() => setViewMode('3d')} theme={theme} sub="3D">
            <Box size={17} aria-hidden="true" />
          </MapButton>
          <MapButton label="2D 俯視視角" active={viewMode === '2d'} onClick={() => setViewMode('2d')} theme={theme} sub="2D">
            <Square size={17} aria-hidden="true" />
          </MapButton>
        </div>
        <div className={`flex flex-col overflow-hidden rounded-2xl ${theme.panel}`}>
          <MapButton label="地圖往北移動" onClick={() => send({ type: 'pan', dz: -4 })} theme={theme} sub="北">
            <ChevronUp size={18} aria-hidden="true" />
          </MapButton>
          <MapButton label="地圖往南移動" onClick={() => send({ type: 'pan', dz: 4 })} theme={theme} sub="南">
            <ChevronDown size={18} aria-hidden="true" />
          </MapButton>
        </div>
        <div className={`flex flex-col overflow-hidden rounded-2xl ${theme.panel}`}>
          <MapButton label="放大" onClick={() => send({ type: 'zoom', factor: 0.75 })} theme={theme}>
            <Plus size={18} aria-hidden="true" />
          </MapButton>
          <MapButton label="縮小" onClick={() => send({ type: 'zoom', factor: 1.33 })} theme={theme}>
            <Minus size={18} aria-hidden="true" />
          </MapButton>
        </div>
        <div className={`overflow-hidden rounded-2xl ${theme.panel}`}>
          <MapButton label="重設視角" onClick={() => send({ type: 'reset' })} theme={theme}>
            <RotateCcw size={17} aria-hidden="true" />
          </MapButton>
        </div>
      </nav>

      {/* 底部：圖例與探索者頭銜 */}
      <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 flex items-end justify-between gap-3 md:inset-x-4 md:bottom-4">
        <div className={`pointer-events-auto hidden rounded-2xl px-4 py-3 lg:block ${theme.panel}`}>
          <ul className="space-y-1.5 text-sm">
            {CATEGORY_ORDER.map((id) => (
              <li key={id} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: CATEGORIES[id].color }} aria-hidden="true" />
                <span className="font-bold">{CATEGORIES[id].label}</span>
                <span className={`text-xs ${theme.muted}`}>{CATEGORIES[id].model}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={() => setPanel('passport')}
          className={`pointer-events-auto mx-auto flex w-full max-w-sm items-center gap-3 rounded-2xl px-4 py-3 text-left transition lg:mx-0 lg:w-80 ${theme.panel}`}
        >
          <span className="text-2xl" aria-hidden="true">
            {rank.emoji}
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-baseline justify-between gap-2">
              <span className="truncate font-serif font-black">{rank.title}</span>
              <span className={`shrink-0 text-xs ${theme.muted}`}>
                {count} / {TOTAL_SPOTS}
              </span>
            </span>
            <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-black/10">
              <span className="block h-full rounded-full bg-gradient-to-r from-passport-gold to-vermilion-500 transition-all duration-700" style={{ width: `${(count / TOTAL_SPOTS) * 100}%` }} />
            </span>
          </span>
        </button>

        <p className={`pointer-events-none hidden rounded-full px-3 py-1.5 text-xs xl:block ${theme.panel}`}>
          {viewMode === '3d' ? '左鍵旋轉・右鍵平移・滾輪縮放' : '左鍵平移・右鍵旋轉・滾輪縮放'}・點地標開啟景點
        </p>
      </div>

      {/* 子頁面 */}
      {panel === 'passport' && (
        <PassportView
          stamps={stamps}
          explorer={explorer}
          onExplorerChange={setExplorer}
          onOpenSpot={openSpot}
          onClose={closePanel}
          onOpenCertificate={() => setPanel('certificate')}
          onOpenItinerary={() => setPanel('itinerary')}
          onResetAll={() => setStore((s) => ({ ...s, stamps: {} }))}
        />
      )}
      {panel === 'itinerary' && <ItineraryModal stamps={stamps} onClose={closePanel} onOpenSpot={openSpot} />}
      {panel === 'certificate' && (
        <Suspense fallback={null}>
          <CertificateView stamps={stamps} explorer={explorer} onExplorerChange={setExplorer} onClose={closePanel} />
        </Suspense>
      )}
      {selected && <StampModal spot={selected} stampedAt={stamps[selected.id]} onStamp={stamp} onReset={unstamp} onClose={closeSpot} />}
    </div>
  );
}
