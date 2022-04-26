import { useEffect, useState } from 'react';
import { Platform, Pressable } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../../stores/hooks';
import { useCurrentSelectedCropContext } from '../context/CurrentSelectedCropContext';
import { useDisplayedImageSizeContext } from '../context/DisplayedImageSizeContext';
import { useLassoModifiedContext } from '../context/LassoModifiedContext';
import {
  currentAnnotatedImageAddCrop,
  setCurrentAnnotatedImageCropAtIndex,
} from '../current-annotated-image';
import type { Point } from '../types/image-annotation-types';
import { roundPointCoordinates } from '../utils/crop-utils';
import LassoGeometry from './LassoGeometry';

function Lasso() {
  //===========================================================================
  // Redux
  //===========================================================================

  const dispatch = useAppDispatch();

  // The image object that is currently being annotated
  const currentAnnotatedImageCrops = useAppSelector(
    state => state.currentAnnotatedImage.annotatedImage.imageCrops,
  );

  //===========================================================================
  // Contexts
  //===========================================================================

  const { currentSelectedCrop, setCurrentSelectedCrop } =
    useCurrentSelectedCropContext();

  const { displayedImageSize } = useDisplayedImageSizeContext();

  const { lassoModified, setLassoModified } = useLassoModifiedContext();

  //===========================================================================
  // State
  //===========================================================================

  // The current path of the crop
  const [path, setPath] = useState<Point[]>([]);

  // Indicates if the crop current path is closed (i.e. the user has finished)
  const [closedPath, setClosedPath] = useState<boolean>(false);

  // Indicates if the a crop is currently being drawn or modified
  const [inCropCreation, setInCropCreation] = useState<boolean>(false);

  //===========================================================================
  // Functions
  //===========================================================================

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
   * Handles the users presses on the lasso region
   * If the path is closed, it will reset the selection
   * Else it will add the pressed position to the path
   * @param event Mouse event that triggered the press
   */
  const handlePress = (e: any) => {
    if (!closedPath) {
      if (!inCropCreation) {
        setInCropCreation(true);
      }

      // Gets the position of the press, and rounds its points
      const pressPosition =
        Platform.OS === 'web'
          ? roundPointCoordinates({
              x: e.nativeEvent.layerX,
              y: e.nativeEvent.layerY,
            })
          : roundPointCoordinates({
              x: e.nativeEvent.locationX,
              y: e.nativeEvent.locationY,
            });

      // Add the press position to the path
      setPath([...path, pressPosition]);
    } else {
      if (!lassoModified) {
        // If the lasso is not modified, it means that user clicked to reset the lasso
        reset();
      }

      setLassoModified(false);
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
   * Updates the given point to the given position in the path
   * @param idx The index of the point moved
   * @param newPoint The new position of the point
   */
  const updatePointAtIndex = (idx: number, newPoint: Point) => {
    const newPath = [...path];
    newPath[idx] = newPoint;
    setPath(newPath);
  };

  //===========================================================================
  // Render
  //===========================================================================

  /**
   * Checks if a crop is selected and if so, sets the states to its values
   */
  useEffect(() => {
    if (currentSelectedCrop !== undefined) {
      const selectedCrop = currentAnnotatedImageCrops[currentSelectedCrop];

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
  }, [currentAnnotatedImageCrops, currentSelectedCrop]);

  return (
    <>
      {displayedImageSize && (
        <Pressable onPress={handlePress}>
          <LassoGeometry
            path={path}
            displayedImageSize={displayedImageSize}
            inCropCreation={inCropCreation}
            closedPath={closedPath}
            updatePath={updatePath}
            updateCrop={updateCrop}
            updatePointAtIndex={updatePointAtIndex}
            handlePointPress={handlePointPress}
          />
        </Pressable>
      )}
    </>
  );
}

export default Lasso;
