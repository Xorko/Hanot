import { Pixel } from '../types/image-annotation-types';

export const getImagePixels = (
  imageSrc: string,
  callback: (err: Error | null, pixels: Pixel[]) => void,
) => {
  const image = new Image();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return callback(new Error('CTX is null'), []);
  }

  image.onerror = () => {
    callback(new Error('Failed to load image'), []);
  };

  image.onload = () => {
    try {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      ctx.drawImage(image, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const pixels: Pixel[] = [];

      for (let i = 0; i < imageData.height * imageData.width * 4; i += 4) {
        const red = imageData.data[i];
        const green = imageData.data[i + 1];
        const blue = imageData.data[i + 2];

        // Gets the hexadecimal value of the pixel color
        const hex = red.toString(16) + green.toString(16) + blue.toString(16);

        if (hex === 'ffffff') {
          pixels.push({ color: '#FFFFFF', annotation: 'background' });
        } else {
          pixels.push({
            color: '#' + hex.toLocaleUpperCase(),
            annotation: undefined,
          });
        }
      }

      callback(null, pixels);
    } catch (err) {
      callback(err instanceof Error ? err : new Error(String(err)), []);
    }
  };

  image.src = imageSrc;
  canvas.remove();
};
