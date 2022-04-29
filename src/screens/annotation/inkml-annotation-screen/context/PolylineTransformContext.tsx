import React, { createContext, useState } from 'react';
import { Transform } from '../types/annotation-types';

type PolylineTransformContextValue = {
  transform: Transform;
  setTransform: (transform: Transform) => void;
};

type PolylineTransformContextProviderProps = {
  initialTransform?: Transform;
  children: React.ReactNode;
};

const PolylineTransformContext = createContext<
  PolylineTransformContextValue | undefined
>(undefined);

export const PolylineTransformProvider = ({
  initialTransform,
  children,
}: PolylineTransformContextProviderProps) => {
  const [transform, setTransform] = useState<Transform>(
    initialTransform
      ? initialTransform
      : { translateX: 0, translateY: 0, scale: 1 },
  );

  return (
    <PolylineTransformContext.Provider value={{ transform, setTransform }}>
      {children}
    </PolylineTransformContext.Provider>
  );
};

export const usePolylineTransformContext = () => {
  const context = React.useContext(PolylineTransformContext);
  if (context === undefined) {
    throw new Error(
      'usePolylineTransformContext must be used within a PolylineTransformProvider',
    );
  }
  return context;
};
