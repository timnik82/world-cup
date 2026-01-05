import type { ApiProvider, ApiProviderType } from "./types";
import { mockProvider } from "./mockProvider";
import type { MatchDetails } from "@/data/schemas";

const providers: Record<ApiProviderType, ApiProvider> = {
  mock: mockProvider,
  "football-data": mockProvider,
  "thesportsdb": mockProvider,
};

function getProviderType(): ApiProviderType {
  const envProvider = import.meta.env.VITE_API_PROVIDER as ApiProviderType | undefined;
  if (envProvider && providers[envProvider]) {
    return envProvider;
  }
  return "mock";
}

let currentProvider: ApiProvider | null = null;

export function getApiProvider(): ApiProvider {
  if (!currentProvider) {
    const providerType = getProviderType();
    currentProvider = providers[providerType];
    console.log(`Using API provider: ${currentProvider.name}`);
  }
  return currentProvider;
}

export async function fetchMatchDetails(matchId: string): Promise<MatchDetails | null> {
  const provider = getApiProvider();
  return provider.fetchMatchDetails(matchId);
}

export type { ApiProvider, ApiProviderType };
