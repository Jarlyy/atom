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
  formatElectronConfiguration,
} from "@/lib/electronConfiguration";

type InfoPanelProps = {
  element: ChemicalElement;
};

export function InfoPanel({ element }: InfoPanelProps) {
  const configuration = formatElectronConfiguration(element.electrons);
  const levels = buildElectronLevels(element.electrons);
  const stats = [
    ["Name", element.name],
    ["Atomic number", element.atomicNumber],
    ["Protons", element.protons],
    ["Neutrons", element.neutrons],
    ["Electrons", element.electrons],
    ["Levels", element.shells.join(", ")],
  ];

  return (
    <Card className="border-border/80 bg-card/70 shadow-xl backdrop-blur-xl">
      <CardHeader>
        <CardDescription className="font-bold tracking-[0.14em] uppercase">
          Selected element
        </CardDescription>
        <CardTitle className="flex items-end gap-3">
          <span
            className="grid size-20 place-items-center rounded-2xl border border-primary/40 bg-linear-to-br from-primary/25 to-indigo-500/15 text-4xl font-black"
            title={`Symbol ${element.symbol}`}
          >
            {element.symbol}
          </span>
          <span className="pb-1 text-2xl">{element.name}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="rounded-2xl border border-primary/25 bg-primary/10 p-3">
          <span className="block text-xs text-muted-foreground">
            spdf electron configuration
          </span>
          <strong className="mt-1 block text-lg tracking-wide">
            {configuration}
          </strong>
        </div>
        <div className="rounded-2xl border border-border/80 bg-white/[0.035] p-3">
          <span className="block text-xs text-muted-foreground">
            Levels and spdf orbitals
          </span>
          <div className="mt-2 space-y-2">
            {levels.map((level) => (
              <div
                className="flex flex-wrap items-center gap-2"
                key={level.level}
              >
                <strong className="min-w-12 text-sm">n={level.level}</strong>
                {level.subshells.map((subshell) => (
                  <span
                    className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-xs font-bold text-primary"
                    key={subshell.id}
                  >
                    {subshell.id}: {subshell.orbitals.length} track
                    {subshell.orbitals.length > 1 ? "s" : ""},{" "}
                    {subshell.electrons}e
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 max-[420px]:grid-cols-1">
          {stats.map(([label, value]) => (
            <div
              className="rounded-2xl border border-border/80 bg-white/[0.035] p-3"
              key={label}
            >
              <span className="block text-xs text-muted-foreground">
                {label}
              </span>
              <strong className="mt-1 block text-lg">{value}</strong>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
