// Helper class describing map coordinates pair
export class Point {
  // Create a point with latitude and longitude
  constructor(public lat: number, public lng: number) {}

  // Update a point with the coordinates from another point
  update(point: Point) {
    this.lat = point.lat;
    this.lng = point.lng;
  }

  static distance(point1: Point, point2: Point) {
    return Math.sqrt(
      Math.pow(point2.lat - point1.lat, 2) +
        Math.pow(point2.lng - point1.lng, 2)
    );
  }

  static from(point: Point) {
    return new Point(point.lat, point.lng);
  }

  static default() {
    return new Point(0, 0);
  }
}
