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
  selectedElement: ChemicalElement;
  onSelect: (element: ChemicalElement) => void;
};

export function ElementSelector({
  elements,
  selectedElement,
  onSelect,
}: ElementSelectorProps) {
  return (
    <Card className="border-border/80 bg-card/70 shadow-xl backdrop-blur-xl">
      <CardHeader>
        <CardDescription className="font-bold tracking-[0.14em] uppercase">
          Periodic table
        </CardDescription>
        <CardTitle>Choose an element</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-4 gap-2 min-[460px]:grid-cols-5">
        {elements.map((element) => {
          const isSelected = element.key === selectedElement.key;

          return (
            <Button
              className={cn(
                "h-14 flex-col gap-0 rounded-2xl border bg-white/[0.035] text-foreground hover:-translate-y-0.5 hover:bg-primary/10",
                isSelected &&
                  "border-primary bg-primary/20 text-primary shadow-lg shadow-primary/10",
              )}
              variant="outline"
              type="button"
              key={element.key}
              onClick={() => onSelect(element)}
              aria-pressed={isSelected}
              title={element.name}
            >
              <strong className="text-base leading-none">
                {element.symbol}
              </strong>
              <span className="text-[0.68rem] text-muted-foreground">
                {element.atomicNumber}
              </span>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
