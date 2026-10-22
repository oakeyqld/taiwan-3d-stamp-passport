import * as THREE from 'three';

/**
 * 輕量自定義台灣地形
 * ------------------------------------------------------------
 * 不使用任何地圖 API：以手繪海岸線多邊形 + 山脈稜線距離函數
 * 程序化產生低多邊形高度場（垂直比例誇張化，以利辨識山脈）。
 */

export const MAP = { cLng: 120.95, cLat: 23.75, scale: 10, lngK: 0.915 };

export const toWorld = (lng, lat) => [(lng - MAP.cLng) * MAP.scale * MAP.lngK, -(lat - MAP.cLat) * MAP.scale];
export const toLngLat = (x, z) => [x / (MAP.scale * MAP.lngK) + MAP.cLng, -z / MAP.scale + MAP.cLat];

/** 台灣本島海岸線（經度, 緯度），順時針自富貴角起 */
export const MAIN_OUTLINE = [
  [121.507, 25.29], [121.537, 25.3], [121.62, 25.235], [121.7, 25.21], [121.745, 25.15], [121.77, 25.168],
  [121.83, 25.14], [121.925, 25.13], [122.005, 25.01], [121.94, 25.0], [121.86, 24.88],
  [121.83, 24.72], [121.84, 24.6], [121.87, 24.56], [121.79, 24.42], [121.72, 24.25],
  [121.66, 24.12], [121.64, 24.0], [121.615, 23.85], [121.54, 23.65], [121.5, 23.45],
  [121.44, 23.25], [121.38, 23.1], [121.28, 22.95], [121.19, 22.77], [121.05, 22.64],
  [120.94, 22.45], [120.88, 22.3], [120.89, 22.1], [120.86, 21.95], [120.865, 21.895], [120.84, 21.9],
  [120.75, 21.92], [120.7, 21.95], [120.69, 22.08], [120.64, 22.25], [120.56, 22.37],
  [120.45, 22.47], [120.33, 22.56], [120.255, 22.615], [120.24, 22.78], [120.18, 22.92],
  [120.13, 23.05], [120.07, 23.15], [120.11, 23.3], [120.13, 23.45], [120.15, 23.6],
  [120.2, 23.74], [120.29, 23.9], [120.38, 24.06], [120.47, 24.2], [120.54, 24.3],
  [120.62, 24.43], [120.7, 24.58], [120.83, 24.72], [120.92, 24.84], [121.0, 24.95],
  [121.09, 25.04], [121.2, 25.1], [121.35, 25.15], [121.42, 25.18], [121.45, 25.25],
];

/** 中央山脈主稜線 */
const RIDGE = [
  [121.55, 24.8], [121.4, 24.55], [121.25, 24.38], [121.25, 24.15], [121.1, 23.85],
  [120.96, 23.47], [120.9, 23.1], [120.82, 22.7], [120.8, 22.35], [120.82, 22.05],
];
/** 海岸山脈 */
const COASTAL = [[121.58, 23.95], [121.45, 23.55], [121.35, 23.25], [121.2, 22.9]];
/** 阿里山山脈 */
const ALISHAN = [[120.85, 23.75], [120.78, 23.4], [120.72, 23.1]];
/** 平原壓低（宜蘭平原） */
const PLAIN_DAMP = [{ lng: 121.75, lat: 24.7, s: 0.004 }];

/** 離島（以顯示座標繪製；金門、馬祖為示意插圖位置） */
export const ISLANDS = [
  { name: '澎湖本島', lng: 119.58, lat: 23.58, rx: 0.09, ry: 0.12, h: 0.1 },
  { name: '白沙', lng: 119.66, lat: 23.62, rx: 0.05, ry: 0.04, h: 0.08 },
  { name: '西嶼', lng: 119.52, lat: 23.66, rx: 0.04, ry: 0.07, h: 0.08 },
  { name: '吉貝', lng: 119.61, lat: 23.74, rx: 0.02, ry: 0.012, h: 0.05 },
  { name: '望安', lng: 119.5, lat: 23.37, rx: 0.03, ry: 0.02, h: 0.06 },
  { name: '七美', lng: 119.43, lat: 23.21, rx: 0.025, ry: 0.02, h: 0.06 },
  { name: '綠島', lng: 121.49, lat: 22.66, rx: 0.035, ry: 0.04, h: 0.25 },
  { name: '蘭嶼', lng: 121.55, lat: 22.04, rx: 0.05, ry: 0.04, h: 0.35 },
  { name: '小琉球', lng: 120.37, lat: 22.34, rx: 0.02, ry: 0.02, h: 0.08 },
  { name: '龜山島', lng: 121.95, lat: 24.84, rx: 0.015, ry: 0.01, h: 0.35 },
  { name: '金門', lng: 119.22, lat: 24.6, rx: 0.14, ry: 0.07, h: 0.12 },
  { name: '小金門', lng: 119.09, lat: 24.58, rx: 0.04, ry: 0.03, h: 0.08 },
  { name: '南竿', lng: 119.93, lat: 25.61, rx: 0.03, ry: 0.02, h: 0.2 },
  { name: '北竿', lng: 119.99, lat: 25.67, rx: 0.03, ry: 0.02, h: 0.2 },
];

export const ISLAND_LABELS = [
  { text: '澎湖', lng: 119.58, lat: 23.84 },
  { text: '金門（示意位置）', lng: 119.2, lat: 24.76 },
  { text: '馬祖（示意位置）', lng: 119.96, lat: 25.8 },
  { text: '綠島', lng: 121.49, lat: 22.75 },
  { text: '蘭嶼', lng: 121.55, lat: 21.94 },
];

export const EXTENT = { minLng: 118.85, maxLng: 122.25, minLat: 21.75, maxLat: 25.95 };

/** 金門、馬祖距離本島較遠，以「地圖插圖」方式平移到示意位置 */
export function displayLngLat(lng, lat) {
  if (lng < 118.8) return [lng + 0.85, lat + 0.15];
  if (lat > 25.85) return [lng, lat - 0.55];
  return [lng, lat];
}

const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function pointInPolygon(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function distToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const l2 = dx * dx + dy * dy;
  let t = l2 ? ((px - ax) * dx + (py - ay) * dy) / l2 : 0;
  t = Math.max(0, Math.min(1, t));
  const x = ax + t * dx - px;
  const y = ay + t * dy - py;
  return Math.sqrt(x * x + y * y);
}

function distToPolyline(px, py, pts, closed = false) {
  let d = Infinity;
  const n = pts.length;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % n];
    d = Math.min(d, distToSegment(px, py, a[0], a[1], b[0], b[1]));
  }
  return d;
}

const noise = (lng, lat) =>
  Math.sin(lng * 23.1 + lat * 7.3) * 0.5 +
  Math.sin(lng * 41.7 - lat * 37.9) * 0.3 +
  Math.sin(lng * 91.3 + lat * 83.1) * 0.2;

/** 回傳 { h: 高度, land: 是否為陸地, coast: 距海岸程度 } */
export function terrainSample(lng, lat) {
  const n = noise(lng, lat);
  const dEdge = distToPolyline(lng, lat, MAIN_OUTLINE, true);

  if (pointInPolygon(lng, lat, MAIN_OUTLINE)) {
    const coast = smoothstep(0, 0.12, dEdge);
    const taper = (1 - smoothstep(24.6, 25.0, lat)) * smoothstep(21.9, 22.45, lat);
    let damp = 1;
    for (const p of PLAIN_DAMP) {
      const dd = (lng - p.lng) ** 2 + (lat - p.lat) ** 2;
      damp *= 1 - 0.85 * Math.exp(-dd / p.s);
    }
    const dr = distToPolyline(lng, lat, RIDGE);
    const dc = distToPolyline(lng, lat, COASTAL);
    const da = distToPolyline(lng, lat, ALISHAN);
    const dy = (lng - 121.55) ** 2 + (lat - 25.17) ** 2; // 大屯火山群

    let h = 0.07 + 0.08 * coast;
    h += 2.35 * Math.exp(-(dr * dr) / 0.05) * taper * damp;
    h += 0.65 * Math.exp(-(dc * dc) / 0.0022) * smoothstep(22.7, 23.0, lat) * (1 - smoothstep(23.9, 24.05, lat));
    h += 0.8 * Math.exp(-(da * da) / 0.006);
    h += 0.55 * Math.exp(-dy / 0.004);
    h *= 0.35 + 0.65 * coast;
    h += n * (0.03 + 0.12 * Math.min(1, h / 1.5)) * coast;
    return { h: Math.max(0.05, h), land: true, coast };
  }

  let nearIsland = Infinity;
  for (const isl of ISLANDS) {
    const u = (lng - isl.lng) / isl.rx;
    const v = (lat - isl.lat) / isl.ry;
    const r2 = u * u + v * v;
    if (r2 < 1) {
      const k = 1 - r2;
      return { h: Math.max(0.05, 0.05 + isl.h * k + n * 0.02 * k), land: true, coast: k };
    }
    nearIsland = Math.min(nearIsland, (Math.sqrt(r2) - 1) * Math.max(isl.rx, isl.ry));
  }
  const d = Math.min(dEdge, nearIsland);
  return { h: -0.12 - 0.75 * smoothstep(0, 0.5, d) + n * 0.03, land: false, coast: d };
}

export const terrainHeight = (lng, lat) => terrainSample(lng, lat).h;

const C = {
  sand: new THREE.Color('#ecdcaa'),
  grass: new THREE.Color('#a3d16f'),
  field: new THREE.Color('#79b85a'),
  forest: new THREE.Color('#3e8c4a'),
  deep: new THREE.Color('#2a6440'),
  rock: new THREE.Color('#8e8573'),
  snow: new THREE.Color('#f5f5f2'),
  shelf: new THREE.Color('#6cc3c9'),
  ocean: new THREE.Color('#1d5a82'),
};

function colorFor(s, n, out) {
  if (!s.land) return out.copy(C.shelf).lerp(C.ocean, smoothstep(0, 0.4, s.coast));
  const h = s.h;
  if (s.coast < 0.25 && h < 0.16) return out.copy(C.sand).lerp(C.grass, s.coast / 0.25);
  if (h < 0.3) out.copy(C.grass).lerp(C.field, smoothstep(0.1, 0.3, h)).offsetHSL(0, 0, n * 0.025);
  else if (h < 1.0) out.copy(C.field).lerp(C.forest, smoothstep(0.3, 1.0, h));
  else if (h < 1.8) out.copy(C.forest).lerp(C.deep, smoothstep(1.0, 1.8, h));
  else if (h < 2.34) out.copy(C.deep).lerp(C.rock, smoothstep(1.8, 2.3, h));
  else out.copy(C.rock).lerp(C.snow, smoothstep(2.45, 2.65, h));
  return out;
}

/** 建立帶頂點色彩的低多邊形地形幾何 */
export function buildTerrainGeometry(segX = 150, segZ = 200) {
  const [x0, z0] = toWorld(EXTENT.minLng, EXTENT.maxLat);
  const [x1, z1] = toWorld(EXTENT.maxLng, EXTENT.minLat);
  const g = new THREE.PlaneGeometry(x1 - x0, z1 - z0, segX, segZ);
  g.rotateX(-Math.PI / 2);
  g.translate((x0 + x1) / 2, 0, (z0 + z1) / 2);

  const pos = g.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const col = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const [lng, lat] = toLngLat(pos.getX(i), pos.getZ(i));
    const s = terrainSample(lng, lat);
    pos.setY(i, s.h);
    colorFor(s, noise(lng, lat), col);
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}

/** 景點在 3D 場景中的位置 [x, y, z] */
export function spotPosition(spot) {
  const [lng, lat] = displayLngLat(spot.lng, spot.lat);
  const [x, z] = toWorld(lng, lat);
  return [x, Math.max(terrainHeight(lng, lat), 0.03), z];
}

/** 夜景城市燈光點位 */
const CITIES = [
  [121.52, 25.04, 110, 0.07], [121.3, 24.99, 45, 0.07], [120.97, 24.8, 35, 0.05],
  [120.67, 24.15, 85, 0.08], [120.54, 24.08, 30, 0.05], [120.45, 23.48, 25, 0.04],
  [120.2, 23.0, 60, 0.06], [120.31, 22.64, 85, 0.07], [121.75, 24.75, 25, 0.05],
  [121.6, 23.98, 18, 0.03], [121.14, 22.76, 15, 0.03], [121.74, 25.13, 15, 0.025],
  [119.57, 23.57, 10, 0.02], [120.95, 23.95, 12, 0.03],
];

export function cityLightPoints() {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const gauss = () => Math.sqrt(-2 * Math.log(rnd() || 1e-6)) * Math.cos(2 * Math.PI * rnd());
  const palette = ['#ffd27a', '#ffe9b0', '#ffb85c', '#fff3d6', '#ffcf8a'];
  const pts = [];
  const add = (lng, lat) => {
    const s = terrainSample(lng, lat);
    if (!s.land || s.h > 0.7) return;
    const [x, z] = toWorld(lng, lat);
    pts.push([x, s.h, z, palette[Math.floor(rnd() * palette.length)]]);
  };
  for (const [lng, lat, count, spread] of CITIES) {
    for (let i = 0; i < count; i++) add(lng + gauss() * spread, lat + gauss() * spread * 0.8);
  }
  // 西部走廊（國道）燈帶
  for (let i = 0; i < 140; i++) {
    const t = i / 139;
    add(121.3 - t * 0.97 + Math.sin(t * 9) * 0.03, 25.0 - t * 2.36);
  }
  return pts;
}

/** 兩點大圓距離（公里） */
export function haversineKm(a, b) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
