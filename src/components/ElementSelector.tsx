import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ChemicalElement } from "@/data/elements";
import { getElementName, type Language, t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type ElementSelectorProps = {
  elements: ChemicalElement[];
  isOpen: boolean;
  onClose: () => void;
  selectedElement: ChemicalElement;
  onSelect: (element: ChemicalElement) => void;
  language: Language;
};

type PeriodicPosition = {
  column: number;
  row: number;
};

const periodicTablePositions: Record<number, PeriodicPosition> = {
  1: { row: 1, column: 1 },
  2: { row: 1, column: 18 },
  3: { row: 2, column: 1 },
  4: { row: 2, column: 2 },
  5: { row: 2, column: 13 },
  6: { row: 2, column: 14 },
  7: { row: 2, column: 15 },
  8: { row: 2, column: 16 },
  9: { row: 2, column: 17 },
  10: { row: 2, column: 18 },
  11: { row: 3, column: 1 },
  12: { row: 3, column: 2 },
  13: { row: 3, column: 13 },
  14: { row: 3, column: 14 },
  15: { row: 3, column: 15 },
  16: { row: 3, column: 16 },
  17: { row: 3, column: 17 },
  18: { row: 3, column: 18 },
};

const groupLabels = Array.from({ length: 18 }, (_, index) => index + 1);
const periodLabels = [1, 2, 3, 4, 5, 6, 7];

for (let atomicNumber = 19; atomicNumber <= 36; atomicNumber += 1) {
  periodicTablePositions[atomicNumber] = {
    row: 4,
    column: atomicNumber - 18,
  };
}

for (let atomicNumber = 37; atomicNumber <= 54; atomicNumber += 1) {
  periodicTablePositions[atomicNumber] = {
    row: 5,
    column: atomicNumber - 36,
  };
}

for (let atomicNumber = 55; atomicNumber <= 56; atomicNumber += 1) {
  periodicTablePositions[atomicNumber] = {
    row: 6,
    column: atomicNumber - 54,
  };
}

for (let atomicNumber = 72; atomicNumber <= 86; atomicNumber += 1) {
  periodicTablePositions[atomicNumber] = {
    row: 6,
    column: atomicNumber - 68,
  };
}

for (let atomicNumber = 87; atomicNumber <= 88; atomicNumber += 1) {
  periodicTablePositions[atomicNumber] = {
    row: 7,
    column: atomicNumber - 86,
  };
}

for (let atomicNumber = 104; atomicNumber <= 118; atomicNumber += 1) {
  periodicTablePositions[atomicNumber] = {
    row: 7,
    column: atomicNumber - 100,
  };
}

export function ElementSelector({
  elements,
  isOpen,
  onClose,
  selectedElement,
  onSelect,
  language,
}: ElementSelectorProps) {
  if (!isOpen) {
    return null;
  }

  const elementsByAtomicNumber = new Map(
    elements.map((element) => [element.atomicNumber, element]),
  );

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_36%),rgba(2,6,23,0.86)] p-3 backdrop-blur-md">
      <button
        aria-label={t(language, "close")}
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
      />
      <Card className="relative grid max-h-[94vh] w-full max-w-[min(96vw,92rem)] grid-rows-[auto_minmax(0,1fr)] gap-3 overflow-hidden rounded-[1.75rem] border-white/10 bg-slate-950/82 py-4 shadow-2xl shadow-cyan-950/30 ring-1 ring-white/10 backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/55 to-transparent" />
        <CardHeader className="flex flex-row items-start justify-between gap-3 px-5 py-0">
          <div className="min-w-0">
            <CardDescription className="font-bold tracking-[0.18em] text-cyan-200/75 uppercase">
              {t(language, "periodicTable")}
            </CardDescription>
            <CardTitle className="text-2xl leading-tight md:text-3xl">
              {t(language, "chooseElement")}
            </CardTitle>
          </div>
          <Button
            className="rounded-full border-white/15 bg-white/5 px-4 text-slate-100 hover:bg-white/10"
            onClick={onClose}
            type="button"
            variant="outline"
          >
            {t(language, "close")}
          </Button>
        </CardHeader>
        <CardContent className="min-h-0 overflow-hidden px-5 pb-1 pt-0">
          <div className="mx-auto w-full max-w-[88rem] space-y-4">
            <div className="grid grid-cols-[1.45rem_repeat(18,minmax(0,1fr))] gap-1.5">
              <div />
              {groupLabels.map((group) => (
                <div
                  className="text-center text-[0.6rem] font-bold text-slate-500"
                  key={group}
                >
                  {group}
                </div>
              ))}
              {periodLabels.map((period) => (
                <div
                  className="flex h-[clamp(2.9rem,6.05vh,4.35rem)] items-center justify-center text-[0.6rem] font-bold text-slate-500"
                  key={period}
                  style={{ gridColumnStart: 1, gridRowStart: period + 1 }}
                >
                  {period}
                </div>
              ))}
              {elements.map((element) => {
                const position = periodicTablePositions[element.atomicNumber];

                if (!position) {
                  return null;
                }

                return (
                  <ElementButton
                    element={element}
                    isSelected={element.key === selectedElement.key}
                    key={element.key}
                    language={language}
                    onClose={onClose}
                    onSelect={onSelect}
                    style={{
                      gridColumnStart: position.column + 1,
                      gridRowStart: position.row + 1,
                    }}
                  />
                );
              })}
              <SeriesPlaceholder label="57-71" row={7} title="Lanthanides" />
              <SeriesPlaceholder label="89-103" row={8} title="Actinides" />
            </div>

            <div className="grid grid-cols-[1.45rem_repeat(18,minmax(0,1fr))] gap-1.5 pt-0.5">
              <SeriesLabel label="La" />
              {renderSeries(
                elementsByAtomicNumber,
                selectedElement,
                language,
                onSelect,
                onClose,
                57,
                71,
              )}
              <SeriesLabel label="Ac" />
              {renderSeries(
                elementsByAtomicNumber,
                selectedElement,
                language,
                onSelect,
                onClose,
                89,
                103,
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ElementButton({
  element,
  isSelected,
  language,
  onClose,
  onSelect,
  style,
}: {
  element: ChemicalElement;
  isSelected: boolean;
  language: Language;
  onClose: () => void;
  onSelect: (element: ChemicalElement) => void;
  style?: CSSProperties;
}) {
  const elementName = getElementName(element, language);

  return (
    <Button
      aria-pressed={isSelected}
      className={cn(
        "relative h-[clamp(3.15rem,6.35vh,4.6rem)] min-w-0 flex-col gap-0.5 rounded-xl border border-slate-500/35 bg-slate-900/88 px-1 pb-1.5 pt-3 text-slate-100 shadow-md shadow-black/35 ring-1 ring-white/[0.035] transition hover:-translate-y-0.5 hover:border-cyan-300/60 hover:bg-slate-800/95 hover:shadow-cyan-950/40",
        isSelected &&
          "border-cyan-300/80 bg-cyan-950/85 text-cyan-50 shadow-lg shadow-cyan-500/15 ring-1 ring-cyan-200/35",
      )}
      onClick={() => {
        onSelect(element);
        onClose();
      }}
      title={elementName}
      type="button"
      variant="outline"
      style={style}
    >
      <span className="absolute left-1.5 top-1 text-[0.55rem] leading-none text-slate-400">
        {element.atomicNumber}
      </span>
      <strong className="text-[clamp(0.95rem,1.42vw,1.24rem)] leading-none">
        {element.symbol}
      </strong>
      <span className="max-w-full whitespace-nowrap text-center text-[clamp(0.42rem,0.58vw,0.58rem)] font-semibold leading-none tracking-[-0.04em] text-slate-200/90">
        {elementName}
      </span>
    </Button>
  );
}

function SeriesPlaceholder({
  label,
  row,
  title,
}: {
  label: string;
  row: number;
  title: string;
}) {
  return (
    <div
      className="flex h-[clamp(2.9rem,6.05vh,4.35rem)] items-center justify-center rounded-xl border border-dashed border-cyan-300/35 bg-cyan-300/8 text-[0.62rem] font-bold text-cyan-200/85"
      style={{ gridColumnStart: 4, gridRowStart: row }}
      title={title}
    >
      {label}
    </div>
  );
}

function SeriesLabel({ label }: { label: string }) {
  return (
    <div className="col-start-1 flex h-[clamp(2.9rem,6.05vh,4.35rem)] items-center justify-center text-[0.6rem] font-bold text-slate-500">
      {label}
    </div>
  );
}

function renderSeries(
  elementsByAtomicNumber: Map<number, ChemicalElement>,
  selectedElement: ChemicalElement,
  language: Language,
  onSelect: (element: ChemicalElement) => void,
  onClose: () => void,
  start: number,
  end: number,
) {
  return Array.from({ length: end - start + 1 }, (_, index) => {
    const element = elementsByAtomicNumber.get(start + index);

    if (!element) {
      return null;
    }

    return (
      <ElementButton
        element={element}
        isSelected={element.key === selectedElement.key}
        key={element.key}
        language={language}
        onClose={onClose}
        onSelect={onSelect}
        style={{ gridColumnStart: index + 4 }}
      />
    );
  });
}
