// Exit process with optional error reporting
export function exit(code: number, error?: unknown): never {
  if (error) console.error(error);
  process.exit(code);
}

// Interface to describe a coordinate point
export interface Point {
  lat: number;
  lng: number;
}

// Calculate the distance between two points
export const distance = (point1: Point, point2: Point) =>
  Math.sqrt(
    Math.pow(point2.lat - point1.lat, 2) + Math.pow(point2.lng - point1.lng, 2)
  );
