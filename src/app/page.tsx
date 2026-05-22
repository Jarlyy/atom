"use client";

import { useEffect, useState } from "react";
import { AtomScene } from "@/components/AtomScene";
import { ElementSelector } from "@/components/ElementSelector";
import { InfoPanel } from "@/components/InfoPanel";
import { OrbitalFocusPanel } from "@/components/OrbitalFocusPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { elements } from "@/data/elements";
import { getElementName, type Language, t } from "@/lib/i18n";

const defaultElement = elements[0];

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedElement, setSelectedElement] = useState(defaultElement);
  const [selectedOrbitalId, setSelectedOrbitalId] = useState<string | null>(
    null,
  );
  const [visibleElectrons, setVisibleElectrons] = useState(
    defaultElement.electrons,
  );
  const [language, setLanguage] = useState<Language>("en");
  const [isElementSelectorOpen, setIsElementSelectorOpen] = useState(true);
  const [isAtomFullscreen, setIsAtomFullscreen] = useState(false);
  const selectedElementName = getElementName(selectedElement, language);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  function handleSelectElement(element: typeof selectedElement) {
    setSelectedElement(element);
    setSelectedOrbitalId(null);
    setVisibleElectrons(element.electrons);
  }

  return (
    <main
      className="grid min-h-dvh gap-3 overflow-x-hidden p-2 md:p-3 lg:h-screen lg:grid-cols-[minmax(0,1fr)_23rem] lg:overflow-hidden"
      suppressHydrationWarning
    >
      <Card
        className="min-h-[58dvh] overflow-hidden rounded-[1.25rem] border-border/80 bg-card/80 py-0 shadow-2xl backdrop-blur-xl md:min-h-[64dvh] md:rounded-[1.6rem] lg:min-h-0"
        aria-label="3D визуализация атома"
      >
        <CardHeader className="flex flex-row items-start justify-between gap-3 px-3 pt-3 md:px-5 md:pt-4">
          <div className="min-w-0">
            <p className="mb-1 text-[0.62rem] font-bold tracking-[0.14em] text-primary uppercase md:text-xs md:tracking-[0.16em]">
              {t(language, "appTitle")}
            </p>
            <h1 className="truncate text-3xl leading-none font-black tracking-tight md:text-5xl xl:text-6xl">
              {selectedElementName}
            </h1>
          </div>
          <Badge className="shrink-0 rounded-full border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-black text-primary md:px-4 md:py-2 md:text-sm">
            #{selectedElement.atomicNumber}
          </Badge>
        </CardHeader>
        <CardContent className="relative flex min-h-0 flex-1 px-0 pb-0">
          <Button
            aria-label="Open fullscreen atom view"
            className="absolute top-3 right-3 z-10 size-10 rounded-full border-primary/25 bg-slate-950/55 p-0 text-primary shadow-xl backdrop-blur-md hover:bg-slate-950/75"
            onClick={() => setIsAtomFullscreen(true)}
            type="button"
            variant="outline"
          >
            <MaximizeIcon />
          </Button>
          <AtomScene
            element={selectedElement}
            selectedOrbitalId={selectedOrbitalId}
            visibleElectrons={visibleElectrons}
          />
        </CardContent>
      </Card>

      <aside
        className="grid min-h-0 gap-2 rounded-3xl border border-border/80 bg-card/70 p-2 shadow-2xl backdrop-blur-xl lg:grid-rows-[auto_minmax(0,1fr)_auto] lg:overflow-hidden"
        aria-label="Информация и выбор элемента"
      >
        <Card className="gap-2 border-border/80 bg-card/70 py-3 shadow-xl backdrop-blur-xl">
          <CardContent className="space-y-3 px-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <span className="block text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase">
                  {t(language, "periodicTable")}
                </span>
                <strong className="text-lg">{selectedElement.symbol}</strong>
                <span className="ml-2 text-sm text-muted-foreground">
                  {selectedElementName}
                </span>
              </div>
              <Button
                className="w-full rounded-full sm:w-auto"
                onClick={() => setIsElementSelectorOpen(true)}
                type="button"
              >
                {t(language, "chooseElement")}
              </Button>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-2xl border border-border/70 bg-white/[0.03] p-1.5">
              <span className="block text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase">
                {t(language, "language")}
              </span>
              <div className="grid grid-cols-2 gap-1">
                <Button
                  aria-pressed={language === "en"}
                  className="h-8 rounded-xl px-3 text-xs aria-pressed:bg-primary aria-pressed:text-primary-foreground"
                  onClick={() => setLanguage("en")}
                  type="button"
                  variant={language === "en" ? "default" : "ghost"}
                >
                  EN
                </Button>
                <Button
                  aria-pressed={language === "ru"}
                  className="h-8 rounded-xl px-3 text-xs aria-pressed:bg-primary aria-pressed:text-primary-foreground"
                  onClick={() => setLanguage("ru")}
                  type="button"
                  variant={language === "ru" ? "default" : "ghost"}
                >
                  RU
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="min-h-0 lg:overflow-auto lg:pr-1">
          <InfoPanel element={selectedElement} language={language} />
        </div>
        <OrbitalFocusPanel
          element={selectedElement}
          language={language}
          onSelectOrbital={setSelectedOrbitalId}
          onVisibleElectronsChange={setVisibleElectrons}
          selectedOrbitalId={selectedOrbitalId}
          visibleElectrons={visibleElectrons}
        />
      </aside>
      {isMounted ? (
        <ElementSelector
          elements={elements}
          isOpen={isElementSelectorOpen}
          language={language}
          onClose={() => setIsElementSelectorOpen(false)}
          selectedElement={selectedElement}
          onSelect={handleSelectElement}
        />
      ) : null}
      {isAtomFullscreen ? (
        <div className="fixed inset-0 z-50 bg-slate-950">
          <Button
            aria-label="Exit fullscreen atom view"
            className="absolute top-4 right-4 z-10 size-11 rounded-full border-primary/25 bg-slate-950/55 p-0 text-primary shadow-xl backdrop-blur-md hover:bg-slate-950/75"
            onClick={() => setIsAtomFullscreen(false)}
            type="button"
            variant="outline"
          >
            <MinimizeIcon />
          </Button>
          <AtomScene
            element={selectedElement}
            selectedOrbitalId={selectedOrbitalId}
            visibleElectrons={visibleElectrons}
          />
        </div>
      ) : null}
    </main>
  );
}

function MaximizeIcon() {
  return (
    <span
      aria-hidden="true"
      className="relative block size-4 before:absolute before:top-0 before:right-0 before:size-2 before:border-t-2 before:border-r-2 before:border-current after:absolute after:bottom-0 after:left-0 after:size-2 after:border-b-2 after:border-l-2 after:border-current"
    >
      <span className="absolute top-0 right-0 h-2 w-px origin-top translate-x-[-0.35rem] rotate-45 bg-current" />
      <span className="absolute bottom-0 left-0 h-2 w-px origin-bottom translate-x-[0.35rem] rotate-45 bg-current" />
    </span>
  );
}

function MinimizeIcon() {
  return (
    <span
      aria-hidden="true"
      className="relative block size-4 before:absolute before:top-1 before:left-1 before:size-1.5 before:border-t-2 before:border-l-2 before:border-current after:absolute after:right-1 after:bottom-1 after:size-1.5 after:border-r-2 after:border-b-2 after:border-current"
    >
      <span className="absolute top-1 left-1 h-2 w-px origin-top translate-x-[0.45rem] rotate-45 bg-current" />
      <span className="absolute right-1 bottom-1 h-2 w-px origin-bottom translate-x-[-0.45rem] rotate-45 bg-current" />
    </span>
  );
}
