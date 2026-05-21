import { Html, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import { CatmullRomCurve3, Vector3 } from "three";
import type { ChemicalElement } from "@/data/elements";
import {
  buildElectronLevels,
  type ElectronOrbital,
  type ElectronSubshell,
  type SubshellType,
} from "@/lib/electronConfiguration";

type AtomSceneProps = {
  element: ChemicalElement;
  selectedOrbitalId?: string | null;
  visibleElectrons?: number;
};

type NucleusProps = {
  element: ChemicalElement;
};

type OrbitalTrack = {
  id: string;
  orbitalId: string;
  label: string;
  color: string;
  electronCount: number;
  kind: SubshellType;
  level: number;
  orbitalIndex: number;
  radius: number;
  rotation: [number, number, number];
  speed: number;
};

const shellNames = ["K", "L", "M", "N", "O", "P", "Q"];

const orbitalColors: Record<SubshellType, string> = {
  s: "#67e8f9",
  p: "#a78bfa",
  d: "#f0abfc",
  f: "#fde68a",
};

const orbitalOrder: SubshellType[] = ["s", "p", "d", "f"];
const levelSpacing = 1.16;
const orbitalSpacing = 0.11;
const trackSpacing = 0.04;
const dOrbitalVariants = ["dxy", "dyz", "dxz", "dx2y2", "dz2"] as const;
const fOrbitalVariants = [
  "fxyz",
  "fzx2y2",
  "fxx23y2",
  "fy3x2y2",
  "fxz2",
  "fyz2",
  "fz3",
] as const;

type DOrbitalVariant = (typeof dOrbitalVariants)[number];
type FOrbitalVariant = (typeof fOrbitalVariants)[number];

export function AtomScene({
  element,
  selectedOrbitalId,
  visibleElectrons,
}: AtomSceneProps) {
  return (
    <div className="h-full min-h-0 w-full flex-1">
      <Canvas camera={{ position: [0, 3.8, 14.5], fov: 50 }}>
        <color attach="background" args={["#070b16"]} />
        <ambientLight intensity={1.4} />
        <pointLight position={[4, 5, 6]} intensity={24} color="#7dd3fc" />
        <pointLight position={[-5, -3, -4]} intensity={12} color="#fb7185" />
        <AtomModel
          element={element}
          selectedOrbitalId={selectedOrbitalId}
          visibleElectrons={visibleElectrons}
        />
        <OrbitControls enablePan={false} minDistance={4.5} maxDistance={32} />
      </Canvas>
    </div>
  );
}

function AtomModel({
  element,
  selectedOrbitalId,
  visibleElectrons,
}: AtomSceneProps) {
  const groupRef = useRef<Group>(null);
  const displayedElectrons = visibleElectrons ?? element.electrons;
  const levels = buildElectronLevels(displayedElectrons);
  const activeOrbitalId = selectedOrbitalId ?? null;

  useFrame((_, delta) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.y += delta * 0.055;
  });

  return (
    <group ref={groupRef}>
      <Nucleus element={element} />
      {levels.map((level) => {
        const radius = getLevelRadius(level.level);

        return (
          <group key={level.level}>
            <LevelGuide level={level.level} radius={radius} />
            {level.subshells.map((orbital) => (
              <OrbitalGroup
                key={orbital.id}
                levelRadius={radius}
                orbital={orbital}
                selectedOrbitalId={activeOrbitalId}
              />
            ))}
          </group>
        );
      })}
    </group>
  );
}

function Nucleus({ element }: NucleusProps) {
  const particles = Math.min(element.protons + element.neutrons, 24);

  return (
    <group>
      {Array.from({ length: particles }, (_, particleIndex) => {
        const angle = particleIndex * 2.399;
        const radius = 0.16 + (particleIndex % 4) * 0.08;
        const y = ((particleIndex % 5) - 2) * 0.09;
        const isProton = particleIndex % 2 === 0;

        return (
          <mesh
            key={particleIndex}
            position={[Math.cos(angle) * radius, y, Math.sin(angle) * radius]}
          >
            <sphereGeometry args={[0.16, 22, 22]} />
            <meshStandardMaterial
              color={isProton ? "#fb7185" : "#cbd5e1"}
              emissive={isProton ? "#7f1d1d" : "#334155"}
              emissiveIntensity={0.24}
              roughness={0.42}
            />
          </mesh>
        );
      })}
      <Html center distanceFactor={8} position={[0, -0.82, 0]}>
        <span className="rounded-full border border-rose-300/20 bg-slate-950/75 px-2 py-1 text-[10px] font-bold text-rose-100">
          nucleus
        </span>
      </Html>
    </group>
  );
}

type LevelGuideProps = {
  level: number;
  radius: number;
};

function LevelGuide({ level, radius }: LevelGuideProps) {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.007, 8, 160]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.18} />
      </mesh>
      <Html center distanceFactor={8} position={[radius + 0.2, 0.12, 0]}>
        <span className="inline-flex whitespace-nowrap rounded-full border border-sky-300/20 bg-slate-950/75 px-2.5 py-1 text-[10px] leading-none font-bold text-sky-100">
          {shellNames[level - 1] ?? `n${level}`} / n={level}
        </span>
      </Html>
    </group>
  );
}

type OrbitalGroupProps = {
  levelRadius: number;
  orbital: ElectronSubshell;
  selectedOrbitalId?: string | null;
};

function OrbitalGroup({
  levelRadius,
  orbital,
  selectedOrbitalId,
}: OrbitalGroupProps) {
  const tracks = buildOrbitalTracks(orbital, levelRadius);
  const color = orbitalColors[orbital.type];
  const hasSelection = Boolean(selectedOrbitalId);
  const isSubshellSelected = selectedOrbitalId === orbital.id;
  const hasSelectedTrack = tracks.some(
    (track) => track.id === selectedOrbitalId,
  );
  const isGroupSelected = isSubshellSelected || hasSelectedTrack;

  return (
    <group>
      {tracks.map((track) => {
        const isTrackSelected = selectedOrbitalId === track.id;
        const isSelected = isSubshellSelected || isTrackSelected;

        return (
          <ElectronTrack
            hasFocus={hasSelection}
            isDimmed={hasSelection && !isSelected}
            isSelected={isSelected}
            key={track.id}
            showLabel={isTrackSelected}
            track={track}
          />
        );
      })}
      <OrbitalLabel
        color={color}
        isDimmed={hasSelection && !isGroupSelected}
        isSelected={isGroupSelected}
        levelRadius={levelRadius}
        orbital={orbital}
      />
    </group>
  );
}

function OrbitalLabel({
  color,
  levelRadius,
  orbital,
  isDimmed,
  isSelected,
}: {
  color: string;
  isDimmed: boolean;
  isSelected: boolean;
  levelRadius: number;
  orbital: ElectronSubshell;
}) {
  const index = orbitalOrder.indexOf(orbital.type);
  const angle = index * 0.78 + orbital.level * 0.2;
  const radius = levelRadius + 0.36 + index * 0.2;

  return (
    <Html
      center
      distanceFactor={8}
      position={[
        Math.cos(angle) * radius,
        0.42 + index * 0.16,
        Math.sin(angle) * radius,
      ]}
    >
      <span
        className="rounded-full border bg-slate-950/75 px-2 py-1 text-[10px] font-black text-white"
        style={{
          borderColor: color,
          color,
          opacity: isDimmed ? 0.32 : 1,
          transform: isSelected ? "scale(1.12)" : undefined,
        }}
      >
        {orbital.id}
      </span>
    </Html>
  );
}

function buildOrbitalTracks(
  orbital: ElectronSubshell,
  levelRadius: number,
): OrbitalTrack[] {
  const filledTracks = orbital.orbitals.filter((track) => track.electrons > 0);
  const baseRadius =
    levelRadius + orbitalOrder.indexOf(orbital.type) * orbitalSpacing;

  if (orbital.type === "s") {
    const track = filledTracks[0];

    if (!track) {
      return [];
    }

    return [createTrack(orbital, track, baseRadius, 0)];
  }

  return filledTracks.map((track, index) =>
    createTrack(orbital, track, baseRadius + index * trackSpacing, index),
  );
}

function createTrack(
  orbital: ElectronSubshell,
  track: ElectronOrbital,
  radius: number,
  index: number,
): OrbitalTrack {
  return {
    id: track.id,
    orbitalId: orbital.id,
    label: getTrackLabel(orbital.type, orbital.level, index),
    color: orbitalColors[orbital.type],
    electronCount: track.electrons,
    kind: orbital.type,
    level: orbital.level,
    orbitalIndex: index,
    radius,
    rotation: getTrackRotation(orbital.type, index),
    speed: 0.42 + orbital.level * 0.07 + index * 0.035,
  };
}

type ElectronTrackProps = {
  hasFocus: boolean;
  isDimmed: boolean;
  isSelected: boolean;
  showLabel: boolean;
  track: OrbitalTrack;
};

function ElectronTrack({
  hasFocus,
  isDimmed,
  isSelected,
  showLabel,
  track,
}: ElectronTrackProps) {
  const curve = useTrackCurve(track);
  const opacity = isDimmed ? 0.16 : isSelected ? 0.95 : 0.5;
  const tubeRadius = isSelected ? 0.022 : 0.011;

  return (
    <group rotation={track.rotation}>
      <mesh>
        <tubeGeometry args={[curve, 240, tubeRadius, 8, true]} />
        <meshBasicMaterial color={track.color} transparent opacity={opacity} />
      </mesh>
      {Array.from({ length: track.electronCount }, (_, electronIndex) => (
        <ElectronOnTrack
          electronIndex={electronIndex}
          hasFocus={hasFocus}
          isDimmed={isDimmed}
          isSelected={isSelected}
          key={electronIndex}
          track={track}
        />
      ))}
      {showLabel ? <TrackLabel track={track} /> : null}
    </group>
  );
}

function TrackLabel({ track }: { track: OrbitalTrack }) {
  const [x, y, z] = getTrackPoint(track, Math.PI / 4);

  return (
    <Html center distanceFactor={8} position={[x, y + 0.18, z]}>
      <span
        className="rounded-full border bg-slate-950/80 px-2 py-1 text-[10px] font-black text-white"
        style={{ borderColor: track.color, color: track.color }}
      >
        {track.label}
      </span>
    </Html>
  );
}

function useTrackCurve(track: OrbitalTrack) {
  return useMemo(() => {
    const points: Vector3[] = [];
    const segments = 240;

    for (let index = 0; index <= segments; index += 1) {
      const t = (index / segments) * Math.PI * 2;
      const [x, y, z] = getTrackPoint(track, t);

      points.push(new Vector3(x, y, z));
    }

    return new CatmullRomCurve3(points, false);
  }, [track]);
}

type ElectronOnTrackProps = {
  electronIndex: number;
  hasFocus: boolean;
  isDimmed: boolean;
  isSelected: boolean;
  track: OrbitalTrack;
};

function ElectronOnTrack({
  electronIndex,
  hasFocus,
  isDimmed,
  isSelected,
  track,
}: ElectronOnTrackProps) {
  const meshRef = useRef<Group>(null);
  const phase = track.electronCount === 1 ? 0 : electronIndex * Math.PI;
  const speed = isDimmed
    ? track.speed * 0.18
    : isSelected
      ? track.speed * 1.18
      : hasFocus
        ? track.speed
        : track.speed * 0.42;

  useFrame((state) => {
    if (!meshRef.current) {
      return;
    }

    const [x, y, z] = getTrackPoint(
      track,
      state.clock.elapsedTime * speed + phase,
    );

    meshRef.current.position.set(x, y, z);
  });

  return (
    <group ref={meshRef}>
      <mesh>
        <sphereGeometry args={[0.075, 18, 18]} />
        <meshStandardMaterial
          color="#e0f2fe"
          emissive="#06b6d4"
          emissiveIntensity={isDimmed ? 0.22 : isSelected ? 1.35 : 0.9}
          opacity={isDimmed ? 0.35 : 1}
          roughness={0.18}
          transparent={isDimmed}
        />
      </mesh>
    </group>
  );
}

function getTrackPoint(
  track: OrbitalTrack,
  t: number,
): [number, number, number] {
  const radius = track.radius;

  if (track.kind === "s") {
    return [Math.cos(t) * radius, Math.sin(t) * radius, 0];
  }

  if (track.kind === "p") {
    const major = Math.sin(t) * radius * 1.08;
    const minor = Math.sin(t * 2) * radius * 0.42;

    if (track.orbitalIndex % 3 === 0) {
      return [major, minor, 0];
    }

    if (track.orbitalIndex % 3 === 1) {
      return [0, major, minor];
    }

    return [minor, 0, major];
  }

  if (track.kind === "d") {
    return getDOrbitalPoint(
      dOrbitalVariants[track.orbitalIndex % dOrbitalVariants.length],
      radius,
      t,
    );
  }

  return getFOrbitalPoint(
    fOrbitalVariants[track.orbitalIndex % fOrbitalVariants.length],
    radius,
    t,
  );
}

function getTrackLabel(type: SubshellType, level: number, index: number) {
  if (type === "s") {
    return `${level}s`;
  }

  if (type === "p") {
    return `${level}p${["x", "y", "z"][index % 3]}`;
  }

  if (type === "d") {
    const labels = ["xy", "yz", "xz", "x²-y²", "z²"];

    return `${level}d${labels[index % labels.length]}`;
  }

  const labels = [
    "xyz",
    "z(x²-y²)",
    "x(x²-3y²)",
    "y(3x²-y²)",
    "xz²",
    "yz²",
    "z³",
  ];

  return `${level}f${labels[index % labels.length]}`;
}

function getDOrbitalPoint(
  variant: DOrbitalVariant,
  radius: number,
  t: number,
): [number, number, number] {
  if (variant === "dz2") {
    const z = Math.cos(t) * radius * 1.08;
    const waist = Math.sin(t);
    const ringRadius = radius * 0.24 * Math.abs(waist);
    const ringPhase = t * 3;

    return [
      Math.cos(ringPhase) * ringRadius,
      Math.sin(ringPhase) * ringRadius,
      z,
    ];
  }

  const cloverRadius = radius * Math.sin(t * 2);
  const x = Math.cos(t) * cloverRadius;
  const y = Math.sin(t) * cloverRadius;

  if (variant === "dxy") {
    return [x, y, 0];
  }

  if (variant === "dyz") {
    return [0, x, y];
  }

  if (variant === "dxz") {
    return [x, 0, y];
  }

  const diagonal = Math.SQRT1_2;

  return [(x - y) * diagonal, (x + y) * diagonal, 0];
}

function getFOrbitalPoint(
  variant: FOrbitalVariant,
  radius: number,
  t: number,
): [number, number, number] {
  if (variant === "fxx23y2") {
    return getPlanarHarmonicPoint(radius, t, 0);
  }

  if (variant === "fy3x2y2") {
    return getPlanarHarmonicPoint(radius, t, Math.PI / 6);
  }

  if (variant === "fz3") {
    return getZ3HarmonicPoint(radius, t);
  }

  const direction = getFHarmonicDirection(variant, t);
  const magnitude = getNormalizedFHarmonicMagnitude(variant, direction);
  const pathRadius = radius * (0.32 + magnitude * 0.9);

  return [
    direction[0] * pathRadius,
    direction[1] * pathRadius,
    direction[2] * pathRadius,
  ];
}

function getPlanarHarmonicPoint(
  radius: number,
  t: number,
  phase: number,
): [number, number, number] {
  const angle = t + phase;
  const harmonicRadius = radius * (0.28 + 0.72 * Math.abs(Math.cos(3 * angle)));
  const ripple = Math.sin(6 * angle) * radius * 0.035;

  return [
    Math.cos(angle) * harmonicRadius,
    Math.sin(angle) * harmonicRadius,
    ripple,
  ];
}

function getZ3HarmonicPoint(
  radius: number,
  t: number,
): [number, number, number] {
  const vertical = Math.cos(t);
  const harmonic = Math.abs(vertical * (5 * vertical * vertical - 3)) / 2;
  const z = vertical * radius * (0.88 + harmonic * 0.2);
  const waist = Math.sin(t);
  const ringRadius =
    radius * (0.16 + 0.22 * Math.abs(waist)) * (0.72 + 0.28 * harmonic);
  const ringPhase = t * 2;

  return [
    Math.cos(ringPhase) * ringRadius,
    Math.sin(ringPhase) * ringRadius,
    z,
  ];
}

function getFHarmonicDirection(
  variant: FOrbitalVariant,
  t: number,
): [number, number, number] {
  if (variant === "fxz2" || variant === "fyz2") {
    const z = Math.sin(t);
    const planeRadius = Math.sqrt(Math.max(0, 1 - z * z));

    if (variant === "fxz2") {
      return [Math.cos(t) * planeRadius, 0, z];
    }

    return [0, Math.cos(t) * planeRadius, z];
  }

  const z = Math.sin(t * 4) * 0.62;
  const planeRadius = Math.sqrt(Math.max(0, 1 - z * z));
  const x = Math.cos(t) * planeRadius;
  const y = Math.sin(t) * planeRadius;

  return [x, y, z];
}

function getNormalizedFHarmonicMagnitude(
  variant: FOrbitalVariant,
  [x, y, z]: [number, number, number],
) {
  if (variant === "fxyz") {
    return Math.min(1, Math.abs(x * y * z) * 5.2);
  }

  if (variant === "fzx2y2") {
    return Math.min(1, Math.abs(z * (x * x - y * y)) * 3.0);
  }

  if (variant === "fxz2") {
    return Math.min(1, Math.abs(x * (5 * z * z - 1)) * 0.68);
  }

  if (variant === "fyz2") {
    return Math.min(1, Math.abs(y * (5 * z * z - 1)) * 0.68);
  }

  return 1;
}

function getLevelRadius(level: number) {
  return 1.2 + (level - 1) * levelSpacing;
}

function getTrackRotation(
  type: SubshellType,
  index: number,
): [number, number, number] {
  if (type === "s") {
    return [Math.PI / 2, 0, 0];
  }

  if (type === "p") {
    return [0, 0, 0];
  }

  if (type === "d") {
    return [0, 0, 0];
  }

  if (index === 3) {
    return [0, 0, Math.PI / 6];
  }

  return [0, 0, 0];
}
