"use client";

import { useState } from "react";
import { AtomScene } from "@/components/AtomScene";
import { ElementSelector } from "@/components/ElementSelector";
import { InfoPanel } from "@/components/InfoPanel";
import { OrbitalFocusPanel } from "@/components/OrbitalFocusPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { elements } from "@/data/elements";

const defaultElement = elements[0];

export default function Home() {
  const [selectedElement, setSelectedElement] = useState(defaultElement);
  const [selectedOrbitalId, setSelectedOrbitalId] = useState<string | null>(
    null,
  );
  const [visibleElectrons, setVisibleElectrons] = useState(
    defaultElement.electrons,
  );
  const [isElementSelectorOpen, setIsElementSelectorOpen] = useState(false);

  function handleSelectElement(element: typeof selectedElement) {
    setSelectedElement(element);
    setSelectedOrbitalId(null);
    setVisibleElectrons(element.electrons);
  }

  return (
    <main className="grid h-screen overflow-hidden p-2 md:p-3 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-3">
      <Card
        className="min-h-0 overflow-hidden rounded-[1.6rem] border-border/80 bg-card/80 py-0 shadow-2xl backdrop-blur-xl"
        aria-label="3D визуализация атома"
      >
        <CardHeader className="flex flex-row items-start justify-between gap-3 px-4 pt-4 md:px-5">
          <div>
            <p className="mb-1 text-xs font-bold tracking-[0.16em] text-primary uppercase">
              Interactive Atom Visualizer
            </p>
            <h1 className="text-3xl leading-none font-black tracking-tight md:text-5xl xl:text-6xl">
              {selectedElement.name}
            </h1>
          </div>
          <Badge className="rounded-full border-primary/30 bg-primary/10 px-4 py-2 text-sm font-black text-primary">
            #{selectedElement.atomicNumber}
          </Badge>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 px-0 pb-0">
          <AtomScene
            element={selectedElement}
            selectedOrbitalId={selectedOrbitalId}
            visibleElectrons={visibleElectrons}
          />
        </CardContent>
      </Card>

      <aside
        className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-2 overflow-hidden rounded-3xl border border-border/80 bg-card/70 p-2 shadow-2xl backdrop-blur-xl"
        aria-label="Информация и выбор элемента"
      >
        <Card className="gap-2 border-border/80 bg-card/70 py-3 shadow-xl backdrop-blur-xl">
          <CardContent className="flex items-center justify-between gap-3 px-3">
            <div>
              <span className="block text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase">
                Periodic table
              </span>
              <strong className="text-lg">{selectedElement.symbol}</strong>
              <span className="ml-2 text-sm text-muted-foreground">
                {selectedElement.name}
              </span>
            </div>
            <Button
              className="rounded-full"
              onClick={() => setIsElementSelectorOpen(true)}
              type="button"
            >
              Choose element
            </Button>
          </CardContent>
        </Card>
        <div className="min-h-0 overflow-hidden">
          <InfoPanel element={selectedElement} />
        </div>
        <OrbitalFocusPanel
          element={selectedElement}
          onSelectOrbital={setSelectedOrbitalId}
          onVisibleElectronsChange={setVisibleElectrons}
          selectedOrbitalId={selectedOrbitalId}
          visibleElectrons={visibleElectrons}
        />
      </aside>
      <ElementSelector
        elements={elements}
        isOpen={isElementSelectorOpen}
        onClose={() => setIsElementSelectorOpen(false)}
        selectedElement={selectedElement}
        onSelect={handleSelectElement}
      />
    </main>
  );
}
