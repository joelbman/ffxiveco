import { createContext } from 'react';

interface WorldCtx {
  world: string;
  updateWorld: (world: string) => void;
}

export const WorldContext = createContext<WorldCtx>({
  world: '',
  updateWorld: () => null,
});
