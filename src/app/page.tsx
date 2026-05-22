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
      className="grid h-screen overflow-hidden p-2 md:p-3 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-3"
      suppressHydrationWarning
    >
      <Card
        className="min-h-0 overflow-hidden rounded-[1.6rem] border-border/80 bg-card/80 py-0 shadow-2xl backdrop-blur-xl"
        aria-label="3D визуализация атома"
      >
        <CardHeader className="flex flex-row items-start justify-between gap-3 px-4 pt-4 md:px-5">
          <div className="min-w-0">
            <p className="mb-1 text-xs font-bold tracking-[0.16em] text-primary uppercase">
              {t(language, "appTitle")}
            </p>
            <h1 className="text-3xl leading-none font-black tracking-tight md:text-5xl xl:text-6xl">
              {selectedElementName}
            </h1>
          </div>
          <Badge className="shrink-0 rounded-full border-primary/30 bg-primary/10 px-4 py-2 text-sm font-black text-primary">
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
        className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-2 overflow-hidden rounded-3xl border border-border/80 bg-card/70 p-2 shadow-2xl backdrop-blur-xl"
        aria-label="Информация и выбор элемента"
      >
        <Card className="gap-2 border-border/80 bg-card/70 py-3 shadow-xl backdrop-blur-xl">
          <CardContent className="space-y-3 px-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="block text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase">
                  {t(language, "periodicTable")}
                </span>
                <strong className="text-lg">{selectedElement.symbol}</strong>
                <span className="ml-2 text-sm text-muted-foreground">
                  {selectedElementName}
                </span>
              </div>
              <Button
                className="rounded-full"
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
        <div className="min-h-0 overflow-auto pr-1">
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
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M15 3h6v6" />
      <path d="m21 3-7 7" />
      <path d="m3 21 7-7" />
      <path d="M9 21H3v-6" />
    </svg>
  );
}

function MinimizeIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m14 10 7-7" />
      <path d="M20 10h-6V4" />
      <path d="m3 21 7-7" />
      <path d="M4 14h6v6" />
    </svg>
  );
}
