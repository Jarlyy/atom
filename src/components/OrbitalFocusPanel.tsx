import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ChemicalElement } from "@/data/elements";
import { buildElectronLevels } from "@/lib/electronConfiguration";
import { cn } from "@/lib/utils";

type OrbitalFocusPanelProps = {
  element: ChemicalElement;
  selectedOrbitalId: string | null;
  visibleElectrons: number;
  onSelectOrbital: (orbitalId: string | null) => void;
  onVisibleElectronsChange: (electronCount: number) => void;
};

export function OrbitalFocusPanel({
  element,
  selectedOrbitalId,
  visibleElectrons,
  onSelectOrbital,
  onVisibleElectronsChange,
}: OrbitalFocusPanelProps) {
  const orbitals = buildElectronLevels(element.electrons).flatMap((level) =>
    level.subshells.map((subshell) => ({
      id: subshell.id,
      electrons: subshell.electrons,
      level: level.level,
      type: subshell.type,
    })),
  );

  return (
    <Card className="gap-2 border-border/80 bg-card/70 py-3 shadow-xl backdrop-blur-xl">
      <CardHeader className="gap-1 px-3">
        <CardDescription className="font-bold tracking-[0.14em] uppercase">
          Orbit focus
        </CardDescription>
        <CardTitle>Read the structure</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 px-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-bold">Selected orbital</span>
            <Button
              className="h-7 rounded-full px-3 text-xs"
              onClick={() => onSelectOrbital(null)}
              type="button"
              variant="ghost"
            >
              Reset
            </Button>
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {orbitals.map((orbital) => {
              const isSelected = selectedOrbitalId === orbital.id;

              return (
                <Button
                  className={cn(
                    "h-7 rounded-xl border bg-white/[0.035] px-1 text-xs font-black",
                    isSelected && "border-primary bg-primary/20 text-primary",
                  )}
                  key={orbital.id}
                  onClick={() =>
                    onSelectOrbital(isSelected ? null : orbital.id)
                  }
                  type="button"
                  variant="outline"
                >
                  {orbital.id}
                </Button>
              );
            })}
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
