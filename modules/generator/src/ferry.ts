import { random } from "./helpers";
import { Port } from "./ports";
import { Track } from "./track";

interface FerryOptions {
  ports: Port[];
  averageSpeed?: number;
  jitter?: number;
}

// Helper class to generate ferry's route points
export class Ferry {
  // List of ports with breadcrumbs
  private ports: Port[];
  // Ferry's average speed
  private averageSpeed: number;
  // Ferry's default average speed
  static readonly defaultAverageSpeed = 0.02;
  // Trajectory calculation' randomness factor
  private jitter: number;
  // Default trajectory calculation' randomness factor
  static readonly defaultJitter = 0.005;
  // Current origin port index
  private originIndex: number;
  // Current destination port index
  private destinationIndex: number;
  // "Breadcrumbs" to help ferry navigate in narrow areas
  private track: Track;

  constructor({ ports, averageSpeed, jitter }: FerryOptions) {
    // Initialize the configuration options
    this.ports = ports;
    this.averageSpeed = averageSpeed || Ferry.defaultAverageSpeed;
    this.jitter = jitter || Ferry.defaultJitter;
    // Start in a random port
    this.originIndex = Math.floor(random(0, this.ports.length));
    // Pick a destination port
    this.destinationIndex = this.pickDestination();
    // Make a joined track from both ports' breadcrumbs
    this.track = this.makeTrack();
  }

  // Update the ferry's average speed
  setAverageSpeed(averageSpeed: number) {
    this.averageSpeed = averageSpeed;
  }

  // Update the trajectory calculation' randomness factor
  setJitter(jitter: number) {
    this.jitter = jitter;
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
  public next() {
    // Generate next position based on a track
    const position = this.track.next(this.averageSpeed, this.jitter);
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
