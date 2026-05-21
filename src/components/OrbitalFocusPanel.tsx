import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ChemicalElement } from "@/data/elements";
import {
  buildElectronLevels,
  type ElectronOrbital,
  type ElectronSubshell,
  type SubshellType,
} from "@/lib/electronConfiguration";

type OrbitalFocusPanelProps = {
  element: ChemicalElement;
  selectedOrbitalId: string | null;
  visibleElectrons: number;
  onSelectOrbital: (orbitalId: string | null) => void;
  onVisibleElectronsChange: (electronCount: number) => void;
};

const trackLabels: Record<SubshellType, string[]> = {
  s: ["s"],
  p: ["px", "py", "pz"],
  d: ["dxy", "dyz", "dxz", "dx²-y²", "dz²"],
  f: ["fxyz", "fz(x²-y²)", "fx(x²-3y²)", "fy(3x²-y²)", "fxz²", "fyz²", "fz³"],
};

type OrbitalOption = {
  id: string;
  label: string;
  description: string;
};

type OrientationOption = {
  id: string;
  label: string;
  electrons: number;
};

export function OrbitalFocusPanel({
  element,
  selectedOrbitalId,
  visibleElectrons,
  onSelectOrbital,
  onVisibleElectronsChange,
}: OrbitalFocusPanelProps) {
  const levels = buildElectronLevels(element.electrons);
  const subshells = levels.flatMap((level) => level.subshells);
  const selectedSubshellId = getSelectedSubshellId(levels, selectedOrbitalId);
  const selectedSubshell =
    subshells.find((subshell) => subshell.id === selectedSubshellId) ??
    subshells.at(-1);
  const orientationOptions = selectedSubshell
    ? getOrientationOptions(selectedSubshell)
    : [];
  const selectedOption = getSelectedOption(levels, selectedOrbitalId);

  return (
    <Card className="gap-2 border-border/80 bg-card/70 py-3 shadow-xl backdrop-blur-xl">
      <CardHeader className="gap-1 px-3">
        <CardDescription className="font-bold tracking-[0.14em] uppercase">
          Orbit focus
        </CardDescription>
        <CardTitle>Read the structure</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 px-3">
        <div className="rounded-2xl border border-border/80 bg-white/[0.025] p-2.5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="block text-sm font-bold">Orbital focus</span>
              <span className="text-[0.68rem] text-muted-foreground">
                {selectedOption.description}
              </span>
            </div>
            <Button
              className="h-7 rounded-full px-3 text-xs"
              onClick={() => onSelectOrbital(null)}
              type="button"
              variant="ghost"
            >
              Reset
            </Button>
          </div>
          <div className="mt-2 rounded-xl border border-primary/20 bg-primary/10 p-2">
            <div className="min-w-0">
              <span className="block truncate text-lg font-black text-primary">
                {selectedOption.label}
              </span>
              <span className="block truncate text-[0.68rem] text-muted-foreground">
                Current scene highlight
              </span>
            </div>
            <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <label className="space-y-1 rounded-xl border border-border/70 bg-slate-950/25 p-2">
                <span className="text-[0.62rem] font-bold tracking-[0.12em] text-muted-foreground uppercase">
                  Subshell
                </span>
                <select
                  className="h-9 w-full cursor-pointer appearance-none rounded-xl border border-primary/20 bg-slate-950/70 bg-[linear-gradient(45deg,transparent_50%,currentColor_50%),linear-gradient(135deg,currentColor_50%,transparent_50%)] bg-[length:5px_5px,5px_5px] bg-[position:calc(100%-14px)_50%,calc(100%-9px)_50%] bg-no-repeat px-2 pr-7 text-sm font-black text-foreground outline-none transition-colors hover:border-primary/45 hover:bg-slate-950/85 focus:border-primary"
                  onChange={(event) => onSelectOrbital(event.target.value)}
                  value={selectedSubshell?.id ?? ""}
                >
                  {subshells.map((subshell) => (
                    <option key={subshell.id} value={subshell.id}>
                      {subshell.id} · {subshell.electrons}e
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 rounded-xl border border-border/70 bg-slate-950/25 p-2">
                <span className="text-[0.62rem] font-bold tracking-[0.12em] text-muted-foreground uppercase">
                  Orientation
                </span>
                <select
                  className="h-9 w-full cursor-pointer appearance-none rounded-xl border border-primary/20 bg-slate-950/70 bg-[linear-gradient(45deg,transparent_50%,currentColor_50%),linear-gradient(135deg,currentColor_50%,transparent_50%)] bg-[length:5px_5px,5px_5px] bg-[position:calc(100%-14px)_50%,calc(100%-9px)_50%] bg-no-repeat px-2 pr-7 text-sm font-black text-foreground outline-none transition-colors hover:border-primary/45 hover:bg-slate-950/85 focus:border-primary disabled:cursor-not-allowed disabled:opacity-55"
                  disabled={!selectedSubshell}
                  onChange={(event) => onSelectOrbital(event.target.value)}
                  value={getSelectedOrientationValue(
                    selectedSubshell?.id,
                    selectedOrbitalId,
                  )}
                >
                  <option value={selectedSubshell?.id ?? ""}>All</option>
                  {orientationOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label} · {option.electrons}e
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-white/[0.035] p-2">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <span className="block text-xs text-muted-foreground">
                Filling step
              </span>
              <strong className="text-base">
                {visibleElectrons} / {element.electrons} e
              </strong>
            </div>
            <Button
              className="h-8 rounded-full px-3 text-xs"
              onClick={() => onVisibleElectronsChange(element.electrons)}
              type="button"
              variant="secondary"
            >
              Full
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <Button
              className="h-8 rounded-xl"
              disabled={visibleElectrons <= 1}
              onClick={() => onVisibleElectronsChange(visibleElectrons - 1)}
              type="button"
              variant="outline"
            >
              Previous
            </Button>
            <Button
              className="h-8 rounded-xl"
              disabled={visibleElectrons >= element.electrons}
              onClick={() => onVisibleElectronsChange(visibleElectrons + 1)}
              type="button"
            >
              Next
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1.5 text-center text-[0.66rem] font-black">
          <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-2 py-1 text-cyan-200">
            s
          </span>
          <span className="rounded-full border border-violet-300/30 bg-violet-300/10 px-2 py-1 text-violet-200">
            p
          </span>
          <span className="rounded-full border border-fuchsia-300/30 bg-fuchsia-300/10 px-2 py-1 text-fuchsia-200">
            d
          </span>
          <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-2 py-1 text-amber-200">
            f
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function getTrackLabel(
  type: SubshellType,
  track: ElectronOrbital,
  index: number,
) {
  const labels = trackLabels[type];

  return labels[index % labels.length] ?? track.id;
}

function getOrientationOptions(
  subshell: ElectronSubshell,
): OrientationOption[] {
  return subshell.orbitals
    .filter((track) => track.electrons > 0)
    .map((track, index) => ({
      id: track.id,
      label: getTrackLabel(subshell.type, track, index),
      electrons: track.electrons,
    }));
}

function getSelectedSubshellId(
  levels: ReturnType<typeof buildElectronLevels>,
  selectedOrbitalId: string | null,
) {
  if (!selectedOrbitalId) {
    return levels.at(-1)?.subshells.at(-1)?.id ?? null;
  }

  for (const level of levels) {
    for (const subshell of level.subshells) {
      if (subshell.id === selectedOrbitalId) {
        return subshell.id;
      }

      if (subshell.orbitals.some((track) => track.id === selectedOrbitalId)) {
        return subshell.id;
      }
    }
  }

  return levels.at(-1)?.subshells.at(-1)?.id ?? null;
}

function getSelectedOrientationValue(
  selectedSubshellId: string | undefined,
  selectedOrbitalId: string | null,
) {
  if (!selectedOrbitalId || selectedOrbitalId === selectedSubshellId) {
    return selectedSubshellId ?? "";
  }

  return selectedOrbitalId;
}

function getSelectedOption(
  levels: ReturnType<typeof buildElectronLevels>,
  selectedOrbitalId: string | null,
): OrbitalOption {
  if (!selectedOrbitalId) {
    return {
      id: "overview",
      label: "Overview",
      description: "All orbitals are shown without focus",
    };
  }

  for (const level of levels) {
    for (const subshell of level.subshells) {
      if (subshell.id === selectedOrbitalId) {
        return {
          id: subshell.id,
          label: `${subshell.id} · all`,
          description: `Full ${subshell.id} subshell is selected`,
        };
      }

      const trackIndex = subshell.orbitals.findIndex(
        (track) => track.id === selectedOrbitalId,
      );

      if (trackIndex >= 0) {
        return {
          id: selectedOrbitalId,
          label: getTrackLabel(
            subshell.type,
            subshell.orbitals[trackIndex],
            trackIndex,
          ),
          description: `Single orientation inside ${subshell.id}`,
        };
      }
    }
  }

  return {
    id: "unknown",
    label: "Custom focus",
    description: "Selected orbital focus",
  };
}
