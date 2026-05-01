"use client";

import { useState } from "react";
import { AtomScene } from "@/components/AtomScene";
import { ElementSelector } from "@/components/ElementSelector";
import { InfoPanel } from "@/components/InfoPanel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { elements } from "@/data/elements";

const defaultElement = elements[0];

export default function Home() {
  const [selectedElement, setSelectedElement] = useState(defaultElement);

  return (
    <main className="grid min-h-screen gap-4 p-2 md:p-4 lg:grid-cols-[minmax(0,1fr)_23rem]">
      <Card
        className="min-h-auto overflow-hidden rounded-[2rem] border-border/80 bg-card/80 py-0 shadow-2xl backdrop-blur-xl lg:min-h-[calc(100vh-2rem)]"
        aria-label="3D визуализация атома"
      >
        <CardHeader className="flex flex-row items-start justify-between gap-4 px-5 pt-5 md:px-6">
          <div>
            <p className="mb-1 text-xs font-bold tracking-[0.16em] text-primary uppercase">
              Interactive Atom Visualizer
            </p>
            <h1 className="text-4xl leading-none font-black tracking-tight md:text-7xl">
              {selectedElement.name}
            </h1>
          </div>
          <Badge className="rounded-full border-primary/30 bg-primary/10 px-4 py-2 text-sm font-black text-primary">
            #{selectedElement.atomicNumber}
          </Badge>
        </CardHeader>
        <CardContent className="flex flex-1 px-0 pb-0">
          <AtomScene element={selectedElement} />
        </CardContent>
      </Card>

      <aside
        className="flex flex-col gap-4 overflow-auto rounded-3xl border border-border/80 bg-card/70 p-3 shadow-2xl backdrop-blur-xl lg:min-h-[calc(100vh-2rem)]"
        aria-label="Информация и выбор элемента"
      >
        <InfoPanel element={selectedElement} />
        <ElementSelector
          elements={elements}
          selectedElement={selectedElement}
          onSelect={setSelectedElement}
        />
      </aside>
    </main>
  );
}
