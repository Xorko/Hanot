import {Point} from '../types/image-annotation-types';
import {getExtremePointsOfPath} from './crop-utils';

/**
 * Returns the orientation of three points.
 * @param p The first point
 * @param q The second point
 * @param r The third point
 * @returns 0 if the points are collinear, 1 if clockwise, 2 if counterclockwise
 */
function orientation(p: Point, q: Point, r: Point) {
  let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

  if (val === 0) {
    return 0; // collinear
  }
  return val > 0 ? 1 : 2; // clock or counterclock wise
}

/**
 * Checks if a point is on a line
 * @param {Point} p - the start point of the line segment
 * @param {Point} q - The point to check
 * @param {Point} r - The end point of the line segment.
 * @returns True if q is on the line segment pr, false otherwise.
 */

function onSegment(p: Point, q: Point, r: Point) {
  if (
    q.x <= Math.max(p.x, r.x) &&
    q.x >= Math.min(p.x, r.x) &&
    q.y <= Math.max(p.y, r.y) &&
    q.y >= Math.min(p.y, r.y)
  ) {
    return true;
  }
  return false;
}

// The function that returns true if
// line segment 'p1q1' and 'p2q2' intersect.

/**
 * Checks if two line segments intersect
 * @param p1 The start point of the first line segment
 * @param q1 The end point of the first line segment
 * @param p2 The start point of the second line segment
 * @param q2 The end point of the second line segment
 * @returns True if the line segments intersect, false otherwise.
 */
function doIntersect(p1: Point, q1: Point, p2: Point, q2: Point) {
  /*
  Find the four orientations needed for
  general and special cases
  */
  let o1 = orientation(p1, q1, p2);
  let o2 = orientation(p1, q1, q2);
  let o3 = orientation(p2, q2, p1);
  let o4 = orientation(p2, q2, q1);

  // General case
  if (o1 !== o2 && o3 !== o4) {
    return true;
  }

  /*
  Special Cases
  p1, q1 and p2 are collinear and
  p2 lies on segment p1q1
  */
  if (o1 === 0 && onSegment(p1, p2, q1)) {
    return true;
  }

  /*
  p1, q1 and p2 are collinear and
  q2 lies on segment p1q1
  */
  if (o2 === 0 && onSegment(p1, q2, q1)) {
    return true;
  }

  /*
  p2, q2 and p1 are collinear and
  p1 lies on segment p2q2
  */
  if (o3 === 0 && onSegment(p2, p1, q2)) {
    return true;
  }

  /*
  p2, q2 and q1 are collinear and
  q1 lies on segment p2q2
  */
  if (o4 === 0 && onSegment(p2, q1, q2)) {
    return true;
  }

  // Doesn't fall in any of the above cases
  return false;
}

/**
 * Checks if a point lies inside a polygon
 * @param point The point to check
 * @param polygon The polygon to check
 * @returns True if the point lies inside the polygon, false otherwise.
 */
const pointInPolygon = (point: Point, polygon: Point[]): Boolean => {
  // Define Infinite (Using INT_MAX caused overflow problems)
  let INF = 10000;

  const n = polygon.length;
  // There must be at least 3 vertices in polygon[]
  if (n < 3) {
    return false;
  }

  // Create a point for line segment from p to infinite
  let extreme: Point = {x: INF, y: point.y};

  /*
  Count intersections of the above line
  with sides of polygon
  */
  let count = 0,
    i = 0;
  do {
    let next = (i + 1) % n;

    /*
    Check if the line segment from 'p' to
    'extreme' intersects with the line
    segment from 'polygon[i]' to 'polygon[next]'
    */
    if (doIntersect(polygon[i], polygon[next], point, extreme)) {
      /*
      If the point 'p' is collinear with line
      segment 'i-next', then check if it lies
      on segment. If it lies, return true, otherwise false
      */
      if (orientation(polygon[i], point, polygon[next]) === 0) {
        return onSegment(polygon[i], point, polygon[next]);
      }

      count++;
    }
    i = next;
  } while (i !== 0);

  // Return true if count is odd, false otherwise
  return count % 2 === 1;
};

/**
 * Retrieves all indexes of point that belong in a path
 * @param path The path to get the points from
 * @param width The width of the image
 * @returns The indexex of the points that are in and on the path
 */
export const getAllPointsInPath = (path: Point[], width: number) => {
  const {maxX, maxY, minX, minY} = getExtremePointsOfPath(path);

  let indexes: number[] = [];

  /*
   Double loop because the points position are not stored in a grid in the store
   So we need to recalculate the indexes based on their position
   */
  for (let i = minY; i <= maxY; i++) {
    for (let j = minX; j <= maxX; j++) {
      const point = {x: j, y: i};
      if (pointInPolygon(point, path)) {
        // We check every points in the square defined by the extreme points and add them to the indexes is they are in the path
        indexes.push(j + i * width);
      }
    }
  }

  return indexes;
};
