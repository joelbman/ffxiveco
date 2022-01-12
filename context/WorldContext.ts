import React from 'react';

interface WorldCtx {
  world: string;
  updateWorld: (world: string) => void;
}

export const WorldContext = React.createContext<WorldCtx>({
  world: '',
  updateWorld: () => null,
});
