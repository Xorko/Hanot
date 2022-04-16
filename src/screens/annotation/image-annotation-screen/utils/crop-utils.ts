import { Point, Size } from '../types/image-annotation-types';

/**
 * Rounds x and y coordinates of given point to the nearest integer
 * @param {Point} - The point to be rounded
 */
export const roundPointCoordinates = ({ x, y }: Point): Point => ({
  x: Math.round(x),
  y: Math.round(y),
});

/**
 * Returns the four corners of a rectangle with the given width and height from the image size
 * @param {Size} containerSize - The size of container to get the border of
 * @returns An array of points corresponding to the four corners of the rectangle.
 */
const getBorder = (containerSize: Size): Point[] => {
  const div = { x: 0, y: 0 };

  const topRight: Point = div;
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
 * @param {Point[]} path - The points of the polygon.
 * @param {Boolean} closedPath - Boolean indicating whether the path is closed or not.
 * @returns A list of points that make up the polygon.
 */
export const getPolygonPoints = (
  containerSize: Size,
  path: Point[],
  closedPath: Boolean,
): Point[] => {
  const border = getBorder(containerSize);

  return closedPath
    ? [...border, border[0], ...path, path[0], border[0]]
    : border;
};

/**
 * Given a path and a boolean indicating whether the path is closed, returns a list of points that
 * represents the polyline
 * @param {Point[]} path - The array of points that make up the polyline.
 * @param {Boolean} closed - Boolean indicating whether the path is closed or not.
 * @returns An array of points.
 */
export const getPolylinePoints = (path: Point[], closed: Boolean) => {
  return path.concat(closed ? path[0] : []);
};

/**
 * Retrieves the extreme points of a path
 * @param path The path to get the extreme points from
 * @returns The extreme points of the path as an object with minx, minY and maxX and maxY properties
 */
export const getExtremePointsOfPath = (path: Point[]) => {
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
