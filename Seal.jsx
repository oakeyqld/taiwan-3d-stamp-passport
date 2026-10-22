import { useId } from 'react';

export const SEAL_RED = '#c9252c';

/** 將印文切成 1–2 行 */
function layoutName(raw) {
  const chars = [...raw];
  // 含英數字（如 台北101、Xpark）不拆行，避免數字被切開
  if (/[0-9A-Za-z]/.test(raw)) return { lines: [raw], fs: chars.length > 5 ? 28 : 34, lh: 0 };
  if (chars.length <= 2) return { lines: [raw], fs: 56, lh: 0 };
  if (chars.length === 3) return { lines: [raw], fs: 46, lh: 0 };
  if (chars.length === 4) return { lines: [chars.slice(0, 2).join(''), chars.slice(2).join('')], fs: 40, lh: 44 };
  const cut = Math.ceil(Math.min(chars.length, 6) / 2);
  return { lines: [chars.slice(0, cut).join(''), chars.slice(cut, 6).join('')], fs: 36, lh: 40 };
}

/** 朱紅印泥質感濾鏡：邊緣微抖 + 墨色不均 */
function InkFilter({ id, seed }) {
  return (
    <filter id={id} x="-8%" y="-8%" width="116%" height="116%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} result="grain" />
      <feDisplacementMap in="SourceGraphic" in2="grain" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="shaken" />
      <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="3" seed={seed + 3} result="blot" />
      <feColorMatrix in="blot" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.7 1.65" result="mask" />
      <feComposite in="shaken" in2="mask" operator="in" />
    </filter>
  );
}

/** 景點專屬紀念章 */
export default function Seal({ spot, size = 140, rough = true, color = SEAL_RED, className = '' }) {
  const uid = useId().replace(/:/g, '');
  const fid = `ink-${uid}`;
  const seed = [...spot.code].reduce((a, c) => a + c.charCodeAt(0), 0) % 97;
  const { lines, fs, lh } = layoutName(spot.short || spot.name);
  const first = 100 - ((lines.length - 1) * lh) / 2 + fs * 0.35;

  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} role="img" aria-label={`${spot.name} 紀念章 ${spot.code}`}>
      {rough && (
        <defs>
          <InkFilter id={fid} seed={seed} />
        </defs>
      )}
      <g filter={rough ? `url(#${fid})` : undefined} fill={color} stroke={color}>
        <rect x="10" y="10" width="180" height="180" rx="24" fill="none" strokeWidth="9" />
        <rect x="24" y="24" width="152" height="152" rx="13" fill="none" strokeWidth="2.5" />
        <text x="100" y="47" textAnchor="middle" fontSize="15" letterSpacing="5" stroke="none" fontFamily='"Noto Serif TC", serif' fontWeight="700">
          臺灣觀光紀念
        </text>
        <line x1="42" y1="56" x2="158" y2="56" strokeWidth="1.6" />
        {lines.map((ln, i) => (
          <text
            key={ln + i}
            x="100"
            y={first + i * lh}
            textAnchor="middle"
            fontSize={fs}
            fontWeight="900"
            stroke="none"
            fontFamily='"Noto Serif TC", serif'
          >
            {ln}
          </text>
        ))}
        <line x1="42" y1="146" x2="158" y2="146" strokeWidth="1.6" />
        <text x="100" y="166" textAnchor="middle" fontSize="13.5" letterSpacing="1.5" stroke="none" fontWeight="700" fontFamily='"Noto Sans TC", sans-serif'>
          {spot.code}
        </text>
      </g>
    </svg>
  );
}

/** 證書用的方形大印「巡禮認證」 */
export function CertificateSeal({ size = 150, color = SEAL_RED, className = '' }) {
  const uid = useId().replace(/:/g, '');
  const fid = `cert-${uid}`;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} aria-hidden="true">
      <defs>
        <InkFilter id={fid} seed={11} />
      </defs>
      <g filter={`url(#${fid})`} fill={color} stroke={color}>
        <rect x="8" y="8" width="184" height="184" rx="10" fill="none" strokeWidth="12" />
        <rect x="26" y="26" width="148" height="148" rx="4" fill="none" strokeWidth="3" />
        {[
          ['巡', 63, 86],
          ['禮', 137, 86],
          ['認', 63, 158],
          ['證', 137, 158],
        ].map(([ch, x, y]) => (
          <text key={ch} x={x} y={y} textAnchor="middle" fontSize="62" fontWeight="900" stroke="none" fontFamily='"Noto Serif TC", serif'>
            {ch}
          </text>
        ))}
      </g>
    </svg>
  );
}
