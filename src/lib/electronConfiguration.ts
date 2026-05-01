export type SubshellType = "s" | "p" | "d" | "f";

export type ElectronOrbital = {
  id: string;
  electrons: number;
};

export type ElectronSubshell = {
  id: string;
  level: number;
  type: SubshellType;
  electrons: number;
  orbitals: ElectronOrbital[];
};

export type ElectronLevel = {
  level: number;
  electrons: number;
  subshells: ElectronSubshell[];
};

const subshellOrder: Array<{
  level: number;
  type: SubshellType;
  capacity: number;
  orbitals: number;
}> = [
  { level: 1, type: "s", capacity: 2, orbitals: 1 },
  { level: 2, type: "s", capacity: 2, orbitals: 1 },
  { level: 2, type: "p", capacity: 6, orbitals: 3 },
  { level: 3, type: "s", capacity: 2, orbitals: 1 },
  { level: 3, type: "p", capacity: 6, orbitals: 3 },
  { level: 4, type: "s", capacity: 2, orbitals: 1 },
  { level: 3, type: "d", capacity: 10, orbitals: 5 },
  { level: 4, type: "p", capacity: 6, orbitals: 3 },
];

export function buildElectronLevels(electronCount: number): ElectronLevel[] {
  let remainingElectrons = electronCount;
  const levels = new Map<number, ElectronLevel>();

  for (const subshell of subshellOrder) {
    if (remainingElectrons <= 0) {
      break;
    }

    const electrons = Math.min(remainingElectrons, subshell.capacity);
    remainingElectrons -= electrons;

    const level = levels.get(subshell.level) ?? {
      level: subshell.level,
      electrons: 0,
      subshells: [],
    };

    level.electrons += electrons;
    level.subshells.push({
      id: `${subshell.level}${subshell.type}`,
      level: subshell.level,
      type: subshell.type,
      electrons,
      orbitals: distributeElectronsAcrossOrbitals(
        subshell.level,
        subshell.type,
        electrons,
        subshell.orbitals,
      ),
    });

    levels.set(subshell.level, level);
  }

  return Array.from(levels.values()).sort((a, b) => a.level - b.level);
}

export function formatElectronConfiguration(electronCount: number) {
  return buildElectronLevels(electronCount)
    .flatMap((level) => level.subshells)
    .map((subshell) => `${subshell.id}${toSuperscript(subshell.electrons)}`)
    .join(" ");
}

function distributeElectronsAcrossOrbitals(
  level: number,
  type: SubshellType,
  electrons: number,
  orbitalCount: number,
): ElectronOrbital[] {
  const orbitals = Array.from({ length: orbitalCount }, (_, index) => ({
    id: `${level}${type}-${index + 1}`,
    electrons: 0,
  }));

  let remainingElectrons = electrons;

  for (const orbital of orbitals) {
    if (remainingElectrons <= 0) {
      break;
    }

    orbital.electrons = 1;
    remainingElectrons -= 1;
  }

  for (const orbital of orbitals) {
    if (remainingElectrons <= 0) {
      break;
    }

    orbital.electrons = 2;
    remainingElectrons -= 1;
  }

  return orbitals;
}

function toSuperscript(value: number) {
  const superscripts: Record<string, string> = {
    "0": "⁰",
    "1": "¹",
    "2": "²",
    "3": "³",
    "4": "⁴",
    "5": "⁵",
    "6": "⁶",
    "7": "⁷",
    "8": "⁸",
    "9": "⁹",
  };

  return String(value)
    .split("")
    .map((digit) => superscripts[digit])
    .join("");
}
