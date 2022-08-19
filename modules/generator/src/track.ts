import { random } from "./helpers";
import { Point } from "./point";

// Helper class designed to:
// - keep track [:)] of "breadcrumbs" to help ferry navigate in narrow areas
// - advance ferry's position between the "breadcrumbs"
export class Track {
  // Average ferry's speed
  static readonly averageSpeed = 0.02;
  // Randomness factor (straight lines would be boring)
  static readonly jitter = 0.005;

  // List of track's breadcrumb points
  private points: Point[];
  // Current target (point's index)
  private index: number;
  // Current ferry's position
  private position: Point;

  constructor(originBreadcrumbs: Point[], destinationBreadcrumbs: Point[]) {
    // Combine origin and destination ports' breadcrumbs into the single array
    // (note reversing the destination port's points: they are in "departure" order)
    this.points = originBreadcrumbs.concat(
      [...destinationBreadcrumbs].reverse()
    );
    // Current target point is the first ("zeroth" actually) breadcrumb
    this.index = 0;
    // Set the position based on the first breadcrumb
    this.position = Point.from(this.target);
  }

  // Get the current breadcrumb point
  private get target() {
    return this.points[this.index];
  }

  // Get the last breadcrumb point
  private last() {
    return this.points[this.points.length - 1];
  }

  // True if ferry arrived at last breadcrumb point
  public done() {
    return this.index >= this.points.length;
  }

  // Advance the ferry on track and return a ferry's new position
  public next(): Point {
    // If we're arrived at the last breadcrumb — just return that last point
    if (this.done()) return Point.from(this.last());
    // Calculate the distance between the target breadcrumb and ferry's current position
    const distance = Point.distance(this.target, this.position);
    // If distance is less than or equal to average speed
    if (distance <= Track.averageSpeed) {
      // Jump to the target breadcrumb
      this.position.update(this.target);
      // Set the next breadcrumb as a target
      this.index += 1;
      // Otherwise — advance to next breadcrumb using some primitive math
    } else {
      // Calculate the "ideal" step count between current position and the target
      const stepCount = distance / Track.averageSpeed;
      // Increment the current position's latitude with average distance plus some randomness
      this.position.lat +=
        (this.target.lat - this.position.lat) / stepCount +
        random(-Track.jitter, Track.jitter);
      // Increment the current position's longitude with average distance plus some randomness
      this.position.lng +=
        (this.target.lng - this.position.lng) / stepCount +
        random(-Track.jitter, Track.jitter);
    }
    return this.position;
  }
}
