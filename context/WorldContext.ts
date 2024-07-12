import { createContext } from 'react';

interface WorldCtx {
  world: string;
  continent: 'EU' | 'NA';
  updateWorld: (world: string) => void;
  updateContinent: (continent: 'EU' | 'NA') => void;
}

export const WorldContext = createContext<WorldCtx>({
  world: '',
  continent: 'EU',
  updateWorld: () => null,
  updateContinent: () => null,
});
