import { useEffect, useState } from 'react';
import { Image, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { useAppSelector } from '../../../../stores/hooks';
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
    state => state.currentAnnotatedImage.annotatedImage,
  );

  const trueImageSize = useAppSelector(
    state => state.currentAnnotatedImage.annotatedImage.imageSize,
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
  // Render
  //===========================================================================

  useEffect(() => {
    if (trueImageSize && containerSize) {
      setDisplayedImageSize(getAdaptedImageSize(containerSize, trueImageSize));
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
          <View style={[styles.image, styles.shadow]}>
            <Image
              source={{ uri: currentAnnotatedImage.imageSource }}
              style={{
                width: displayedImageSize.width,
                height: displayedImageSize.height,
              }}
            />
          </View>
          <LassoModifiedContextProvider>
            <Lasso />
          </LassoModifiedContextProvider>
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
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
});

export default Workspace;
