/**
 * Slicing Physics Engine for Word Ninja
 * Provides high-speed line-segment vs bounding-box collision detection
 * to reliably register swipes even with fast mouse/finger movements between frames.
 */

export function lineIntersectsBox(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  bx: number,
  by: number,
  bw: number,
  bh: number
): boolean {
  // If either endpoint is inside the box
  if (x1 >= bx && x1 <= bx + bw && y1 >= by && y1 <= by + bh) return true;
  if (x2 >= bx && x2 <= bx + bw && y2 >= by && y2 <= by + bh) return true;

  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);

  // Quick bounding box rejection
  if (maxX < bx || minX > bx + bw || maxY < by || minY > by + bh) {
    return false;
  }

  const ccw = (ax: number, ay: number, bx: number, by: number, cx: number, cy: number) => {
    return (cy - ay) * (bx - ax) > (by - ay) * (cx - ax);
  };

  const segmentsIntersect = (
    p1x: number,
    p1y: number,
    p2x: number,
    p2y: number,
    q1x: number,
    q1y: number,
    q2x: number,
    q2y: number
  ) => {
    return (
      ccw(p1x, p1y, q1x, q1y, q2x, q2y) !== ccw(p2x, p2y, q1x, q1y, q2x, q2y) &&
      ccw(p1x, p1y, p2x, p2y, q1x, q1y) !== ccw(p1x, p1y, p2x, p2y, q2x, q2y)
    );
  };

  const xLeft = bx;
  const xRight = bx + bw;
  const yTop = by;
  const yBottom = by + bh;

  return (
    segmentsIntersect(x1, y1, x2, y2, xLeft, yTop, xRight, yTop) ||
    segmentsIntersect(x1, y1, x2, y2, xRight, yTop, xRight, yBottom) ||
    segmentsIntersect(x1, y1, x2, y2, xRight, yBottom, xLeft, yBottom) ||
    segmentsIntersect(x1, y1, x2, y2, xLeft, yBottom, xLeft, yTop)
  );
}

