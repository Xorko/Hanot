import React, {useContext, useEffect, useState} from 'react';
import Canvas, {Image as CanvasImage} from 'react-native-canvas';
import {useAppSelector} from '../../../../app/hooks';
import {DisplayedImageSizeContext} from '../context/DisplayedImageSizeContext';
import {CurrentAnnotatedImageState} from '../current-annotated-image';
import {Point} from '../types/image-annotation-types';
import {getExtemityOfPath} from '../utils/crop-utils';

interface CropPropsType {
  path: Point[];
}

const Crop = ({path}: CropPropsType) => {
  const imageSrc = useAppSelector(
    (state: {currentAnnotatedImage: CurrentAnnotatedImageState}) =>
      state.currentAnnotatedImage.annotatedImage.imageSource,
  );

  const {displayedImageSize: imageDisplayedSize} = useContext(
    DisplayedImageSizeContext,
  );

  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [firstRender, setFirstRender] = useState<boolean>(true);

  useEffect(() => {
    setFirstRender(false);
  }, []);

  const handleCanvas = (canvas: Canvas) => {
    // TODO : find a way to calculate only on first render
    if (canvas && (path !== currentPath || firstRender)) {
      const {minX, minY, maxX, maxY} = getExtemityOfPath(path);
      const [width, height] = [maxX - minX, maxY - minY];
      canvas.width = width;
      canvas.height = height;

      const croppedImagePos = path.map(elt => ({
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
        context.beginPath();
        context.moveTo(croppedImagePos[0].x, croppedImagePos[0].y);
        croppedImagePos.slice(1).forEach(({x, y}) => context.lineTo(x, y));
        context.lineTo(croppedImagePos[0].x, croppedImagePos[0].y);
        context.clip();
        context.drawImage(
          imageObj,
          -minX,
          -minY,
          imageDisplayedSize.width,
          imageDisplayedSize.height,
        );
        setCurrentPath(path);
      });
    }
  };

  return <Canvas ref={handleCanvas} />;
};

export default Crop;
