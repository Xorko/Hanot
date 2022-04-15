import React, {Fragment, useContext, useEffect, useState} from 'react';
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Canvas, {Image as CanvasImage} from 'react-native-canvas';
import Svg from 'react-native-svg';
import {useAppDispatch, useAppSelector} from '../../../../app/hooks';
import {CurrentSelectedIndexCropContext} from '../context/CurrentSelectedCropContext';
import {DisplayedImageSizeContext} from '../context/DisplayedImageSizeContext';
import {TrueImageSizeContext} from '../context/TrueImageSizeContext';
import {
  currentAnnotatedImageAddCrop,
  setCurrentAnnotatedImageCropAtIndex,
  setCurrentAnnotatedImagePixels,
} from '../current-annotated-image';
import {Pixel, Point, Size} from '../types/image-annotation-types';
import {
  getPolygonPoints,
  getPolylinePoints,
  roundPointCoordinates,
} from '../utils/crop-utils';
import SvgPoint from './SvgPoint';
import SvgPolygon from './SvgPolygon';
import SvgPolyline from './SvgPolyline';

const AnnotationArea = () => {
  const {displayedImageSize, changeDisplayedImageSize} = useContext(
    DisplayedImageSizeContext,
  );
  const {currentSelectedCropIndex, changeCurrentSelectedCropIndex} = useContext(
    CurrentSelectedIndexCropContext,
  );
  const {trueImageSize} = useContext(TrueImageSizeContext);

  const dispatch = useAppDispatch();

  const [closedPath, setClosedPath] = useState<boolean>(false);
  const [inCropCreation, setInCropCreation] = useState<boolean>(false);
  const [path, setPath] = useState<Point[]>([]);
  const [size, setSize] = useState<Size>();
  const [trueSizeDisplayed, setTrueSizeDisplayed] = useState<boolean>(false);

  const getContainerSize = (event: LayoutChangeEvent) => {
    if (trueImageSize) {
      setSize(trueImageSize);
      setTrueSizeDisplayed(true);
      const {width, height} = event.nativeEvent.layout;
      const dif = Math.min(
        width / trueImageSize.width,
        height / trueImageSize.height,
      );

      const newSize = {
        width: trueImageSize.width * (dif < 1 ? dif : 1),
        height: trueImageSize.height * (dif < 1 ? dif : 1),
      };
      changeDisplayedImageSize(newSize);
    }
  };

  const currentAnnotatedImage = useAppSelector(
    state => state.currentAnnotatedImage.annotatedImage,
  );

  useEffect(() => {
    if (currentSelectedCropIndex !== undefined) {
      const currentSelectedCrop =
        currentAnnotatedImage.imageCrops[currentSelectedCropIndex];

      if (currentSelectedCrop) {
        // If a crop is selected, the path is set to its points, the crop is set to be in creation, and the path needs to be closed
        setPath(currentSelectedCrop.cropPath);
        setInCropCreation(true);
        setClosedPath(true);
      } else {
        // If no crop is selected, the states are reset
        setPath([]);
        setInCropCreation(false);
        setClosedPath(false);
      }
    }
  }, [currentAnnotatedImage, currentSelectedCropIndex]);

  /**
   * Creates a canvas element and draws the image on it with the size adjusted.
   * @param {Canvas} canvas - The canvas element to draw the image on.
   */
  const handleCanvas = (canvas: Canvas) => {
    if (canvas && displayedImageSize && size) {
      const context = canvas.getContext('2d');
      const image = new CanvasImage(canvas);

      image.addEventListener('load', async () => {
        canvas.width = size.width;
        canvas.height = size.height;
        context.drawImage(image, 0, 0, canvas.width, canvas.height); // TODO: adjust the image size and add border around
        setTrueSizeDisplayed(false);
        if (trueSizeDisplayed) {
          setSize(displayedImageSize);
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
            res.push({color: hex, annotation: undefined});
          }

          dispatch(setCurrentAnnotatedImagePixels(res));
        }
      });

      image.src = currentAnnotatedImage.imageSource;
    }
  };

  const reset = () => {
    setPath([]);
    setClosedPath(false);
    setInCropCreation(false);
    changeCurrentSelectedCropIndex();
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

      const pressPosition = roundPointCoordinates({
        x: e.nativeEvent.locationX,
        y: e.nativeEvent.locationY,
      });

      setPath([...path, pressPosition]);
    } else {
      reset();
    }
  };

  const handlePointPress = (idx: number) => {
    if (path.length > 2 && idx === 0) {
      closePath();
      reset();
    }
  };

  const closePath = () => {
    if (!closedPath && path.length > 2) {
      setClosedPath(true);

      const crop = {
        cropPath: path,
        cropPixels: [],
      };

      dispatch(currentAnnotatedImageAddCrop(crop));
    }
  };

  const updatePointAtIndex = (idx: number, newPoint: Point) => {
    const newPath = [...path];
    newPath[idx] = newPoint;
    setPath(newPath);
  };

  const updatePath = (newPath: Point[]) => {
    setPath(newPath);
  };

  const updateCrop = () => {
    if (currentSelectedCropIndex !== undefined) {
      const newCrop = {
        cropPath: [...path],
        cropPixels: [],
      };

      dispatch(
        setCurrentAnnotatedImageCropAtIndex({
          index: currentSelectedCropIndex,
          crop: newCrop,
        }),
      );
    }
  };

  return (
    <View style={styles.container} onLayout={getContainerSize}>
      <View style={styles.canvas}>
        <Canvas ref={handleCanvas} />
      </View>
      {displayedImageSize && (
        <TouchableWithoutFeedback onPress={handlePress}>
          <Svg
            style={{
              ...styles.pressableArea,
              width: displayedImageSize.width,
              height: displayedImageSize.height,
            }}>
            {inCropCreation && !!path.length && (
              <Fragment>
                <SvgPolygon
                  path={getPolygonPoints(displayedImageSize, path, closedPath)}
                />
                <SvgPolyline
                  path={getPolylinePoints(path, closedPath)}
                  closedPath={closedPath}
                  updatePath={updatePath}
                  updateCrop={updateCrop}
                />
                {path.map(({x, y}, idx) => (
                  <SvgPoint
                    key={idx}
                    point={{x, y}}
                    idx={idx}
                    onPress={handlePointPress}
                    closedPath={closedPath}
                    updatePointAtIndex={(point: Point) =>
                      updatePointAtIndex(idx, point)
                    }
                    updateCrop={() => updateCrop()}
                  />
                ))}
              </Fragment>
            )}
          </Svg>
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
