import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Fact, Match } from "@/data";

interface FavoritesState {
  favoriteFacts: Fact[];
  favoriteMatches: Match[];
  addFact: (fact: Fact) => void;
  removeFact: (factId: string) => void;
  addMatch: (match: Match) => void;
  removeMatch: (matchId: string) => void;
  isFactFavorite: (factId: string) => boolean;
  isMatchFavorite: (matchId: string) => boolean;
  clearAll: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteFacts: [],
      favoriteMatches: [],

      addFact: (fact) =>
        set((state) => {
          if (state.favoriteFacts.some((f) => f.id === fact.id)) {
            return state;
          }
          return { favoriteFacts: [...state.favoriteFacts, fact] };
        }),

      removeFact: (factId) =>
        set((state) => ({
          favoriteFacts: state.favoriteFacts.filter((f) => f.id !== factId),
        })),

      addMatch: (match) =>
        set((state) => {
          if (state.favoriteMatches.some((m) => m.id === match.id)) {
            return state;
          }
          return { favoriteMatches: [...state.favoriteMatches, match] };
        }),

      removeMatch: (matchId) =>
        set((state) => ({
          favoriteMatches: state.favoriteMatches.filter((m) => m.id !== matchId),
        })),

      isFactFavorite: (factId) => get().favoriteFacts.some((f) => f.id === factId),

      isMatchFavorite: (matchId) => get().favoriteMatches.some((m) => m.id === matchId),

      clearAll: () => set({ favoriteFacts: [], favoriteMatches: [] }),
    }),
    {
      name: "world-cup-favorites",
    }
  )
);
