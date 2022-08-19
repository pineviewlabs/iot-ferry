import { random } from "./helpers";
import { Port } from "./ports";
import { Track } from "./track";

// Helper class to generate ferry's route points
export class Route {
  // Current origin port index
  private originIndex;
  // Current destination port index
  private destinationIndex;
  // "Breadcrumbs" to help ferry navigate in narrow areas
  private track;

  constructor(private ports: Port[]) {
    // Start in a random port
    this.originIndex = Math.floor(random(0, this.ports.length));
    // Pick a destination port
    this.destinationIndex = this.pickDestination();
    // Make a joined track from both ports' breadcrumbs
    this.track = this.makeTrack();
  }

  // Pick a destination port
  private pickDestination() {
    // Simply select a next port in the list
    const index = this.originIndex + 1;
    // Mind the overflow
    return index >= this.ports.length ? 0 : index;
  }

  // Create a track from origin and destination ports' breadcrumbs
  private makeTrack() {
    return new Track(this.origin.breadcrumbs, this.destination.breadcrumbs);
  }

  // Get the current origin port
  private get origin() {
    return this.ports[this.originIndex];
  }

  // Get the current destination port
  private get destination() {
    return this.ports[this.destinationIndex];
  }

  // Advance the ferry and return the ferry's position
  // Pick the next port if arrived to a destination
  public tick() {
    // Generate next position based on a track
    const position = this.track.next();
    // If a ferry reached final track's position (destination)
    if (this.track.done()) {
      // Set the current port as an origin
      this.originIndex = this.destinationIndex;
      // Pick the next destination port
      this.destinationIndex = this.pickDestination();
      // Reinitialize the breadcrumbs track
      this.track = this.makeTrack();
    }
    return position;
  }
}
