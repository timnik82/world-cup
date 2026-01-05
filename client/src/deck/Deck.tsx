import { useEffect, useRef, useState, type ReactNode } from "react";
import Reveal from "reveal.js";
import "reveal.js/dist/reveal.css";
import { useSlidesStore } from "@/store/slides";

interface DeckProps {
  children: ReactNode;
}

export function Deck({ children }: DeckProps) {
  const deckRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<Reveal.Api | null>(null);
  const [initialized, setInitialized] = useState(false);
  const setCurrentSlide = useSlidesStore((s) => s.setCurrentSlide);

  useEffect(() => {
    if (!deckRef.current || revealRef.current) return;

    const deck = new Reveal(deckRef.current, {
      embedded: false,
      hash: false,
      controls: true,
      controlsTutorial: true,
      controlsLayout: "bottom-right",
      controlsBackArrows: "faded",
      progress: true,
      center: true,
      touch: true,
      loop: false,
      rtl: false,
      shuffle: false,
      fragments: true,
      fragmentInURL: false,
      help: true,
      mouseWheel: false,
      previewLinks: false,
      transition: "slide",
      transitionSpeed: "default",
      backgroundTransition: "fade",
      viewDistance: 3,
      width: "100%",
      height: "100%",
      margin: 0,
      minScale: 0.2,
      maxScale: 2.0,
    });

    deck.initialize().then(() => {
      revealRef.current = deck;
      setInitialized(true);
      setCurrentSlide(deck.getState().indexh);

      deck.on("slidechanged", (event: { indexh: number }) => {
        setCurrentSlide(event.indexh);
      });
    });

    return () => {
      if (revealRef.current) {
        revealRef.current.destroy();
        revealRef.current = null;
      }
    };
  }, [setCurrentSlide]);

  return (
    <div className="reveal h-screen w-screen" ref={deckRef}>
      <div className="slides">
        {initialized ? children : (
          <section className="flex items-center justify-center">
            <div className="animate-pulse text-kid-2xl font-bold text-foreground">
              Loading...
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

interface SlideProps {
  children: ReactNode;
  className?: string;
  background?: string;
  index: number;
}

export function Slide({ children, className = "", background, index }: SlideProps) {
  const isActive = useSlidesStore((s) => s.isSlideActive(index));

  return (
    <section
      className={`h-full w-full ${className}`}
      data-background={background}
      data-background-size="cover"
    >
      <div className={`h-full w-full transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-50"}`}>
        {children}
      </div>
    </section>
  );
}
