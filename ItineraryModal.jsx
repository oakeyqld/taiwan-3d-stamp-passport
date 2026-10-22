import { useEffect, useMemo, useState } from 'react';
import { Car, Check, Copy, Route, Ship, Sparkles, X } from 'lucide-react';
import CategoryIcon from './CategoryIcon';
import { CATEGORIES, REGION_LABEL, SPOTS } from './spotsData';
import { haversineKm } from './geo';

const ROAD_FACTOR = 1.3; // 直線距離換算道路距離
const AVG_KMH = 50;

/** 中央山脈稜線（緯度 → 經度），用來判斷景點在山脈西側或東側 */
const RIDGE = [
  [25.3, 121.6], [24.8, 121.55], [24.55, 121.4], [24.38, 121.25], [24.15, 121.25],
  [23.85, 121.1], [23.47, 120.96], [23.1, 120.9], [22.7, 120.82], [22.35, 120.8], [21.9, 120.82],
];
function ridgeLngAt(lat) {
  if (lat >= RIDGE[0][0]) return RIDGE[0][1];
  for (let i = 1; i < RIDGE.length; i++) {
    const [la, lo] = RIDGE[i];
    const [pla, plo] = RIDGE[i - 1];
    if (lat >= la) return lo + ((lat - la) / (pla - la)) * (plo - lo);
  }
  return RIDGE[RIDGE.length - 1][1];
}

/**
 * 環島順序（逆時針）：山脈以西由北往南，再接山脈以東由南往北。
 * 宜蘭、基隆以東的北部景點視為東側終點，台北一帶為起點。
 */
function sortLoop(spots) {
  const isEast = (s) => s.lng > ridgeLngAt(s.lat) && !(s.lat > 24.95 && s.lng < 121.7);
  const west = spots.filter((s) => !isEast(s)).sort((a, b) => b.lat - a.lat);
  const east = spots.filter(isEast).sort((a, b) => a.lat - b.lat);
  return [...west, ...east];
}

function buildPlan(stamps, mode, pace) {
  const collected = SPOTS.filter((s) => stamps[s.id]);
  const chosen = collected.map((s) => ({ ...s, recommended: false }));

  if (mode === 'smart') {
    const ids = new Set(chosen.map((s) => s.id));
    const pool = SPOTS.filter((s) => !stamps[s.id]);
    // 每個已收集景點，順路補一個 35 km 內評分最高的未收集景點
    for (const c of collected) {
      if (c.region === 'islands') continue;
      const near = pool
        .filter((p) => !ids.has(p.id) && p.region !== 'islands')
        .map((p) => ({ p, d: haversineKm(c, p) }))
        .filter((x) => x.d < 35)
        .sort((a, b) => b.p.rating - a.p.rating || a.d - b.d)[0];
      if (near) {
        ids.add(near.p.id);
        chosen.push({ ...near.p, recommended: true });
      }
    }
    // 確保環島四大區域至少各有兩站
    for (const r of ['north', 'central', 'south', 'east']) {
      const have = chosen.filter((s) => s.region === r).length;
      if (have >= 2) continue;
      pool
        .filter((p) => p.region === r && !ids.has(p.id))
        .sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating)
        .slice(0, 2 - have)
        .forEach((p) => {
          ids.add(p.id);
          chosen.push({ ...p, recommended: true });
        });
    }
  }

  const main = sortLoop(chosen.filter((s) => s.region !== 'islands'));
  const islands = chosen.filter((s) => s.region === 'islands');

  let prev = null;
  let totalKm = 0;
  const days = [];
  for (let i = 0; i < main.length; i += pace) {
    const stops = main.slice(i, i + pace);
    let km = 0;
    const legs = stops.map((s, j) => {
      const from = j === 0 ? prev : stops[j - 1];
      const d = from ? haversineKm(from, s) * ROAD_FACTOR : 0;
      km += d;
      return { spot: s, km: d };
    });
    prev = stops[stops.length - 1];
    totalKm += km;
    days.push({ day: days.length + 1, legs, km, regions: [...new Set(stops.map((s) => REGION_LABEL[s.region]))] });
  }
  return { days, islands, totalKm, count: chosen.length, recommended: chosen.filter((s) => s.recommended).length };
}

const fmtDrive = (km) => {
  const m = Math.round((km / AVG_KMH) * 60);
  return m >= 60 ? `${Math.floor(m / 60)} 小時 ${m % 60} 分` : `${m} 分`;
};

export default function ItineraryModal({ stamps, onClose, onOpenSpot }) {
  const collectedCount = Object.keys(stamps).length;
  const [mode, setMode] = useState(collectedCount >= 4 ? 'collected' : 'smart');
  const [pace, setPace] = useState(3);
  const [copied, setCopied] = useState(false);
  const plan = useMemo(() => buildPlan(stamps, mode, pace), [stamps, mode, pace]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const copyText = async () => {
    const lines = ['【台灣環島慢活路線】'];
    plan.days.forEach((d) => {
      lines.push(`Day ${d.day}（${d.regions.join('、')}）：${d.legs.map((l) => l.spot.name).join(' → ')}`);
    });
    if (plan.islands.length) lines.push(`離島延伸：${plan.islands.map((s) => s.name).join('、')}`);
    lines.push(`全程約 ${Math.round(plan.totalKm)} 公里`);
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* 剪貼簿權限被拒時略過 */
    }
  };

  const empty = plan.days.length === 0 && plan.islands.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6" role="dialog" aria-modal="true" aria-label="行程規劃">
      <div className="absolute inset-0 animate-fade-in bg-passport-900/60 backdrop-blur-sm" onClick={onClose} />
      <section className="relative flex max-h-[94dvh] w-full max-w-2xl animate-pop-in flex-col overflow-hidden rounded-t-[28px] bg-rice shadow-2xl md:rounded-[28px]">
        <header className="shrink-0 bg-passport-800 px-5 pb-4 pt-5 text-passport-goldLight md:px-7">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 font-serif text-2xl font-black text-white">
                <Route size={22} className="text-passport-gold" aria-hidden="true" />
                環島慢活路線
              </h2>
              <p className="mt-1 text-sm text-passport-goldLight/80">依你的紀念章，從台北出發沿西部南下，再經東部北返，串成一圈。</p>
            </div>
            <button type="button" onClick={onClose} aria-label="關閉" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 transition hover:bg-white/20">
              <X size={20} />
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="flex rounded-full bg-black/25 p-1">
              {[
                ['collected', '只排已收集'],
                ['smart', '智慧補章推薦'],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMode(id)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-bold transition ${mode === id ? 'bg-passport-gold text-passport-900' : 'text-passport-goldLight hover:text-white'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex rounded-full bg-black/25 p-1">
              {[
                [2, '悠閒'],
                [3, '慢活'],
                [4, '標準'],
              ].map(([n, label]) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPace(n)}
                  className={`rounded-full px-3 py-1.5 text-sm font-bold transition ${pace === n ? 'bg-white text-passport-900' : 'text-passport-goldLight hover:text-white'}`}
                >
                  {label}
                  <span className="ml-1 text-xs font-medium opacity-70">{n}站/日</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="overflow-y-auto overscroll-contain px-5 py-5 md:px-7">
          {empty ? (
            <div className="rounded-3xl border-2 border-dashed border-ricedeep px-6 py-10 text-center">
              <p className="font-serif text-xl font-bold text-passport-800">還沒有可以串聯的紀念章</p>
              <p className="mt-2 text-slate-600">在地圖上蓋下幾枚章，或切換到「智慧補章推薦」，就能產生一條環島路線。</p>
              {mode === 'collected' && (
                <button type="button" onClick={() => setMode('smart')} className="mt-4 rounded-full bg-passport-800 px-5 py-2 font-bold text-passport-goldLight">
                  改用智慧補章推薦
                </button>
              )}
            </div>
          ) : (
            <>
              <dl className="mb-5 grid grid-cols-3 gap-2 text-center">
                {[
                  ['天數', `${plan.days.length} 天`],
                  ['景點', `${plan.count} 站`],
                  ['車程', `約 ${Math.round(plan.totalKm)} km`],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-2xl bg-white px-2 py-3 ring-1 ring-ricedeep">
                    <dt className="text-xs text-slate-500">{k}</dt>
                    <dd className="mt-0.5 font-serif text-lg font-black text-passport-800">{v}</dd>
                  </div>
                ))}
              </dl>
              {mode === 'smart' && plan.recommended > 0 && (
                <p className="mb-4 flex items-center gap-2 text-sm text-slate-600">
                  <Sparkles size={15} className="text-vermilion-600" aria-hidden="true" />
                  已順路加入 {plan.recommended} 個尚未收集的高評分景點（標示「補章」）。
                </p>
              )}

              <ol className="space-y-4">
                {plan.days.map((d) => (
                  <li key={d.day} className="rounded-3xl bg-white p-4 ring-1 ring-ricedeep">
                    <div className="mb-3 flex items-baseline justify-between gap-2">
                      <h3 className="font-serif text-lg font-black text-passport-800">
                        Day {d.day}
                        <span className="ml-2 text-sm font-bold text-slate-500">{d.regions.join('、')}</span>
                      </h3>
                      <span className="text-xs text-slate-500">約 {Math.round(d.km)} km・{fmtDrive(d.km)}</span>
                    </div>
                    <ol className="relative space-y-1 border-l-2 border-dashed border-passport-gold/50 pl-5">
                      {d.legs.map(({ spot, km }) => (
                        <li key={spot.id} className="relative">
                          <span
                            className="absolute -left-[29px] top-3 grid h-4 w-4 place-items-center rounded-full ring-4 ring-white"
                            style={{ background: CATEGORIES[spot.category].color }}
                            aria-hidden="true"
                          />
                          {km > 0 && (
                            <p className="flex items-center gap-1 text-xs text-slate-400">
                              <Car size={12} aria-hidden="true" />約 {Math.round(km)} km・{fmtDrive(km)}
                            </p>
                          )}
                          <button type="button" onClick={() => onOpenSpot(spot)} className="flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left transition hover:bg-rice">
                            <CategoryIcon category={spot.category} size={16} style={{ color: CATEGORIES[spot.category].color }} aria-hidden="true" />
                            <span className="font-bold text-slate-800">{spot.name}</span>
                            <span className="text-xs text-slate-400">{spot.county}</span>
                            {spot.recommended ? (
                              <span className="ml-auto rounded-full bg-vermilion-50 px-2 py-0.5 text-xs font-bold text-vermilion-700">補章</span>
                            ) : (
                              <span className="ml-auto rounded-full bg-passport-800/5 px-2 py-0.5 text-xs font-bold text-passport-700">已收集</span>
                            )}
                          </button>
                        </li>
                      ))}
                    </ol>
                  </li>
                ))}
              </ol>

              {plan.islands.length > 0 && (
                <div className="mt-4 rounded-3xl bg-sky-50 p-4 ring-1 ring-sky-100">
                  <h3 className="flex items-center gap-2 font-serif text-lg font-black text-sky-900">
                    <Ship size={18} aria-hidden="true" />
                    離島延伸
                  </h3>
                  <p className="mt-1 text-sm text-sky-800/80">離島需搭船或搭機，建議另外安排 1–2 天。</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {plan.islands.map((s) => (
                      <button key={s.id} type="button" onClick={() => onOpenSpot(s)} className="rounded-full bg-white px-3 py-1.5 text-sm font-bold text-sky-900 ring-1 ring-sky-200 transition hover:bg-sky-100">
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={copyText}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-passport-800 py-3 font-bold text-passport-goldLight transition hover:bg-passport-700"
              >
                {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
                {copied ? '已複製行程' : '複製行程文字'}
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
