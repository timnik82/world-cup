import type { ApiProvider } from "./types";
import type { MatchDetails } from "@/data/schemas";
import matchDetailsData from "@/data/matchDetails.json";
import { MatchDetailsSchema } from "@/data/schemas";

export const mockProvider: ApiProvider = {
  name: "mock",

  async fetchMatchDetails(matchId: string): Promise<MatchDetails | null> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const data = (matchDetailsData as Record<string, unknown>)[matchId];
    if (!data) {
      return null;
    }

    try {
      return MatchDetailsSchema.parse(data);
    } catch {
      console.error(`Invalid match details data for ${matchId}`);
      return null;
    }
  },
};
