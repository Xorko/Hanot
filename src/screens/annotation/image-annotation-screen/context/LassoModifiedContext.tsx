import React from 'react';

type LassoModifiedContextValue = {
  lassoModified?: boolean;
  setLassoModified: (svgModified: boolean) => void;
};

type LassoModifiedContextProviderProps = {
  initialLassoModified?: boolean;
  children: React.ReactNode;
};

const LassoModifiedContext = React.createContext<
  LassoModifiedContextValue | undefined
>(undefined);

export const LassoModifiedContextProvider = ({
  initialLassoModified,
  children,
}: LassoModifiedContextProviderProps) => {
  const [lassoModified, setLassoModified] = React.useState<boolean>(
    initialLassoModified ? initialLassoModified : false,
  );

  return (
    <LassoModifiedContext.Provider value={{ lassoModified, setLassoModified }}>
      {children}
    </LassoModifiedContext.Provider>
  );
};

export const useLassoModifiedContext = () => {
  const context = React.useContext(LassoModifiedContext);
  if (context === undefined) {
    throw new Error(
      'useLassoModifiedContext must be used within a LassoModifiedContextProvider',
    );
  }
  return context;
};
