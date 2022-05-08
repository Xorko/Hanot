import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../stores/hooks';
import { Coordinates, Size } from '../../../../types/coordinates-types';
import { getExtremePointsOfPath } from '../utils/crop-utils';

type CropPropsType = {
  path: Coordinates[];
  size: Size;
};

function Crop({ path, size }: CropPropsType) {
  //===========================================================================
  // Redux
  //===========================================================================

  // Retrieves the image source from the redux store
  const imageSrc = useAppSelector(
    state => state.currentAnnotatedImage.imageSource,
  );

  const [croppedImageSource, setCroppedImageSource] = useState<string>('');

  const [imageSize, setImageSize] = useState<Size>();

  useEffect(() => {
    if (imageSrc) {
      const image = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error('CTX is null');
        return;
      }

      image.onerror = () => {
        console.error('Failed to load image');
        return;
      };

      image.onload = () => {
        try {
          canvas.width = size.width;
          canvas.height = size.height;
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(canvas.width, 0);
          ctx.lineTo(canvas.width, canvas.height);
          ctx.lineTo(0, canvas.height);
          ctx.lineTo(0, 0);
          ctx.lineTo(path[0].x + 1, path[0].y + 1);
          path.slice(1).forEach(({ x, y }) => ctx.lineTo(x + 1, y + 1));
          ctx.lineTo(path[0].x + 1, path[0].y + 1);
          ctx.lineTo(0, 0);
          ctx.closePath();
          ctx.clip('evenodd');
          ctx.globalCompositeOperation = 'destination-out';
          ctx.fill();

          const { minX, minY, maxX, maxY } = getExtremePointsOfPath(path);

          const [width, height] = [maxX - minX, maxY - minY];

          setImageSize({ width, height });

          const imageData = ctx.getImageData(minX, minY, width, height);
          canvas.width = width;
          canvas.height = height;
          ctx.putImageData(imageData, 0, 0);

          const dataUrl = canvas.toDataURL('image/png');
          setCroppedImageSource(dataUrl);
        } catch (e) {
          console.error(e);
        }
      };

      image.src = imageSrc;
      canvas.remove();
    }
  }, [imageSrc, path, size.height, size.width]);

  const styles = {
    image: {
      width: imageSize?.width,
      height: imageSize?.height,
      alignSelf: 'center',
    },
  };

  return (
    <>
      {croppedImageSource && imageSize && (
        <img src={croppedImageSource} alt="cropped" style={styles.image} />
      )}
    </>
  );
}

export default Crop;
