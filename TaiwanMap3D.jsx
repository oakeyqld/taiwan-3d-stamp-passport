import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { buildTerrainGeometry, cityLightPoints, ISLAND_LABELS, spotPosition, terrainHeight, toWorld } from './geo';
import { CATEGORIES } from './spotsData';

/* ------------------------------------------------------------------ */
/* 光影與氣氛設定                                                        */
/* ------------------------------------------------------------------ */
export const MOODS = {
  day: {
    fog: '#d6eef8', ambient: 0.5, ambientColor: '#ffffff', sky: '#e3f4ff', ground: '#6b8f5e', hemi: 0.8,
    sun: 2.2, sunColor: '#fff4dc', sunPos: [18, 30, 14], water: '#3b9fd1', deep: '#1d5f8a', waterOpacity: 0.8,
  },
  sunset: {
    fog: '#f6b48c', ambient: 0.55, ambientColor: '#ffd2a8', sky: '#ffb37a', ground: '#5a4a6b', hemi: 0.7,
    sun: 3.4, sunColor: '#ff9a45', sunPos: [-30, 9, 8], water: '#5a6f9c', deep: '#2b3560', waterOpacity: 0.82,
  },
  night: {
    fog: '#0a1024', ambient: 0.35, ambientColor: '#7c8cff', sky: '#2a3a7a', ground: '#0b0f1f', hemi: 0.4,
    sun: 0.9, sunColor: '#9fb6ff', sunPos: [-12, 25, -10], water: '#0e2242', deep: '#050b1a', waterOpacity: 0.9,
  },
};

/* ------------------------------------------------------------------ */
/* 共用材質與幾何（所有地標共用，降低記憶體與 draw call 成本）              */
/* ------------------------------------------------------------------ */
const std = (color, opts = {}) =>
  new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0, flatShading: true, roughness: 0.6, metalness: 0.05, ...opts });
const DS = { side: THREE.DoubleSide };

const MAT = {
  steel: std('#e2e8f0'), wheel: std('#ff5fa2'), hub: std('#facc15'),
  c0: std('#ef4444'), c1: std('#f97316'), c2: std('#facc15'), c3: std('#22c55e'),
  c4: std('#06b6d4'), c5: std('#3b82f6'), c6: std('#8b5cf6'), c7: std('#ec4899'),
  mountLight: std('#7ddc4a', DS), mountDark: std('#2f7d32', DS), snow: std('#ffffff'),
  paper: std('#fbf7ee', DS), paintRed: std('#e0313b', DS), paintBlue: std('#2563eb', DS),
  paintGreen: std('#16a34a', DS), paintGold: std('#f59e0b', DS), wood: std('#8b5a2b'),
  corn: std('#ffd43b'), huskLight: std('#9bd35a'), huskDark: std('#4f9a2f'), tassel: std('#b7791f'),
  trunkA: std('#a26b3d'), trunkB: std('#8a5a32'), leafA: std('#2fb35a', DS), leafB: std('#1f8a45', DS), coconut: std('#6b4423'),
  cat_nature: std(CATEGORIES.nature.color), cat_coast: std(CATEGORIES.coast.color), cat_culture: std(CATEGORIES.culture.color),
  cat_landmark: std(CATEGORIES.landmark.color), cat_food: std(CATEGORIES.food.color),
};
const SEAL_MAT = new THREE.MeshStandardMaterial({ color: '#d42a2a', emissive: '#ff2d2d', emissiveIntensity: 0.55, roughness: 0.4, flatShading: true });
const SEAL_RING_MAT = new THREE.MeshStandardMaterial({ color: '#fde68a', emissive: '#fbbf24', emissiveIntensity: 0.6, roughness: 0.3 });
const CABINS = ['c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'];
const PAINTS = ['paintRed', 'paintBlue', 'paintGreen', 'paintGold'];

const GEO = {
  pedestal: new THREE.CylinderGeometry(0.36, 0.42, 0.08, 10),
  leg: new THREE.BoxGeometry(0.05, 1.0, 0.05),
  rim: new THREE.TorusGeometry(0.5, 0.035, 6, 24),
  spoke: new THREE.BoxGeometry(1.0, 0.025, 0.025),
  cabin: new THREE.BoxGeometry(0.13, 0.13, 0.13),
  hub: new THREE.SphereGeometry(0.07, 8, 6),
  mountR: new THREE.ConeGeometry(0.55, 1.1, 3, 1, false, 0, Math.PI),
  mountL: new THREE.ConeGeometry(0.55, 1.1, 3, 1, false, Math.PI, Math.PI),
  snow: new THREE.ConeGeometry(0.16, 0.32, 6),
  canopy: new THREE.ConeGeometry(0.62, 0.28, 16, 1, true),
  strips: [0, 1, 2, 3].map((i) => new THREE.ConeGeometry(0.626, 0.283, 3, 1, true, (i * Math.PI) / 2 + 0.2, Math.PI / 7)),
  umbRim: new THREE.TorusGeometry(0.62, 0.022, 4, 28),
  handle: new THREE.CylinderGeometry(0.025, 0.025, 1.0, 6),
  tip: new THREE.SphereGeometry(0.045, 6, 4),
  cob: new THREE.SphereGeometry(0.22, 7, 9),
  husk: new THREE.ConeGeometry(0.16, 0.75, 4),
  tassel: new THREE.ConeGeometry(0.06, 0.16, 5),
  trunk: new THREE.CylinderGeometry(0.05, 0.065, 0.3, 6),
  frond: new THREE.ConeGeometry(0.11, 0.7, 3),
  coconut: new THREE.SphereGeometry(0.06, 6, 5),
  sealDisk: new THREE.CylinderGeometry(0.2, 0.2, 0.05, 8),
  sealRing: new THREE.TorusGeometry(0.27, 0.02, 4, 24),
  pulse: new THREE.RingGeometry(0.5, 0.6, 32),
};

/* ------------------------------------------------------------------ */
/* 五種低多邊形地標造型                                                   */
/* ------------------------------------------------------------------ */
function FerrisWheel() {
  const wheel = useRef();
  useFrame((_, dt) => {
    if (wheel.current) wheel.current.rotation.z += dt * 0.6;
  });
  return (
    <group>
      {[-1, 1].map((side) =>
        [0.1, -0.1].map((z) => (
          <mesh key={`${side}${z}`} geometry={GEO.leg} material={MAT.steel} position={[side * 0.13, 0.48, z]} rotation-z={side * 0.24} castShadow />
        )),
      )}
      <group ref={wheel} position-y={0.95}>
        <mesh geometry={GEO.rim} material={MAT.wheel} castShadow />
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} geometry={GEO.spoke} material={MAT.steel} rotation-z={(i * Math.PI) / 4} />
        ))}
        {CABINS.map((c, i) => {
          const a = (i / 8) * Math.PI * 2;
          return <mesh key={c} geometry={GEO.cabin} material={MAT[c]} position={[Math.cos(a) * 0.5, Math.sin(a) * 0.5, 0]} castShadow />;
        })}
        <mesh geometry={GEO.hub} material={MAT.hub} />
      </group>
    </group>
  );
}

function MountainModel() {
  // 三角錐山：左側亮綠、右側暗綠
  return (
    <group>
      <mesh geometry={GEO.mountL} material={MAT.mountLight} position-y={0.55} castShadow />
      <mesh geometry={GEO.mountR} material={MAT.mountDark} position-y={0.55} castShadow />
      <mesh geometry={GEO.snow} material={MAT.snow} position-y={0.94} />
    </group>
  );
}

function UmbrellaModel() {
  // 美濃紙傘：白底彩繪
  return (
    <group rotation-z={0.18}>
      <mesh geometry={GEO.handle} material={MAT.wood} position-y={0.5} castShadow />
      <group position-y={1.0}>
        <mesh geometry={GEO.canopy} material={MAT.paper} castShadow />
        {GEO.strips.map((g, i) => (
          <mesh key={i} geometry={g} material={MAT[PAINTS[i]]} />
        ))}
        <mesh geometry={GEO.umbRim} material={MAT.paintRed} position-y={-0.14} rotation-x={Math.PI / 2} />
        <mesh geometry={GEO.tip} material={MAT.wood} position-y={0.16} />
      </group>
    </group>
  );
}

function CornModel() {
  return (
    <group>
      <mesh geometry={GEO.cob} material={MAT.corn} position-y={0.62} scale={[1, 1.7, 1]} castShadow />
      <mesh geometry={GEO.husk} material={MAT.huskLight} position={[-0.13, 0.42, 0.04]} rotation-z={0.35} scale={[1, 1, 0.35]} castShadow />
      <mesh geometry={GEO.husk} material={MAT.huskDark} position={[0.13, 0.42, -0.02]} rotation-z={-0.35} scale={[1, 1, 0.35]} castShadow />
      <mesh geometry={GEO.husk} material={MAT.huskLight} position={[0, 0.38, 0.12]} rotation-x={0.3} scale={[1, 0.85, 0.35]} />
      <mesh geometry={GEO.tassel} material={MAT.tassel} position-y={1.06} />
    </group>
  );
}

const TRUNK = [
  { p: [0, 0.15, 0], r: -0.08 },
  { p: [0.04, 0.43, 0], r: -0.16 },
  { p: [0.1, 0.7, 0], r: -0.24 },
  { p: [0.18, 0.96, 0], r: -0.32 },
];
function PalmModel() {
  return (
    <group>
      {TRUNK.map((t, i) => (
        <mesh key={i} geometry={GEO.trunk} material={i % 2 ? MAT.trunkA : MAT.trunkB} position={t.p} rotation-z={t.r} castShadow />
      ))}
      <group position={[0.22, 1.12, 0]}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <group key={i} rotation-y={(i * Math.PI) / 3}>
            <group rotation-x={i % 2 ? 1.35 : 1.75}>
              <mesh geometry={GEO.frond} material={i % 2 ? MAT.leafA : MAT.leafB} position-y={0.33} scale={[1, 1, 0.3]} castShadow />
            </group>
          </group>
        ))}
        {[0, 1, 2].map((i) => (
          <mesh key={i} geometry={GEO.coconut} material={MAT.coconut} position={[Math.cos(i * 2.1) * 0.08, -0.07, Math.sin(i * 2.1) * 0.08]} />
        ))}
      </group>
    </group>
  );
}

const MODELS = { landmark: FerrisWheel, nature: MountainModel, culture: UmbrellaModel, food: CornModel, coast: PalmModel };

/* ------------------------------------------------------------------ */
/* 地標標記                                                              */
/* ------------------------------------------------------------------ */
function CollectedBadge() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 1.5;
    ref.current.position.y = 1.6 + Math.sin(clock.elapsedTime * 2) * 0.06;
  });
  return (
    <group ref={ref} position-y={1.6}>
      <mesh geometry={GEO.sealDisk} material={SEAL_MAT} rotation-x={Math.PI / 2} />
      <mesh geometry={GEO.sealRing} material={SEAL_RING_MAT} />
    </group>
  );
}

function PulseRing({ color }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (clock.elapsedTime * 0.9) % 1;
    ref.current.scale.setScalar(0.6 + t * 0.9);
    ref.current.material.opacity = 0.85 * (1 - t);
  });
  return (
    <mesh ref={ref} geometry={GEO.pulse} rotation-x={-Math.PI / 2} position-y={0.03}>
      <meshBasicMaterial color={color} transparent depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

const BASE_SCALE = 0.55;

const SpotMarker = memo(function SpotMarker({ spot, collected, active, onHover, onSelect }) {
  const scaler = useRef();
  const position = useMemo(() => spotPosition(spot), [spot]);
  const Model = MODELS[spot.category];
  const color = CATEGORIES[spot.category].color;

  useFrame((_, dt) => {
    const g = scaler.current;
    if (!g) return;
    const target = active ? BASE_SCALE * 1.4 : BASE_SCALE;
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, target, 10, dt));
  });

  return (
    <group position={position}>
      <group
        ref={scaler}
        scale={BASE_SCALE}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(spot.id);
        }}
        onPointerOut={() => onHover((h) => (h === spot.id ? null : h))}
        onClick={(e) => {
          e.stopPropagation();
          if (e.delta > 8) return; // 拖曳地圖時不觸發
          onSelect(spot);
        }}
      >
        <mesh geometry={GEO.pedestal} material={MAT[`cat_${spot.category}`]} position-y={0.04} castShadow receiveShadow />
        <group position-y={0.08}>
          <Model />
        </group>
        {collected && <CollectedBadge />}
      </group>
      {active && (
        <>
          <PulseRing color={color} />
          <Html position={[0, 1.05, 0]} center distanceFactor={14} zIndexRange={[30, 0]} style={{ pointerEvents: 'none' }}>
            <div className="whitespace-nowrap rounded-full bg-white/95 px-3 py-1 text-[13px] font-bold text-slate-800 shadow-lg ring-1 ring-black/5">
              <span className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle" style={{ background: color }} />
              {spot.name}
              {collected && <span className="ml-1.5 text-vermilion-600">✓ 已集章</span>}
            </div>
          </Html>
        </>
      )}
    </group>
  );
});

/* ------------------------------------------------------------------ */
/* 環境元素                                                              */
/* ------------------------------------------------------------------ */
function Terrain() {
  const geometry = useMemo(() => buildTerrainGeometry(), []);
  return (
    <mesh geometry={geometry} receiveShadow castShadow>
      <meshStandardMaterial vertexColors flatShading roughness={0.92} metalness={0} />
    </mesh>
  );
}

function Water({ cfg }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = Math.sin(clock.elapsedTime * 0.6) * 0.015;
  });
  return (
    <>
      <mesh ref={ref} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[220, 220]} />
        <meshStandardMaterial color={cfg.water} transparent opacity={cfg.waterOpacity} roughness={0.22} metalness={0.15} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={-0.88}>
        <planeGeometry args={[220, 220]} />
        <meshStandardMaterial color="#1d5a82" roughness={1} />
      </mesh>
    </>
  );
}

function CityLights() {
  const points = useMemo(() => cityLightPoints(), []);
  const ref = useRef();
  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const c = new THREE.Color();
    points.forEach((p, i) => {
      m.makeTranslation(p[0], p[1] + 0.03, p[2]);
      mesh.setMatrixAt(i, m);
      mesh.setColorAt(i, c.set(p[3]));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [points]);
  return (
    <instancedMesh ref={ref} args={[null, null, points.length]}>
      <sphereGeometry args={[0.045, 6, 6]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

function Clouds({ mood }) {
  const group = useRef();
  const clouds = useMemo(
    () => Array.from({ length: 6 }, (_, i) => ({ x: -28 + i * 10, y: 5 + (i % 3) * 0.8, z: -20 + ((i * 13) % 38), s: 0.55 + (i % 3) * 0.2, speed: 0.25 + (i % 4) * 0.08 })),
    [],
  );
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 0), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffffff', flatShading: true, transparent: true, opacity: 0.88 }), []);
  useEffect(() => {
    material.color.set(mood === 'sunset' ? '#ffd9c2' : '#ffffff');
  }, [mood, material]);
  useFrame((_, dt) => {
    group.current?.children.forEach((c, i) => {
      c.position.x += clouds[i].speed * dt;
      if (c.position.x > 30) c.position.x = -32;
    });
  });
  return (
    <group ref={group}>
      {clouds.map((c, i) => (
        <group key={i} position={[c.x, c.y, c.z]} scale={c.s}>
          <mesh geometry={geometry} material={material} />
          <mesh geometry={geometry} material={material} position={[1.1, -0.2, 0.2]} scale={0.75} />
          <mesh geometry={geometry} material={material} position={[-1.0, -0.25, -0.1]} scale={0.65} />
        </group>
      ))}
    </group>
  );
}

function CelestialBody({ mood }) {
  if (mood === 'day') return null;
  const night = mood === 'night';
  return (
    <mesh position={night ? [-55, 38, -85] : [-85, 9, -40]}>
      <sphereGeometry args={[night ? 3 : 7, 24, 16]} />
      <meshBasicMaterial color={night ? '#eef2ff' : '#ffb15c'} fog={false} toneMapped={false} />
    </mesh>
  );
}

function IslandLabels({ mood }) {
  const items = useMemo(
    () =>
      ISLAND_LABELS.map((l) => {
        const [x, z] = toWorld(l.lng, l.lat);
        return { ...l, pos: [x, Math.max(terrainHeight(l.lng, l.lat), 0) + 0.4, z] };
      }),
    [],
  );
  const cls = mood === 'night' ? 'text-cyan-100/90' : mood === 'sunset' ? 'text-stone-800/80' : 'text-sky-950/70';
  return items.map((l) => (
    <Html key={l.text} position={l.pos} center distanceFactor={18} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
      <div className={`whitespace-nowrap font-serif text-[15px] font-bold tracking-widest ${cls}`}>{l.text}</div>
    </Html>
  ));
}

function Lights({ cfg }) {
  return (
    <>
      <ambientLight intensity={cfg.ambient} color={cfg.ambientColor} />
      <hemisphereLight args={[cfg.sky, cfg.ground, cfg.hemi]} />
      <directionalLight
        castShadow
        position={cfg.sunPos}
        intensity={cfg.sun}
        color={cfg.sunColor}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-26}
        shadow-camera-right={26}
        shadow-camera-top={28}
        shadow-camera-bottom={-28}
        shadow-camera-near={1}
        shadow-camera-far={120}
        shadow-bias={-0.0008}
        shadow-normalBias={0.03}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 相機動畫：3D/2D 切換、南北平移、縮放、聚焦景點                           */
/* ------------------------------------------------------------------ */
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const FREE_POLAR = Math.PI / 2.15;
export const HOME_TARGET = [0, 0, 2];
/** 直式手機螢幕需要把鏡頭拉遠，才能看到整座台灣 */
const homeFactor = (aspect) => (aspect < 0.8 ? 1.75 : aspect < 1.2 ? 1.3 : 1);
function homePosition(aspect, mode) {
  const k = homeFactor(aspect);
  return mode === '2d' ? new THREE.Vector3(0, 42 * k, 2.001) : new THREE.Vector3(0, 30 * k, 2 + 26 * k);
}

function CameraRig({ controlsRef, command, viewMode }) {
  const { camera, size } = useThree();
  const aspect = size.width / Math.max(1, size.height);

  // 首次載入：依螢幕比例調整鏡頭距離
  useEffect(() => {
    camera.position.copy(homePosition(aspect, '3d'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const anim = useRef(null);
  const modeRef = useRef(viewMode);

  const start = (toPos, toTgt, dur) => {
    const c = controlsRef.current;
    if (!c) return;
    c.minPolarAngle = 0;
    c.maxPolarAngle = FREE_POLAR;
    c.enableDamping = false;
    anim.current = { fromPos: camera.position.clone(), fromTgt: c.target.clone(), toPos, toTgt, t: 0, dur };
  };

  useEffect(() => {
    modeRef.current = viewMode;
    const c = controlsRef.current;
    if (!c) return;
    const tgt = c.target.clone();
    const dist = camera.position.distanceTo(tgt);
    const offset = viewMode === '2d' ? new THREE.Vector3(0, dist, 0.001) : new THREE.Vector3(0, dist * 0.72, dist * 0.69);
    start(tgt.clone().add(offset), tgt, 1.0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  useEffect(() => {
    if (!command) return;
    const c = controlsRef.current;
    if (!c) return;
    const tgt = c.target.clone();
    const off = camera.position.clone().sub(tgt);
    let toTgt = tgt.clone();
    let toPos;
    switch (command.type) {
      case 'pan': {
        toTgt.add(new THREE.Vector3(command.dx || 0, 0, command.dz || 0));
        toTgt.x = clamp(toTgt.x, -26, 16);
        toTgt.z = clamp(toTgt.z, -24, 22);
        toPos = toTgt.clone().add(off);
        break;
      }
      case 'zoom': {
        off.setLength(clamp(off.length() * command.factor, 5, 90));
        toPos = tgt.clone().add(off);
        break;
      }
      case 'focus': {
        toTgt = new THREE.Vector3(command.position[0], 0, command.position[2]);
        off.setLength(Math.min(off.length(), command.distance || 15));
        toPos = toTgt.clone().add(off);
        break;
      }
      case 'reset':
      default: {
        toTgt = new THREE.Vector3(...HOME_TARGET);
        toPos = homePosition(aspect, modeRef.current);
      }
    }
    start(toPos, toTgt, command.type === 'zoom' || command.type === 'pan' ? 0.55 : 1.0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [command]);

  useFrame((_, dt) => {
    const a = anim.current;
    const c = controlsRef.current;
    if (!a || !c) return;
    a.t = Math.min(1, a.t + dt / a.dur);
    const e = easeInOutCubic(a.t);
    camera.position.lerpVectors(a.fromPos, a.toPos, e);
    c.target.lerpVectors(a.fromTgt, a.toTgt, e);
    c.update();
    if (a.t >= 1) {
      anim.current = null;
      c.enableDamping = true;
      if (modeRef.current === '2d') {
        c.minPolarAngle = 0;
        c.maxPolarAngle = 0;
      }
    }
  });
  return null;
}

/* ------------------------------------------------------------------ */
/* 場景                                                                 */
/* ------------------------------------------------------------------ */
function Scene({ spots, stamps, selectedId, mood, viewMode, command, onSelectSpot }) {
  const cfg = MOODS[mood];
  const controls = useRef();
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  // 夜景模式：地標材質發光
  useEffect(() => {
    const glow = mood === 'night' ? 0.45 : 0;
    Object.values(MAT).forEach((m) => {
      m.emissiveIntensity = glow;
    });
  }, [mood]);

  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    c.target.set(...HOME_TARGET);
    c.maxPolarAngle = FREE_POLAR;
    c.update();
  }, []);

  const twoD = viewMode === '2d';

  return (
    <>
      <fog attach="fog" args={[cfg.fog, 45, 120]} />
      <Lights cfg={cfg} />
      <CelestialBody mood={mood} />
      {mood === 'night' && <Stars radius={150} depth={50} count={3000} factor={4} saturation={0} fade speed={0.8} />}
      {mood === 'night' && <CityLights />}
      {mood !== 'night' && <Clouds mood={mood} />}
      <Terrain />
      <Water cfg={cfg} />
      <IslandLabels mood={mood} />
      {spots.map((s) => (
        <SpotMarker
          key={s.id}
          spot={s}
          collected={Boolean(stamps[s.id])}
          active={hovered === s.id || selectedId === s.id}
          onHover={setHovered}
          onSelect={onSelectSpot}
        />
      ))}
      <OrbitControls
        ref={controls}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={5}
        maxDistance={90}
        screenSpacePanning={false}
        mouseButtons={{
          LEFT: twoD ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: twoD ? THREE.MOUSE.ROTATE : THREE.MOUSE.PAN,
        }}
        touches={{ ONE: twoD ? THREE.TOUCH.PAN : THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }}
      />
      <CameraRig controlsRef={controls} command={command} viewMode={viewMode} />
    </>
  );
}

export default function TaiwanMap3D(props) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [0, 30, 28], fov: 45, near: 0.1, far: 400 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ touchAction: 'none' }}
    >
      <Scene {...props} />
    </Canvas>
  );
}

