import { useEffect, useState } from 'react';
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Canvas, { Image as CanvasImage } from 'react-native-canvas';
import Svg from 'react-native-svg';
import { useAppDispatch, useAppSelector } from '../../../../stores/hooks';
import { useCurrentSelectedCropContext } from '../context/CurrentSelectedCropContext';
import { useDisplayedImageSizeContext } from '../context/DisplayedImageSizeContext';
import { useTrueImageSizeContext } from '../context/TrueImageSizeContext';
import {
  currentAnnotatedImageAddCrop,
  setCurrentAnnotatedImageCropAtIndex,
  setCurrentAnnotatedImagePixels,
} from '../current-annotated-image';
import { Pixel, Point, Size } from '../types/image-annotation-types';
import {
  getPolygonPoints,
  getPolylinePoints,
  roundPointCoordinates,
} from '../utils/crop-utils';
import SvgPoint from './SvgPoint';
import SvgPolygon from './SvgPolygon';
import SvgPolyline from './SvgPolyline';

const AnnotationArea = () => {
  //===========================================================================
  // Redux
  //===========================================================================

  const dispatch = useAppDispatch();

  // The image object that is currently being annotated
  const currentAnnotatedImage = useAppSelector(
    state => state.currentAnnotatedImage.annotatedImage,
  );

  //===========================================================================
  // Contexts
  //===========================================================================

  const { displayedImageSize, setDisplayedImageSize } =
    useDisplayedImageSizeContext();

  const { currentSelectedCrop, setCurrentSelectedCrop } =
    useCurrentSelectedCropContext();

  const { trueImageSize } = useTrueImageSizeContext();

  //===========================================================================
  // State
  //===========================================================================

  // Indicates if the crop current path is closed (i.e. the user has finished)
  const [closedPath, setClosedPath] = useState<boolean>(false);

  // Indicates if the a crop is currently being drawn or modified
  const [inCropCreation, setInCropCreation] = useState<boolean>(false);

  // The current path of the crop
  const [path, setPath] = useState<Point[]>([]);

  // Contains the size to be used to display the image
  const [size, setSize] = useState<Size>();

  /*
    Indicates if the image is display with its original size or not
    Only way found to get all the pixels of the image is the image is displayed smaller than its true size
  */
  const [trueSizeDisplayed, setTrueSizeDisplayed] = useState<boolean>(false);

  //===========================================================================
  // Functions
  //===========================================================================

  /**
   * When the component is mounted, adjust the size of the image to the size of the container
   * @param event The event that triggered the function
   */
  const handleContainerLayout = (event: LayoutChangeEvent) => {
    if (trueImageSize) {
      // At first render, the size of the image must be the true size
      setSize(trueImageSize);
      setTrueSizeDisplayed(true);

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

  /**
   * Creates a canvas element and draws the image on it
   * @param {Canvas} canvas - The canvas element to draw the image on.
   */
  const handleCanvas = (canvas: Canvas) => {
    // The image is drawn if the canvas is not undefined, th display size is not undefined, and the current size is not undefined
    if (canvas && displayedImageSize && size) {
      const context = canvas.getContext('2d');
      const image = new CanvasImage(canvas);

      image.addEventListener('load', async () => {
        canvas.width = size.width;
        canvas.height = size.height;
        context.drawImage(image, 0, 0, canvas.width, canvas.height); // TODO: adjust the image size and add border around
        setTrueSizeDisplayed(false);

        /*
         Once the image is drawn once, changes the state to indicate that the image has been drawn with its original size
         It is the way found to get the pixels only once so the image does not take to long to load each time
        */
        if (trueSizeDisplayed) {
          // Change the size to the displayed size
          setSize(displayedImageSize);

          // On the first render, the image pixels are retrieved and updated in the redux store
          const data = await context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height,
          );

          let res: Pixel[] = [];

          for (let i = 0; i < data.height * data.width * 4; i += 4) {
            const red = data.data[i];
            const green = data.data[i + 1];
            const blue = data.data[i + 2];
            const hex =
              red.toString(16) + green.toString(16) + blue.toString(16);
            res.push({ color: hex, annotation: undefined });
          }

          dispatch(setCurrentAnnotatedImagePixels(res));
        }
      });

      image.src = currentAnnotatedImage.imageSource;
    }
  };

  /**
   * Resets the states of the component
   */
  const reset = () => {
    setPath([]);
    setClosedPath(false);
    setInCropCreation(false);
    setCurrentSelectedCrop();
  };

  /**
   * Handles the users presses on the lasso region
   * If the path is closed, it will reset the selection
   * Else it will add the pressed position to the path
   * @param {GestureResponderEvent} e - event
   */
  const handlePress = (e: GestureResponderEvent) => {
    if (!closedPath) {
      if (!inCropCreation) {
        setInCropCreation(true);
      }

      // Gets the position of the press, and rounds its points
      const pressPosition = roundPointCoordinates({
        x: e.nativeEvent.locationX,
        y: e.nativeEvent.locationY,
      });

      // Add the press position to the path
      setPath([...path, pressPosition]);
    } else {
      reset();
    }
  };

  /**
   * Closes the path if the user presses the first point and the path is more than 2 points
   * @param idx The index of the point pressed
   */
  const handlePointPress = (idx: number) => {
    if (path.length > 2 && idx === 0) {
      closePath();
      reset();
    }
  };

  /**
   * Closes the current path and adds the crop to the current image annotation in the store
   */
  const closePath = () => {
    if (!closedPath && path.length > 2) {
      setClosedPath(true);

      // Creates the crop object to add to the current image annotation
      const crop = {
        cropPath: path,
      };

      // Adds the crop to the current image annotation
      dispatch(currentAnnotatedImageAddCrop(crop));
    }
  };

  /**
   * Updates the given point to the given position in the path
   * @param idx The index of the point moved
   * @param newPoint The new position of the point
   */
  const updatePointAtIndex = (idx: number, newPoint: Point) => {
    const newPath = [...path];
    newPath[idx] = newPoint;
    setPath(newPath);
  };

  /**
   * Udpates the path to the given one
   * @param newPath The new path to set
   */
  const updatePath = (newPath: Point[]) => {
    setPath(newPath);
  };

  /**
   * Updates the current selected crop path to the current path
   */
  const updateCrop = () => {
    if (currentSelectedCrop !== undefined) {
      // Creates the new crop object
      const newCrop = {
        cropPath: [...path],
        cropPixels: [],
      };

      // Updates the current image annotation with the new crop in the store
      dispatch(
        setCurrentAnnotatedImageCropAtIndex({
          index: currentSelectedCrop,
          crop: newCrop,
        }),
      );
    }
  };

  /**
   * Checks if a crop is selected and if so, sets the states to its values
   */
  useEffect(() => {
    if (currentSelectedCrop !== undefined) {
      const selectedCrop =
        currentAnnotatedImage.imageCrops[currentSelectedCrop];

      if (selectedCrop) {
        // If a crop is selected, the path is set to its points, the crop is set to be in creation, and the path needs to be closed
        setPath(selectedCrop.cropPath);
        setInCropCreation(true);
        setClosedPath(true);
      } else {
        // If no crop is selected, the states are reset
        setPath([]);
        setInCropCreation(false);
        setClosedPath(false);
      }
    } else {
      setPath([]);
      setInCropCreation(false);
      setClosedPath(false);
    }
  }, [currentAnnotatedImage, currentSelectedCrop]);

  //================================================================================
  // Render
  //================================================================================

  return (
    <View style={styles.container} onLayout={handleContainerLayout}>
      <View style={styles.canvas}>
        <Canvas ref={handleCanvas} />
      </View>
      {displayedImageSize && (
        <TouchableWithoutFeedback onPress={handlePress}>
          <View>
            <Svg
              style={{
                ...styles.pressableArea,
                width: displayedImageSize.width,
                height: displayedImageSize.height,
              }}>
              {inCropCreation && !!path.length && (
                <>
                  <SvgPolygon
                    path={getPolygonPoints(
                      displayedImageSize,
                      path,
                      closedPath,
                    )}
                  />
                  <SvgPolyline
                    path={getPolylinePoints(path, closedPath)}
                    closedPath={closedPath}
                    updatePath={updatePath}
                    updateCrop={updateCrop}
                    containerSize={displayedImageSize}
                  />
                  {path.map(({ x, y }, idx) => (
                    <SvgPoint
                      key={idx}
                      point={{ x, y }}
                      idx={idx}
                      onPress={handlePointPress}
                      closedPath={closedPath}
                      updatePointAtIndex={(point: Point) =>
                        updatePointAtIndex(idx, point)
                      }
                      updateCrop={() => updateCrop()}
                      containerSize={displayedImageSize}
                    />
                  ))}
                </>
              )}
            </Svg>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  canvas: {
    position: 'absolute',
  },
  pressableArea: {
    borderWidth: 1,
  },
});

export default AnnotationArea;
