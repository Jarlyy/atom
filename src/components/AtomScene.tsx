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
};

type NucleusProps = {
  element: ChemicalElement;
};

type OrbitalTrack = {
  id: string;
  color: string;
  electronCount: number;
  kind: SubshellType;
  level: number;
  orbitalIndex: number;
  radius: number;
  rotation: [number, number, number];
  speed: number;
};

const shellNames = ["K", "L", "M", "N"];

const orbitalColors: Record<SubshellType, string> = {
  s: "#67e8f9",
  p: "#a78bfa",
  d: "#f0abfc",
  f: "#fde68a",
};

const orbitalOrder: SubshellType[] = ["s", "p", "d", "f"];
const levelSpacing = 1.42;
const orbitalSpacing = 0.11;
const trackSpacing = 0.04;

export function AtomScene({ element }: AtomSceneProps) {
  return (
    <div className="min-h-[26rem] flex-1 lg:min-h-[32rem]">
      <Canvas camera={{ position: [0, 5.2, 10], fov: 45 }}>
        <color attach="background" args={["#070b16"]} />
        <ambientLight intensity={1.4} />
        <pointLight position={[4, 5, 6]} intensity={24} color="#7dd3fc" />
        <pointLight position={[-5, -3, -4]} intensity={12} color="#fb7185" />
        <AtomModel element={element} />
        <OrbitControls enablePan={false} minDistance={5} maxDistance={14} />
      </Canvas>
    </div>
  );
}

function AtomModel({ element }: AtomSceneProps) {
  const groupRef = useRef<Group>(null);
  const levels = buildElectronLevels(element.electrons);

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
        <span className="rounded-full border border-sky-300/20 bg-slate-950/75 px-2 py-1 text-[10px] font-bold text-sky-100">
          {shellNames[level - 1] ?? `n${level}`} / n={level}
        </span>
      </Html>
    </group>
  );
}

type OrbitalGroupProps = {
  levelRadius: number;
  orbital: ElectronSubshell;
};

function OrbitalGroup({ levelRadius, orbital }: OrbitalGroupProps) {
  const tracks = buildOrbitalTracks(orbital, levelRadius);
  const color = orbitalColors[orbital.type];

  return (
    <group>
      {tracks.map((track) => (
        <ElectronTrack key={track.id} track={track} />
      ))}
      <OrbitalLabel color={color} levelRadius={levelRadius} orbital={orbital} />
    </group>
  );
}

function OrbitalLabel({
  color,
  levelRadius,
  orbital,
}: {
  color: string;
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
        style={{ borderColor: color, color }}
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
  track: OrbitalTrack;
};

function ElectronTrack({ track }: ElectronTrackProps) {
  const curve = useTrackCurve(track);

  return (
    <group rotation={track.rotation}>
      <mesh>
        <tubeGeometry args={[curve, 240, 0.012, 8, true]} />
        <meshBasicMaterial color={track.color} transparent opacity={0.58} />
      </mesh>
      {Array.from({ length: track.electronCount }, (_, electronIndex) => (
        <ElectronOnTrack
          electronIndex={electronIndex}
          key={electronIndex}
          track={track}
        />
      ))}
    </group>
  );
}

function useTrackCurve(track: OrbitalTrack) {
  return useMemo(() => {
    const points: Vector3[] = [];
    const segments = 240;

    for (let index = 0; index < segments; index += 1) {
      const t = (index / segments) * Math.PI * 2;
      const [x, y, z] = getTrackPoint(track, t);

      points.push(new Vector3(x, y, z));
    }

    return new CatmullRomCurve3(points, true);
  }, [track]);
}

type ElectronOnTrackProps = {
  electronIndex: number;
  track: OrbitalTrack;
};

function ElectronOnTrack({ electronIndex, track }: ElectronOnTrackProps) {
  const meshRef = useRef<Group>(null);
  const phase = track.electronCount === 1 ? 0 : electronIndex * Math.PI;

  useFrame((state) => {
    if (!meshRef.current) {
      return;
    }

    const [x, y, z] = getTrackPoint(
      track,
      state.clock.elapsedTime * track.speed + phase,
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
          emissiveIntensity={0.9}
          roughness={0.18}
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
  const scale = radius * 0.46;

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
    const x = Math.sin(t * 2) * scale * 0.95;
    const y = Math.sin(t) * Math.cos(t) * scale * 1.1;

    return [x, y, 0];
  }

  const x = Math.sin(t * 3) * scale * 0.9;
  const y = Math.sin(t * 2) * scale * 0.78;
  const z = Math.cos(t) * scale * 0.22;

  return [x, y, z];
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
    const rotations: Array<[number, number, number]> = [
      [0, 0, 0],
      [0.16, Math.PI / 5, 0],
      [-0.16, (Math.PI * 2) / 5, 0],
      [0.24, (Math.PI * 3) / 5, 0],
      [-0.24, (Math.PI * 4) / 5, 0],
    ];

    return rotations[index % rotations.length];
  }

  return [index % 2 === 0 ? 0.2 : -0.2, index * 0.42, 0];
}
