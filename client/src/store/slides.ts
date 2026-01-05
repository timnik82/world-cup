import { create } from "zustand";

interface SlidesState {
  currentSlide: number;
  setCurrentSlide: (index: number) => void;
  isSlideActive: (index: number) => boolean;
}

export const useSlidesStore = create<SlidesState>((set, get) => ({
  currentSlide: 0,
  setCurrentSlide: (index) => set({ currentSlide: index }),
  isSlideActive: (index) => get().currentSlide === index,
}));
