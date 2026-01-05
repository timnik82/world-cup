import type { MatchDetails } from "@/data/schemas";

export interface ApiProvider {
  name: string;
  fetchMatchDetails(matchId: string): Promise<MatchDetails | null>;
}

export type ApiProviderType = "mock" | "football-data" | "thesportsdb";
