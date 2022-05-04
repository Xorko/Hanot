import { Coordinates, Size } from '../../../../types/coordinates-types';
export const getScript = (
  path: Coordinates[],
  size: Size,
  imageSrc: string,
) => {
  const { minX, minY, maxX, maxY } = getExtremePointsOfPath(path);
  const [width, height] = [maxX - minX, maxY - minY];

  return `
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');
    canvas.width = ${size.width};
    canvas.height = ${size.height};

    // Gets the path of the crop
    const p = '${path.map(({ x, y }) => `${x},${y}`).join(' ')}';
    const path = p.split(' ').map(elt => ({x: Number(elt.split(',')[0]), y: Number(elt.split(',')[1])}));

    const image = new Image();

    image.onload = () => {

      // Crop the image
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(canvas.width, 0);
      context.lineTo(canvas.width, canvas.height);
      context.lineTo(0, canvas.height);
      context.lineTo(0, 0);
      context.lineTo(path[0].x, path[0].y);
      path.slice(1).forEach(({ x, y }) => context.lineTo(x, y));
      context.lineTo(path[0].x, path[0].y);
      context.lineTo(0, 0);
      context.closePath();
      context.clip('evenodd');
      context.globalCompositeOperation = 'destination-out';
      context.fill();

      // Place the crop at top left corner
      const minX = ${minX};
      const minY = ${minY};
      const width = ${width};
      const height = ${height};
      const imageData = context.getImageData(minX, minY, width, height);
      canvas.width = width;
      canvas.height = height;
      context.putImageData(imageData, 0, 0);

    };

    image.src = '${imageSrc}';

    true; // note: this is required, or you'll sometimes get silent failures
  `;
};

/**
 * Rounds x and y coordinates of given point to the nearest integer
 * @param {Coordinates} - The point to be rounded
 */
export const roundPointCoordinates = ({ x, y }: Coordinates): Coordinates => ({
  x: Math.round(x),
  y: Math.round(y),
});

/**
 * Returns the four corners of a rectangle with the given width and height from the image size
 * @param {Size} containerSize - The size of container to get the border of
 * @returns An array of points corresponding to the four corners of the rectangle.
 */
const getBorder = (containerSize: Size): Coordinates[] => {
  const div = { x: 0, y: 0 };

  const topRight: Coordinates = div;
  const topLeft = { x: div.x + containerSize.width, y: div.y };
  const bottomRight = { x: div.x, y: div.y + containerSize.height };
  const bottomLeft = {
    x: div.x + containerSize.width,
    y: div.y + containerSize.height,
  };

  return [topRight, topLeft, bottomLeft, bottomRight];
};

/**
 * Given an image size and a path, returns a list of points that form a polygon
 * @param {Size} containerSize - Size The size of the container to get the border of
 * @param {Coordinates[]} path - The points of the polygon.
 * @param {Boolean} closedPath - Boolean indicating whether the path is closed or not.
 * @returns A list of points that make up the polygon.
 */
export const getPolygonPoints = (
  containerSize: Size,
  path: Coordinates[],
  closedPath: Boolean,
): Coordinates[] => {
  const border = getBorder(containerSize);

  return closedPath
    ? [...border, border[0], ...path, path[0], border[0]]
    : border;
};

/**
 * Given a path and a boolean indicating whether the path is closed, returns a list of points that
 * represents the polyline
 * @param {Coordinates[]} path - The array of points that make up the polyline.
 * @param {Boolean} closed - Boolean indicating whether the path is closed or not.
 * @returns An array of points.
 */
export const getPolylinePoints = (path: Coordinates[], closed: Boolean) => {
  return path.concat(closed ? path[0] : []);
};

/**
 * Retrieves the extreme points of a path
 * @param path The path to get the extreme points from
 * @returns The extreme points of the path as an object with minx, minY and maxX and maxY properties
 */
export const getExtremePointsOfPath = (path: Coordinates[]) => {
  const xAxis = path.map(({ x }) => x);
  const yAxis = path.map(({ y }) => y);
  const [minX, minY] = [
    Math.min.apply(null, xAxis),
    Math.min.apply(null, yAxis),
  ];
  const [maxX, maxY] = [
    Math.max.apply(null, xAxis),
    Math.max.apply(null, yAxis),
  ];

  return { minX, minY, maxX, maxY };
};
