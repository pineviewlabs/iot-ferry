import { distance, Point } from "./helpers";
import { IoTClient } from "./iot";

// How often to report total distance
const reportingIntervalMs = 10 * 1000;

// Entry point
async function main() {
  // Total distance travelled by the ferry
  let totalDistance = 0;
  // Ferry's latest position
  let position: Point | null = null;

  // Create an IoT Client
  const iotClient = await IoTClient.create({
    // When the new message arrive
    onMessage: (input, data) => {
      // If message arrived to the "position" input
      if (input === "position") {
        // fetch latitude and longitude from the message's data
        const [lat, lng] = data.split(":").map(Number);

        // Increment the total distance
        if (position) totalDistance += distance({ lat, lng }, position);
        // Update the latest position
        position = { lat, lng };
      }
    },
  });

  setInterval(() => {
    // Report the total distance to IoT Hub each reportingIntervalMs ms
    iotClient.send("totalDistance", `${totalDistance}`);
  }, reportingIntervalMs);
}

main();
