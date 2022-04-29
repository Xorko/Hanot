import React, { createContext, useState } from 'react';

type CurrentStatePanelContextValue = {
  currentStatePanel?: boolean;
  setCurrentStatePanel: (open: boolean) => void;
};

type CurrentStatePanelContextProviderProps = {
  initialCurrentStatePanel?: boolean;
  children: React.ReactNode;
};

const CurrentStatePanelContext = createContext<
  CurrentStatePanelContextValue | undefined
>(undefined);

export const CurrentStatePanelProvider = ({
  initialCurrentStatePanel,
  children,
}: CurrentStatePanelContextProviderProps) => {
  const [currentStatePanel, setCurrentStatePanel] = useState<boolean>(
    initialCurrentStatePanel || false,
  );

  return (
    <CurrentStatePanelContext.Provider
      value={{ currentStatePanel, setCurrentStatePanel }}>
      {children}
    </CurrentStatePanelContext.Provider>
  );
};

export const useCurrentStatePanelContext = () => {
  const context = React.useContext(CurrentStatePanelContext);
  if (context === undefined) {
    throw new Error(
      'useCurrentStatePanelContext must be used within a CurrentStatePanelProvider',
    );
  }
  return context;
};
