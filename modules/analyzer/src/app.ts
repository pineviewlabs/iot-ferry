import { distance, Point } from "./helpers";
import { IoTClient } from "./iot";

const reportingIntervalMs = 10 * 1000;

async function main() {
  let totalDistance = 0;
  let position: Point | null = null;
  const iotClient = await IoTClient.create({
    onMessage: (input, data) => {
      if (input === "position") {
        const [lat, lng] = data.split(":").map(Number);
        if (position) totalDistance += distance({ lat, lng }, position);
        position = { lat, lng };
      }
    },
  });

  setInterval(() => {
    iotClient.send("totalDistance", `${totalDistance}`);
  }, reportingIntervalMs);
}

main();
