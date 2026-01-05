import { useEffect, useRef, type ReactNode } from "react";
import Reveal from "reveal.js";
import "reveal.js/dist/reveal.css";
import "./reveal-overrides.css";
import { useSlidesStore } from "@/store/slides";

interface DeckProps {
  children: ReactNode;
}

let globalReveal: Reveal.Api | null = null;

export function Deck({ children }: DeckProps) {
  const deckRef = useRef<HTMLDivElement>(null);
  const setCurrentSlide = useSlidesStore((s) => s.setCurrentSlide);

  useEffect(() => {
    if (!deckRef.current || globalReveal) return;

    const initReveal = async () => {
      if (!deckRef.current) return;
      
      try {
        const deck = new Reveal(deckRef.current, {
          embedded: false,
          hash: false,
          controls: true,
          controlsTutorial: true,
          controlsLayout: "bottom-right",
          controlsBackArrows: "faded",
          progress: true,
          center: false,
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
          minScale: 1,
          maxScale: 1,
          disableLayout: true,
        });

        await deck.initialize();
        globalReveal = deck;
        
        const state = deck.getState();
        if (state) {
          setCurrentSlide(state.indexh);
        }

        deck.on("slidechanged", (event: { indexh: number }) => {
          setCurrentSlide(event.indexh);
        });
      } catch (error) {
        console.error("Failed to initialize Reveal.js:", error);
      }
    };

    const timer = setTimeout(initReveal, 50);

    return () => {
      clearTimeout(timer);
      if (globalReveal) {
        try {
          globalReveal.destroy();
        } catch (e) {
          console.warn("Error destroying Reveal:", e);
        }
        globalReveal = null;
      }
    };
  }, [setCurrentSlide]);

  return (
    <div className="reveal h-screen w-screen overflow-hidden" ref={deckRef} data-testid="presentation-deck">
      <div className="slides">{children}</div>
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
  return (
    <section
      className={`h-screen w-screen overflow-auto ${className}`}
      data-background={background}
      data-background-size="cover"
      data-testid={`slide-${index}`}
    >
      <div className="h-full w-full">
        {children}
      </div>
    </section>
  );
}
