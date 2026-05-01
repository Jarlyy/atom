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

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/78 p-3 backdrop-blur-md">
      <button
        aria-label="Close element selector"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
      />
      <Card className="relative max-h-[92vh] w-full max-w-5xl gap-4 overflow-hidden rounded-[2rem] border-border/80 bg-card/95 shadow-2xl">
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
        <CardContent className="grid grid-cols-4 gap-2 overflow-auto p-4 pt-0 sm:grid-cols-6 md:grid-cols-9">
          {elements.map((element) => {
            const isSelected = element.key === selectedElement.key;

            return (
              <Button
                aria-pressed={isSelected}
                className={cn(
                  "h-20 flex-col gap-1 rounded-2xl border bg-white/[0.035] text-foreground hover:-translate-y-0.5 hover:bg-primary/10",
                  isSelected &&
                    "border-primary bg-primary/20 text-primary shadow-lg shadow-primary/10",
                )}
                key={element.key}
                onClick={() => {
                  onSelect(element);
                  onClose();
                }}
                title={element.name}
                type="button"
                variant="outline"
              >
                <strong className="text-2xl leading-none">
                  {element.symbol}
                </strong>
                <span className="text-[0.7rem] text-muted-foreground">
                  {element.atomicNumber}
                </span>
                <span className="max-w-full truncate text-[0.65rem] text-muted-foreground">
                  {element.name}
                </span>
              </Button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
