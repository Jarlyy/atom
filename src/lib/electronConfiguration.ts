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

type SubshellDefinition = {
  level: number;
  type: SubshellType;
  capacity: number;
  orbitals: number;
};

const subshellOrder: SubshellDefinition[] = [
  { level: 1, type: "s", capacity: 2, orbitals: 1 },
  { level: 2, type: "s", capacity: 2, orbitals: 1 },
  { level: 2, type: "p", capacity: 6, orbitals: 3 },
  { level: 3, type: "s", capacity: 2, orbitals: 1 },
  { level: 3, type: "p", capacity: 6, orbitals: 3 },
  { level: 4, type: "s", capacity: 2, orbitals: 1 },
  { level: 3, type: "d", capacity: 10, orbitals: 5 },
  { level: 4, type: "p", capacity: 6, orbitals: 3 },
  { level: 5, type: "s", capacity: 2, orbitals: 1 },
  { level: 4, type: "d", capacity: 10, orbitals: 5 },
  { level: 5, type: "p", capacity: 6, orbitals: 3 },
  { level: 6, type: "s", capacity: 2, orbitals: 1 },
  { level: 4, type: "f", capacity: 14, orbitals: 7 },
  { level: 5, type: "d", capacity: 10, orbitals: 5 },
  { level: 6, type: "p", capacity: 6, orbitals: 3 },
  { level: 7, type: "s", capacity: 2, orbitals: 1 },
  { level: 5, type: "f", capacity: 14, orbitals: 7 },
  { level: 6, type: "d", capacity: 10, orbitals: 5 },
  { level: 7, type: "p", capacity: 6, orbitals: 3 },
];

const exceptionConfigurations: Record<number, Record<string, number>> = {
  24: { "4s": 1, "3d": 5 },
  29: { "4s": 1, "3d": 10 },
  41: { "5s": 1, "4d": 4 },
  42: { "5s": 1, "4d": 5 },
  44: { "5s": 1, "4d": 7 },
  45: { "5s": 1, "4d": 8 },
  46: { "5s": 0, "4d": 10 },
  47: { "5s": 1, "4d": 10 },
  57: { "6s": 2, "4f": 0, "5d": 1 },
  58: { "6s": 2, "4f": 1, "5d": 1 },
  64: { "6s": 2, "4f": 7, "5d": 1 },
  78: { "6s": 1, "4f": 14, "5d": 9 },
  79: { "6s": 1, "4f": 14, "5d": 10 },
  89: { "7s": 2, "5f": 0, "6d": 1 },
  90: { "7s": 2, "5f": 0, "6d": 2 },
  91: { "7s": 2, "5f": 2, "6d": 1 },
  92: { "7s": 2, "5f": 3, "6d": 1 },
  93: { "7s": 2, "5f": 4, "6d": 1 },
  96: { "7s": 2, "5f": 7, "6d": 1 },
  103: { "7s": 2, "5f": 14, "6d": 0, "7p": 1 },
};

export function buildElectronLevels(electronCount: number): ElectronLevel[] {
  const subshellOccupancy = buildSubshellOccupancy(electronCount);
  const levels = new Map<number, ElectronLevel>();

  for (const subshell of subshellOrder) {
    const electrons = subshellOccupancy.get(getSubshellId(subshell)) ?? 0;

    if (electrons <= 0) {
      continue;
    }

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

export function buildShellDistribution(electronCount: number): number[] {
  return buildElectronLevels(electronCount).map((level) => level.electrons);
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

function buildSubshellOccupancy(electronCount: number) {
  let remainingElectrons = electronCount;
  const occupancy = new Map<string, number>();

  for (const subshell of subshellOrder) {
    if (remainingElectrons <= 0) {
      break;
    }

    const electrons = Math.min(remainingElectrons, subshell.capacity);
    remainingElectrons -= electrons;
    occupancy.set(getSubshellId(subshell), electrons);
  }

  const exceptionConfiguration = exceptionConfigurations[electronCount];

  if (!exceptionConfiguration) {
    return occupancy;
  }

  for (const [id, electrons] of Object.entries(exceptionConfiguration)) {
    occupancy.set(id, electrons);
  }

  return occupancy;
}

function getSubshellId(subshell: Pick<SubshellDefinition, "level" | "type">) {
  return `${subshell.level}${subshell.type}`;
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
