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
import {
  currentAnnotatedImageAddCrop,
  CurrentAnnotatedImageState,
  setCurrentAnnotatedImageCropAtIndex,
} from '../current-annotated-image';
import type {Size} from '../types/image-annotation-types';
import {Point} from '../types/image-annotation-types';
import {
  getPolygonPoints,
  getPolylinePoints,
  roundPointCoordinates,
} from '../utils/crop-utils';
import SvgPoint from './SvgPoint';
import SvgPolygon from './SvgPolygon';
import SvgPolyline from './SvgPolyline';

const AnnotationArea = () => {
  const imageSize: Size = {width: 100, height: 100};

  const {changeDisplayedImageSize: changeImageDisplayedSize} = useContext(
    DisplayedImageSizeContext,
  );
  const {currentSelectedCropIndex, changeCurrentSelectedCropIndex} = useContext(
    CurrentSelectedIndexCropContext,
  );
  const currentSelectedCrop = useAppSelector(
    (state: {currentAnnotatedImage: CurrentAnnotatedImageState}) => {
      if (currentSelectedCropIndex !== undefined) {
        return state.currentAnnotatedImage.annotatedImage.imageCrops[
          currentSelectedCropIndex
        ];
      }
    },
  );

  const dispatch = useAppDispatch();

  const [closedPath, setClosedPath] = useState<boolean>(false);
  const [inCropCreation, setInCropCreation] = useState<boolean>(false);
  const [path, setPath] = useState<Point[]>([]);
  const [containerSize, setContainerSize] = useState<Size>();

  const getContainerSize = (event: LayoutChangeEvent) => {
    const {width, height} = event.nativeEvent.layout;
    setContainerSize({width, height});
    changeImageDisplayedSize(imageSize);
  };

  const currentAnnotatedImage = useAppSelector(
    state => state.currentAnnotatedImage.annotatedImage,
  );

  useEffect(() => {
    if (currentSelectedCrop) {
      setPath(currentSelectedCrop.cropPath);
      setInCropCreation(true);
      setClosedPath(true);
    } else {
      setPath([]);
      setInCropCreation(false);
      setClosedPath(false);
    }
  }, [currentSelectedCrop]);

  /**
   * Creates a canvas element and draws the image on it with the size adjusted.
   * @param {Canvas} canvas - The canvas element to draw the image on.
   */
  const handleCanvas = (canvas: Canvas) => {
    if (canvas) {
      const context = canvas.getContext('2d');
      const image = new CanvasImage(canvas);

      image.addEventListener('load', async () => {
        canvas.width = imageSize.width;
        canvas.height = imageSize.height;
        context.drawImage(image, 0, 0, canvas.width, canvas.height); // TODO: adjust the image size and add border around
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
    console.log(newPath);
    newPath[idx] = newPoint;
    console.log(newPath);
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
      {containerSize && (
        <TouchableWithoutFeedback onPress={handlePress}>
          <Svg
            style={{
              ...styles.pressableArea,
              width: imageSize.width,
              height: imageSize.height,
            }}>
            {inCropCreation && !!path.length && (
              <Fragment>
                <SvgPolygon
                  path={getPolygonPoints(containerSize, path, closedPath)}
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
    justifyContent: 'center',
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
