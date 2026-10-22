/**
 * Web Audio API 合成「木槌敲章」聲：
 * 低頻撞擊（印章壓下）＋ 帶通噪音（木頭敲擊）＋ 木質共鳴泛音 ＋ 一次小回彈
 */
let ctx = null;

function getCtx() {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  return ctx;
}

/** 在使用者點擊的當下呼叫，解鎖行動裝置的音訊播放 */
export function primeAudio() {
  const c = getCtx();
  if (c && c.state === 'suspended') c.resume();
}

function noiseBuffer(c, seconds) {
  const len = Math.floor(c.sampleRate * seconds);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4);
  return buf;
}

function knock(c, out, t, gain) {
  // 1. 低頻撞擊
  const thump = c.createOscillator();
  thump.type = 'sine';
  thump.frequency.setValueAtTime(170, t);
  thump.frequency.exponentialRampToValueAtTime(42, t + 0.18);
  const tg = c.createGain();
  tg.gain.setValueAtTime(0.0001, t);
  tg.gain.exponentialRampToValueAtTime(1.1 * gain, t + 0.004);
  tg.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
  thump.connect(tg).connect(out);
  thump.start(t);
  thump.stop(t + 0.35);

  // 2. 木頭敲擊的噪音
  const noise = c.createBufferSource();
  noise.buffer = noiseBuffer(c, 0.2);
  const bp = c.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 950;
  bp.Q.value = 2.5;
  const ng = c.createGain();
  ng.gain.setValueAtTime(0.75 * gain, t);
  ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
  noise.connect(bp).connect(ng).connect(out);
  noise.start(t);

  // 3. 木質共鳴泛音
  [
    [410, 0.28, 0.16],
    [680, 0.14, 0.1],
    [1170, 0.07, 0.06],
  ].forEach(([f, g, dur]) => {
    const o = c.createOscillator();
    o.type = 'triangle';
    o.frequency.value = f;
    const og = c.createGain();
    og.gain.setValueAtTime(g * gain, t);
    og.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(og).connect(out);
    o.start(t);
    o.stop(t + dur + 0.02);
  });
}

export function playStampSound() {
  const c = getCtx();
  if (!c) return;
  if (c.state === 'suspended') c.resume();
  const t = c.currentTime + 0.005;
  const master = c.createGain();
  master.gain.value = 0.8;
  const comp = c.createDynamicsCompressor();
  master.connect(comp).connect(c.destination);
  knock(c, master, t, 1);
  knock(c, master, t + 0.085, 0.25); // 印章微微回彈
}
