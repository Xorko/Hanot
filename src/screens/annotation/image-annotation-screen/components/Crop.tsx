import React, {useEffect, useState} from 'react';
import Canvas, {Image as CanvasImage} from 'react-native-canvas';
import {useAppSelector} from '../../../../app/hooks';
import {CurrentAnnotatedImageState} from '../current-annotated-image';
import {Point, Size} from '../types/image-annotation-types';
import {getExtremePointsOfPath} from '../utils/crop-utils';

interface CropPropsType {
  path: Point[];
  size: Size;
}

/* A crop of the image */
const Crop = ({path, size}: CropPropsType) => {
  //===========================================================================
  // Redux
  //===========================================================================

  // Retrieves the image source from the redux store
  const imageSrc = useAppSelector(
    (state: {currentAnnotatedImage: CurrentAnnotatedImageState}) =>
      state.currentAnnotatedImage.annotatedImage.imageSource,
  );

  //===========================================================================
  // State
  //===========================================================================

  // The path being currently drawn
  const [currentPath, setCurrentPath] = useState<Point[]>([]);

  // State used to get the crop displayed only once (certainly not the best way to do it)
  const [firstRender, setFirstRender] = useState<boolean>(true);

  //===========================================================================
  // Functions
  //===========================================================================

  // On the first render, change the first render state to indicate that the crop has been displayed
  useEffect(() => {
    setFirstRender(false);
  }, []);

  //===========================================================================
  // Functions
  //===========================================================================

  /**
   * Draws the crop on the canvas
   * @param canvas The canvas to draw on
   */
  const handleCanvas = (canvas: Canvas) => {
    /*
      The passed prop can be undefined (RNCanvas particularity) so it is checked before drawing
      The crop is drawn only if it is the first render of if the crop path has been updated
     */
    if (canvas && (path !== currentPath || firstRender)) {
      // Gets the size of the crop and sets the canvas size to it
      const {minX, minY, maxX, maxY} = getExtremePointsOfPath(path);
      const [width, height] = [maxX - minX, maxY - minY];
      canvas.width = width;
      canvas.height = height;

      /*
        To display the crop, the image is displayed at the start of the path and we limit the display to the crop
        Because of that the path needs to be adjusted to the image position
       */
      const adjustedPath = path.map(elt => ({
        x: elt.x - minX,
        y: elt.y - minY,
      }));

      const context = canvas.getContext('2d');

      const imageObj = new CanvasImage(canvas);
      imageObj.src = imageSrc;

      imageObj.addEventListener('load', async () => {
        if (path.length < 3) {
          throw '';
        }

        // TODO: Adjust the crop size to the container size
        // The crop is drawn on the canvas and separated from the image
        context.beginPath();
        context.moveTo(adjustedPath[0].x, adjustedPath[0].y);
        adjustedPath.slice(1).forEach(({x, y}) => context.lineTo(x, y));
        context.lineTo(adjustedPath[0].x, adjustedPath[0].y);
        context.clip();
        context.drawImage(imageObj, -minX, -minY, size.width, size.height);
        setCurrentPath(path);
      });
    }
  };

  //===========================================================================
  // Render
  //===========================================================================

  return <Canvas ref={handleCanvas} />;
};

export default Crop;
