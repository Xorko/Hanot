import { createContext, useContext, useState } from 'react';

type DisplayMode = 'block' | 'list';

type ModeContextValue = {
  displayMode: DisplayMode;
  setDisplayMode: (newDisplayMode: DisplayMode) => void;
};

type ModeContextProviderProps = {
  initialMode?: DisplayMode;
  children: React.ReactNode;
};

const ModeContext = createContext<ModeContextValue | undefined>(undefined);

export function DisplayModeProvider({
  initialMode,
  children,
}: ModeContextProviderProps) {
  const [displayMode, setDisplayMode] = useState(initialMode || 'block');

  return (
    <ModeContext.Provider value={{ displayMode, setDisplayMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useDisplayMode() {
  const context = useContext(ModeContext);

  if (context === undefined) {
    throw new Error('useDisplayMode must be used within a ModeProvider');
  }

  return context;
}
