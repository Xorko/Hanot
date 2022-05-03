import { createContext, useContext, useState } from 'react';
import { ScrollView } from 'react-native';

type ScrollViewRefContext = {
  scrollViewRef: React.RefObject<ScrollView> | undefined;
  setScrollViewRef: (ref: React.RefObject<ScrollView>) => void;
};

type ScrollViewRefContextProviderProps = {
  children: React.ReactNode;
};

const ScrollViewRefContext = createContext<ScrollViewRefContext | undefined>(
  undefined,
);

export const ScrollViewRefProvider = ({
  children,
}: ScrollViewRefContextProviderProps) => {
  const [scrollViewRef, setScrollViewRef] = useState<
    React.RefObject<ScrollView> | undefined
  >(undefined);

  return (
    <ScrollViewRefContext.Provider value={{ scrollViewRef, setScrollViewRef }}>
      {children}
    </ScrollViewRefContext.Provider>
  );
};

export const useScrollViewRef = () => {
  const context = useContext(ScrollViewRefContext);
  if (context === undefined) {
    throw new Error(
      'useScrollViewRef must be used within a ScrollViewRefProvider',
    );
  }
  return context;
};

export default ScrollViewRefProvider;
