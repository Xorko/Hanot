import { Image, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { useAppSelector } from '../../../../stores/hooks';
import { Size } from '../../../../types/coordinates-types';
import { useDisplayedImageSizeContext } from '../context/DisplayedImageSizeContext';
import { LassoModifiedContextProvider } from '../context/LassoModifiedContext';
import { useTrueImageSizeContext } from '../context/TrueImageSizeContext';
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

  //===========================================================================
  // Contexts
  //===========================================================================

  const { displayedImageSize, setDisplayedImageSize } =
    useDisplayedImageSizeContext();

  const { trueImageSize } = useTrueImageSizeContext();

  //===========================================================================
  // Functions
  //===========================================================================

  /**
   * When the component is mounted, adjust the size of the image to the size of the container
   * @param event The event that triggered the function
   */
  const handleContainerLayout = (event: LayoutChangeEvent) => {
    if (trueImageSize) {
      // Retrieves the size of the container
      const { width, height } = event.nativeEvent.layout;

      // The size scale between the container and the image
      const scale = Math.min(
        width / trueImageSize.width,
        height / trueImageSize.height,
      );

      /*
        If the image is smaller than the container, the displayed size is the true size
        Else the displayed size is the size scaled to the container
      */
      const newSize = {
        width: trueImageSize.width * (scale < 1 ? scale : 1),
        height: trueImageSize.height * (scale < 1 ? scale : 1),
      };
      setDisplayedImageSize(newSize);
      pullUpDisplayedImageSize(newSize);
    }
  };
  return (
    <View style={styles.container} onLayout={handleContainerLayout}>
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
