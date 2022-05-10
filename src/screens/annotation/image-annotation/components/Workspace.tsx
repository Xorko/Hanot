import { useEffect, useRef, useState } from 'react';
import { Image, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { useAppSelector } from '../../../../stores/hooks';
import colors from '../../../../style/colors';
import { Size } from '../../../../types/coordinates-types';
import { getAdaptedImageSize } from '../../../../utils/image-size-utils';
import { useDisplayedImageSizeContext } from '../context/DisplayedImageSizeContext';
import { LassoModifiedContextProvider } from '../context/LassoModifiedContext';
import Lasso from './Lasso';

type WorkspacePropsType = {
  pullUpDisplayedImageSize: (displayedSize: Size) => void;
};

function Workspace({ pullUpDisplayedImageSize }: WorkspacePropsType) {
  //===========================================================================
  // Redux
  //===========================================================================

  // The image object that is currently being annotated
  const currentAnnotatedImage = useAppSelector(
    state => state.currentAnnotatedImage,
  );

  const trueImageSize = useAppSelector(
    state => state.currentAnnotatedImage.imageSize,
  );

  //===========================================================================
  // Contexts
  //===========================================================================

  const { displayedImageSize, setDisplayedImageSize } =
    useDisplayedImageSizeContext();

  //===========================================================================
  // State
  //===========================================================================

  const [containerSize, setContainerSize] = useState<Size>();

  //===========================================================================
  // Variables
  //===========================================================================

  // Indicates if this is the first render of the component
  const firstRender = useRef<boolean>(true);

  //===========================================================================
  // Render
  //===========================================================================

  useEffect(() => {
    if (trueImageSize && containerSize) {
      const displayedSize = getAdaptedImageSize(containerSize, trueImageSize);

      // Update the displayed image size context
      setDisplayedImageSize(displayedSize);

      // The displayed image size is needed in the parent component so it must be pulled up
      // This is only done on the first render because the parent component will re-render and the displayed image size will be updated again causing an infinite loop
      if (firstRender.current) {
        pullUpDisplayedImageSize(displayedSize);
        firstRender.current = false;
      }
    }
  }, [
    containerSize,
    pullUpDisplayedImageSize,
    setDisplayedImageSize,
    trueImageSize,
  ]);

  return (
    <View
      style={styles.container}
      onLayout={(event: LayoutChangeEvent) =>
        setContainerSize(event.nativeEvent.layout)
      }>
      {displayedImageSize && currentAnnotatedImage.imageSource.length > 0 && (
        <>
          <Image
            source={{ uri: currentAnnotatedImage.imageSource }}
            style={[
              {
                width: displayedImageSize.width,
                height: displayedImageSize.height,
              },
              styles.image,
            ]}
          />
          <View>
            <LassoModifiedContextProvider>
              <Lasso />
            </LassoModifiedContextProvider>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: colors.dark,
  },
});

export default Workspace;
