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
import { formatTranslation, type Language, t } from "@/lib/i18n";

type OrbitalFocusPanelProps = {
  element: ChemicalElement;
  selectedOrbitalId: string | null;
  visibleElectrons: number;
  onSelectOrbital: (orbitalId: string | null) => void;
  onVisibleElectronsChange: (electronCount: number) => void;
  language: Language;
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
  language,
}: OrbitalFocusPanelProps) {
  const isPreviousDisabled = visibleElectrons <= 1;
  const isNextDisabled = visibleElectrons >= element.electrons;
  const levels = buildElectronLevels(element.electrons);
  const subshells = levels.flatMap((level) => level.subshells);
  const selectedSubshellId = getSelectedSubshellId(levels, selectedOrbitalId);
  const selectedSubshell =
    subshells.find((subshell) => subshell.id === selectedSubshellId) ??
    subshells.at(-1);
  const orientationOptions = selectedSubshell
    ? getOrientationOptions(selectedSubshell)
    : [];
  const selectedOption = getSelectedOption(levels, selectedOrbitalId, language);
  const selectClassName =
    "h-8 w-full cursor-pointer appearance-none rounded-xl border border-primary/20 bg-slate-950/70 bg-[linear-gradient(45deg,transparent_50%,currentColor_50%),linear-gradient(135deg,currentColor_50%,transparent_50%)] bg-[length:5px_5px,5px_5px] bg-[position:calc(100%-14px)_50%,calc(100%-9px)_50%] bg-no-repeat px-2 pr-7 text-sm font-black text-foreground outline-none transition-colors hover:border-primary/45 hover:bg-slate-950/85 focus:border-primary disabled:cursor-not-allowed disabled:opacity-55";

  return (
    <Card className="gap-2 border-border/80 bg-card/70 py-3 shadow-xl backdrop-blur-xl">
      <CardHeader className="flex flex-row items-center justify-between gap-3 px-3">
        <div className="min-w-0">
          <CardDescription className="font-bold tracking-[0.14em] uppercase">
            {t(language, "orbitalFocus")}
          </CardDescription>
          <CardTitle className="truncate text-base">
            {selectedOption.label}
          </CardTitle>
        </div>
        <Button
          className="h-7 shrink-0 rounded-full px-3 text-xs"
          onClick={() => onSelectOrbital(null)}
          type="button"
          variant="ghost"
        >
          {t(language, "reset")}
        </Button>
      </CardHeader>
      <CardContent className="space-y-2 px-3">
        <div className="rounded-2xl border border-primary/20 bg-primary/10 p-2">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <label className="space-y-1">
              <span className="text-[0.62rem] font-bold tracking-[0.12em] text-muted-foreground uppercase">
                {t(language, "subshell")}
              </span>
              <select
                className={selectClassName}
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
            <label className="space-y-1">
              <span className="text-[0.62rem] font-bold tracking-[0.12em] text-muted-foreground uppercase">
                {t(language, "orientation")}
              </span>
              <select
                className={selectClassName}
                disabled={!selectedSubshell}
                onChange={(event) => onSelectOrbital(event.target.value)}
                value={getSelectedOrientationValue(
                  selectedSubshell?.id,
                  selectedOrbitalId,
                )}
              >
                <option value={selectedSubshell?.id ?? ""}>
                  {t(language, "subshellAll")}
                </option>
                {orientationOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label} · {option.electrons}e
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-white/[0.035] p-2">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <span className="block text-xs text-muted-foreground">
                {t(language, "fillingStep")}
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
              {t(language, "full")}
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <Button
              aria-disabled={isPreviousDisabled}
              className="h-8 rounded-xl aria-disabled:pointer-events-none aria-disabled:opacity-50"
              onClick={() => {
                if (!isPreviousDisabled) {
                  onVisibleElectronsChange(visibleElectrons - 1);
                }
              }}
              type="button"
              variant="outline"
            >
              {t(language, "previous")}
            </Button>
            <Button
              aria-disabled={isNextDisabled}
              className="h-8 rounded-xl aria-disabled:pointer-events-none aria-disabled:opacity-50"
              onClick={() => {
                if (!isNextDisabled) {
                  onVisibleElectronsChange(visibleElectrons + 1);
                }
              }}
              type="button"
            >
              {t(language, "next")}
            </Button>
          </div>
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
  language: Language,
): OrbitalOption {
  if (!selectedOrbitalId) {
    return {
      id: "overview",
      label: t(language, "overview"),
      description: t(language, "overviewDescription"),
    };
  }

  for (const level of levels) {
    for (const subshell of level.subshells) {
      if (subshell.id === selectedOrbitalId) {
        return {
          id: subshell.id,
          label: `${subshell.id} · ${t(language, "subshellAll")}`,
          description: formatTranslation(
            language,
            "subshellSelectedDescription",
            { subshell: subshell.id },
          ),
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
          description: formatTranslation(
            language,
            "singleOrientationDescription",
            { subshell: subshell.id },
          ),
        };
      }
    }
  }

  return {
    id: "unknown",
    label: t(language, "unknownFocus"),
    description: t(language, "unknownFocusDescription"),
  };
}
