import { promises as fs } from "fs";
import { pause } from "./helpers";
import { IoTClient } from "./iot";

import { ports } from "./ports";
import { Ferry } from "./ferry";

// File to save the route coordinates to
const dataFilePath = "/tmp/shiny-data/route.csv";

// Entrypoint
async function main() {
  console.info("Data generator: started!");

  // Initialize a ferry object
  const ferry = new Ferry({ ports });

  // Create an IoT Client
  const iotClient = await IoTClient.create({
    // When new message arrives,
    onMessage: (input, data) => {
      // Just log it to the console
      console.info(input, data);
    },
    // When module twin properties changes,
    onTwinDesiredProperties: ({ AverageSpeed, Jitter }) => {
      console.info(`New properties: ${AverageSpeed}, ${Jitter}`);
      // Set new average speed if provided
      if (AverageSpeed) ferry.setAverageSpeed(AverageSpeed);
      // Set new jitter if provided
      if (Jitter) ferry.setJitter(Jitter);
    },
  });

  // Write a CSV header
  await fs.writeFile(dataFilePath, "lng,lat\n");

  // Infinite loop to generate infinite amount of points
  // Well, at least until the disk is full :)
  while (true) {
    // Generate a ferry's next position
    const position = ferry.next();
    // Send a ferry's position to an analyzer
    iotClient.send("position", `${position.lat}:${position.lng}`);

    // Generate and write a CSV row with ferry's current position
    const line = `${position.lng},${position.lat}`;
    await fs.appendFile(dataFilePath, `${line}\n`);
    console.info(`New line: ${line}`);

    // Wait for one second before generating the next position
    await pause(1000);
  }
}

main();
