import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import Seal, { CertificateSeal, SEAL_RED } from './Seal';
import { SPOT_MAP, TOTAL_SPOTS, countStamps, getRank } from './spotsData';

const W = 1000;
const H = 707;
const pad2 = (n) => String(n).padStart(2, '0');
const fmtDate = (d) => (d ? `${d.getFullYear()} 年 ${pad2(d.getMonth() + 1)} 月 ${pad2(d.getDate())} 日` : '—');

function useCertificateData(stamps, explorer) {
  return useMemo(() => {
    const entries = Object.entries(stamps)
      .filter(([id]) => SPOT_MAP[id])
      .map(([id, at]) => ({ spot: SPOT_MAP[id], at: new Date(at) }))
      .sort((a, b) => a.at - b.at);
    const count = countStamps(stamps);
    return {
      name: explorer.trim() || '旅人',
      count,
      rank: getRank(count),
      first: entries[0]?.at || null,
      last: entries[entries.length - 1]?.at || null,
      issued: new Date(),
      recent: entries.slice(-8).reverse().map((e) => e.spot),
    };
  }, [stamps, explorer]);
}

/* ---------------- Canvas 輸出 PNG ---------------- */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawMiniSeal(ctx, x, y, s, spot) {
  ctx.save();
  ctx.strokeStyle = SEAL_RED;
  ctx.fillStyle = SEAL_RED;
  ctx.lineWidth = s * 0.05;
  roundRect(ctx, x, y, s, s, s * 0.12);
  ctx.stroke();
  ctx.lineWidth = s * 0.015;
  roundRect(ctx, x + s * 0.1, y + s * 0.1, s * 0.8, s * 0.8, s * 0.06);
  ctx.stroke();
  ctx.textAlign = 'center';
  const raw = spot.short || spot.name;
  const hasLatin = /[0-9A-Za-z]/.test(raw);
  const name = hasLatin ? raw : [...raw].slice(0, 4).join('');
  const len = [...name].length;
  ctx.font = `900 ${s * (hasLatin ? 0.16 : len > 2 ? 0.2 : 0.28)}px "Noto Serif TC", serif`;
  ctx.fillText(name, x + s / 2, y + s * 0.56);
  ctx.font = `700 ${s * 0.09}px "Noto Sans TC", sans-serif`;
  ctx.fillText(spot.code, x + s / 2, y + s * 0.8);
  ctx.restore();
}

function drawBigSeal(ctx, cx, cy, s) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.08);
  ctx.globalAlpha = 0.92;
  ctx.strokeStyle = SEAL_RED;
  ctx.fillStyle = SEAL_RED;
  ctx.lineWidth = s * 0.06;
  roundRect(ctx, -s / 2, -s / 2, s, s, s * 0.05);
  ctx.stroke();
  ctx.lineWidth = s * 0.015;
  roundRect(ctx, -s * 0.37, -s * 0.37, s * 0.74, s * 0.74, s * 0.02);
  ctx.stroke();
  ctx.textAlign = 'center';
  ctx.font = `900 ${s * 0.31}px "Noto Serif TC", serif`;
  [
    ['巡', -0.185, -0.07],
    ['禮', 0.185, -0.07],
    ['認', -0.185, 0.29],
    ['證', 0.185, 0.29],
  ].forEach(([ch, dx, dy]) => ctx.fillText(ch, dx * s, dy * s));
  ctx.restore();
}

async function downloadPNG(data) {
  if (document.fonts?.ready) await document.fonts.ready;
  const S = 2; // 2000 × 1414
  const canvas = document.createElement('canvas');
  canvas.width = W * S;
  canvas.height = H * S;
  const ctx = canvas.getContext('2d');
  ctx.scale(S, S);

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#fbf7ea');
  bg.addColorStop(1, '#f1e6cc');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = '#1f3d2b';
  ctx.lineWidth = 10;
  ctx.strokeRect(22, 22, W - 44, H - 44);
  ctx.strokeStyle = '#c9a35a';
  ctx.lineWidth = 2;
  ctx.strokeRect(38, 38, W - 76, H - 76);
  ctx.strokeRect(44, 44, W - 88, H - 88);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#8a6d3b';
  ctx.font = '700 14px "Noto Sans TC", sans-serif';
  ctx.fillText('台灣 3D 旅遊導覽 ・ 觀光集章冊', W / 2, 102);
  ctx.fillStyle = '#1f3d2b';
  ctx.font = '900 52px "Noto Serif TC", serif';
  ctx.fillText('福爾摩沙巡禮成就證書', W / 2, 170);
  ctx.fillStyle = '#8a6d3b';
  ctx.font = 'italic 20px Georgia, serif';
  ctx.fillText('Certificate of Formosa Exploration', W / 2, 204);

  ctx.fillStyle = '#374151';
  ctx.font = '500 20px "Noto Serif TC", serif';
  ctx.fillText('茲證明', W / 2, 262);
  ctx.fillStyle = SEAL_RED;
  ctx.font = '900 46px "Noto Serif TC", serif';
  ctx.fillText(data.name, W / 2, 320);
  ctx.strokeStyle = '#c9a35a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 170, 338);
  ctx.lineTo(W / 2 + 170, 338);
  ctx.stroke();

  ctx.fillStyle = '#374151';
  ctx.font = '500 21px "Noto Serif TC", serif';
  ctx.fillText(`走訪台灣各地，已收集 ${data.count} / ${TOTAL_SPOTS} 枚觀光紀念章，`, W / 2, 384);
  ctx.fillText(`特頒「${data.rank.title}」榮譽頭銜，以資紀念。`, W / 2, 418);

  const seals = data.recent;
  const ms = 62;
  const gap = 12;
  const total = seals.length * ms + Math.max(0, seals.length - 1) * gap;
  seals.forEach((spot, i) => drawMiniSeal(ctx, W / 2 - total / 2 + i * (ms + gap), 450, ms, spot));

  ctx.textAlign = 'left';
  ctx.fillStyle = '#4b5563';
  ctx.font = '500 16px "Noto Sans TC", sans-serif';
  ctx.fillText(`首次蓋章　${fmtDate(data.first)}`, 96, 588);
  ctx.fillText(`最近蓋章　${fmtDate(data.last)}`, 96, 616);
  ctx.fillText(`頒發日期　${fmtDate(data.issued)}`, 96, 644);

  drawBigSeal(ctx, W - 180, 590, 120);

  const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `福爾摩沙巡禮證書-${data.issued.toISOString().slice(0, 10)}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/* ---------------- 畫面 ---------------- */
export default function CertificateView({ stamps, explorer, onExplorerChange, onClose }) {
  const data = useCertificateData(stamps, explorer);
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(Math.min(1, entry.contentRect.width / W)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleDownload = async () => {
    setBusy(true);
    try {
      await downloadPNG(data);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-passport-900/95 backdrop-blur" role="dialog" aria-modal="true" aria-label="成就證書">
      <div className="no-print sticky top-0 z-10 flex flex-wrap items-center gap-2 bg-passport-900/90 px-4 py-3 backdrop-blur md:px-8">
        <button type="button" onClick={onClose} className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold text-passport-goldLight transition hover:bg-white/10">
          <ArrowLeft size={18} aria-hidden="true" />
          返回
        </button>
        <label className="ml-auto flex items-center gap-2 text-sm text-passport-goldLight/80">
          證書姓名
          <input
            value={explorer}
            onChange={(e) => onExplorerChange(e.target.value.slice(0, 16))}
            placeholder="旅人"
            className="w-32 rounded-full border border-passport-gold/40 bg-white/5 px-3 py-1.5 text-white outline-none focus:border-passport-goldLight md:w-44"
          />
        </label>
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-full border border-passport-gold/60 px-4 py-2 text-sm font-bold text-passport-goldLight transition hover:bg-white/10">
          <Printer size={16} aria-hidden="true" />
          列印
        </button>
        <button
          type="button"
          onClick={handleDownload}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-full bg-passport-gold px-4 py-2 text-sm font-bold text-passport-900 transition hover:bg-passport-goldLight disabled:opacity-60"
        >
          <Download size={16} aria-hidden="true" />
          {busy ? '產生中…' : '下載 PNG'}
        </button>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-10 pt-4 md:px-8">
        {data.count === 0 && (
          <p className="no-print mb-4 rounded-2xl bg-white/10 px-4 py-3 text-sm text-passport-goldLight">
            還沒有任何紀念章。回到地圖點選景點蓋下第一枚章，證書就會記錄你的旅程。
          </p>
        )}
        <div ref={wrapRef} className="w-full" style={{ height: H * scale }}>
          <div
            id="certificate-print"
            className="relative origin-top-left overflow-hidden shadow-2xl"
            style={{ width: W, height: H, transform: `scale(${scale})`, background: 'linear-gradient(135deg,#fbf7ea,#f1e6cc)' }}
          >
            <div className="absolute inset-[22px] border-[10px] border-passport-800" />
            <div className="absolute inset-[38px] border-2 border-passport-gold" />
            <div className="absolute inset-[44px] border-2 border-passport-gold" />
            {[
              'left-[30px] top-[30px]',
              'right-[30px] top-[30px]',
              'left-[30px] bottom-[30px]',
              'right-[30px] bottom-[30px]',
            ].map((pos) => (
              <div key={pos} className={`absolute ${pos} h-6 w-6 rotate-45 border-2 border-passport-gold bg-[#f6eed8]`} />
            ))}

            <div className="absolute inset-x-0 top-[78px] text-center">
              <p className="text-sm font-bold text-[#8a6d3b]">台灣 3D 旅遊導覽 ・ 觀光集章冊</p>
              <h1 className="mt-3 font-serif text-[52px] font-black leading-none text-passport-800">福爾摩沙巡禮成就證書</h1>
              <p className="mt-3 font-[Georgia,serif] text-xl italic text-[#8a6d3b]">Certificate of Formosa Exploration</p>
              <p className="mt-6 font-serif text-xl text-slate-700">茲證明</p>
              <p className="mx-auto mt-2 w-[340px] border-b-[1.5px] border-passport-gold pb-1 font-serif text-[46px] font-black leading-tight text-vermilion-600">
                {data.name}
              </p>
              <p className="mt-5 font-serif text-[21px] leading-[34px] text-slate-700">
                走訪台灣各地，已收集 <b className="text-passport-800">{data.count}</b> / {TOTAL_SPOTS} 枚觀光紀念章，
                <br />
                特頒「<b className="text-passport-800">{data.rank.title}</b>」榮譽頭銜，以資紀念。
              </p>
              <div className="mt-5 flex justify-center gap-3">
                {data.recent.map((spot) => (
                  <Seal key={spot.id} spot={spot} size={62} rough={false} />
                ))}
              </div>
            </div>

            <dl className="absolute bottom-[60px] left-[96px] space-y-1.5 text-base text-slate-600">
              {[
                ['首次蓋章', data.first],
                ['最近蓋章', data.last],
                ['頒發日期', data.issued],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-4">
                  <dt>{k}</dt>
                  <dd className="font-medium text-slate-800">{fmtDate(v)}</dd>
                </div>
              ))}
            </dl>
            <div className="absolute bottom-[72px] right-[118px] text-center">
              <div style={{ transform: 'rotate(-5deg)' }}>
                <CertificateSeal size={124} />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {data.rank.emoji} {data.rank.en}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
