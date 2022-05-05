import { createContext, useContext, useState } from 'react';

type WebDrawerContextValue = {
  isOpened: boolean;
  setIsOpened: (isOpened: boolean) => void;
};

type WebDrawerContextProviderProps = {
  initialIsOpened?: boolean;
  children: React.ReactNode;
};

const WebDrawerContext = createContext<WebDrawerContextValue | undefined>(
  undefined,
);

export const WebDrawerProvider = ({
  initialIsOpened,
  children,
}: WebDrawerContextProviderProps) => {
  const [isOpened, setIsOpened] = useState<boolean>(initialIsOpened || false);

  return (
    <WebDrawerContext.Provider value={{ isOpened, setIsOpened }}>
      {children}
    </WebDrawerContext.Provider>
  );
};

export const useWebDrawer = () => {
  const context = useContext(WebDrawerContext);

  if (context === undefined) {
    throw new Error('useWebDrawer must be used within a WebDrawerProvider');
  }

  const toggleWebDrawer = () => {
    context.setIsOpened(!context.isOpened);
  };

  const openWebDrawer = () => {
    context.setIsOpened(true);
  };

  const closeWebDrawer = () => {
    context.setIsOpened(false);
  };

  return { ...context, toggleWebDrawer, openWebDrawer, closeWebDrawer };
};
