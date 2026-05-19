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
import { cn } from "@/lib/utils";

type ElementSelectorProps = {
  elements: ChemicalElement[];
  isOpen: boolean;
  onClose: () => void;
  selectedElement: ChemicalElement;
  onSelect: (element: ChemicalElement) => void;
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
}: ElementSelectorProps) {
  if (!isOpen) {
    return null;
  }

  const elementsByAtomicNumber = new Map(
    elements.map((element) => [element.atomicNumber, element]),
  );

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/78 p-3 backdrop-blur-md">
      <button
        aria-label="Close element selector"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
      />
      <Card className="relative max-h-[92vh] w-full max-w-7xl gap-4 overflow-hidden rounded-[2rem] border-border/80 bg-card/95 shadow-2xl">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardDescription className="font-bold tracking-[0.14em] uppercase">
              Periodic table
            </CardDescription>
            <CardTitle className="text-3xl">Choose an element</CardTitle>
          </div>
          <Button
            className="rounded-full"
            onClick={onClose}
            type="button"
            variant="outline"
          >
            Close
          </Button>
        </CardHeader>
        <CardContent className="overflow-auto p-4 pt-0">
          <div className="min-w-[1120px] space-y-3">
            <div className="grid grid-cols-[2rem_repeat(18,minmax(0,1fr))] gap-1.5">
              <div />
              {groupLabels.map((group) => (
                <div
                  className="text-center text-[0.62rem] font-bold text-muted-foreground"
                  key={group}
                >
                  {group}
                </div>
              ))}
              {periodLabels.map((period) => (
                <div
                  className="flex h-18 items-center justify-center text-[0.62rem] font-bold text-muted-foreground"
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

            <div className="grid grid-cols-[2rem_repeat(18,minmax(0,1fr))] gap-1.5 pt-2">
              <SeriesLabel label="La" />
              {renderSeries(
                elementsByAtomicNumber,
                selectedElement,
                onSelect,
                onClose,
                57,
                71,
              )}
              <SeriesLabel label="Ac" />
              {renderSeries(
                elementsByAtomicNumber,
                selectedElement,
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
  onClose,
  onSelect,
  style,
}: {
  element: ChemicalElement;
  isSelected: boolean;
  onClose: () => void;
  onSelect: (element: ChemicalElement) => void;
  style?: CSSProperties;
}) {
  return (
    <Button
      aria-pressed={isSelected}
      className={cn(
        "h-18 min-w-0 flex-col gap-0.5 rounded-lg border bg-white/[0.035] px-1 text-foreground hover:-translate-y-0.5 hover:bg-primary/10",
        isSelected &&
          "border-primary bg-primary/20 text-primary shadow-lg shadow-primary/10",
      )}
      onClick={() => {
        onSelect(element);
        onClose();
      }}
      title={element.name}
      type="button"
      variant="outline"
      style={style}
    >
      <span className="self-start text-[0.58rem] leading-none text-muted-foreground">
        {element.atomicNumber}
      </span>
      <strong className="text-xl leading-none">{element.symbol}</strong>
      <span className="max-w-full truncate text-[0.65rem] text-muted-foreground">
        {element.name}
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
      className="flex h-18 items-center justify-center rounded-lg border border-dashed border-primary/30 bg-primary/5 text-[0.7rem] font-bold text-primary/80"
      style={{ gridColumnStart: 4, gridRowStart: row }}
      title={title}
    >
      {label}
    </div>
  );
}

function SeriesLabel({ label }: { label: string }) {
  return (
    <div className="col-start-1 flex h-18 items-center justify-center text-[0.62rem] font-bold text-muted-foreground">
      {label}
    </div>
  );
}

function renderSeries(
  elementsByAtomicNumber: Map<number, ChemicalElement>,
  selectedElement: ChemicalElement,
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
        onClose={onClose}
        onSelect={onSelect}
        style={{ gridColumnStart: index + 4 }}
      />
    );
  });
}
