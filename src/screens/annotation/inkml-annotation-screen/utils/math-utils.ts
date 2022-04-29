export const distance = (
  pointA: { x: number; y: number },
  pointB: { x: number; y: number },
) => {
  return Math.sqrt(
    Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2),
  );
};
