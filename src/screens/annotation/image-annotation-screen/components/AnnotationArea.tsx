import { Image, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { useAppSelector } from '../../../../stores/hooks';
import { useDisplayedImageSizeContext } from '../context/DisplayedImageSizeContext';
import { useTrueImageSizeContext } from '../context/TrueImageSizeContext';
import Lasso from './Lasso';

const AnnotationArea = () => {
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
    }
  };

  //================================================================================
  // Render
  //================================================================================

  return (
    <View style={styles.container} onLayout={handleContainerLayout}>
      {displayedImageSize && (
        <>
          <Image
            source={{ uri: currentAnnotatedImage.imageSource }}
            style={{
              ...styles.image,
              width: displayedImageSize.width,
              height: displayedImageSize.height,
            }}
          />
          <Lasso />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
  },
});

export default AnnotationArea;
