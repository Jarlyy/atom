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
    <Card className="gap-2 border-border/80 bg-card/70 py-2 shadow-xl backdrop-blur-xl">
      <CardHeader className="gap-1 px-3 py-0">
        <CardDescription className="font-bold tracking-[0.14em] uppercase">
          Selected element
        </CardDescription>
        <CardTitle className="flex items-center gap-2">
          <span
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-primary/40 bg-linear-to-br from-primary/25 to-indigo-500/15 text-xl font-black"
            title={`Symbol ${element.symbol}`}
          >
            {element.symbol}
          </span>
          <span className="truncate text-lg">{element.name}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-1.5 px-3 pb-3">
        <div className="rounded-xl border border-primary/25 bg-primary/10 p-2">
          <span className="block text-xs text-muted-foreground">
            spdf electron configuration
          </span>
          <strong className="mt-1 block text-sm tracking-wide">
            {configuration}
          </strong>
        </div>
        <div className="rounded-xl border border-border/80 bg-white/[0.035] p-2">
          <span className="block text-xs text-muted-foreground">
            Levels and spdf orbitals
          </span>
          <div className="mt-1 space-y-1">
            {levels.map((level) => (
              <div
                className="flex flex-wrap items-center gap-2"
                key={level.level}
              >
                <strong className="min-w-12 text-sm">n={level.level}</strong>
                {level.subshells.map((subshell) => (
                  <span
                    className="rounded-full border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[0.66rem] font-bold text-primary"
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
        <div className="grid grid-cols-3 gap-1.5 max-[420px]:grid-cols-2">
          {stats.map(([label, value]) => (
            <div
              className="rounded-xl border border-border/80 bg-white/[0.035] p-2"
              key={label}
            >
              <span className="block text-xs text-muted-foreground">
                {label}
              </span>
              <strong className="mt-1 block text-sm">{value}</strong>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
