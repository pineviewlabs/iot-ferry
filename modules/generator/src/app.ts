import { promises as fs } from "fs";
import { pause } from "./helpers";
import { IoTClient } from "./iot";

import { ports } from "./ports";
import { Ferry } from "./ferry";
import { Point } from "./point";

// File to save the route coordinates to
const dataFilePath = "/tmp/shiny-data/route.csv";

interface FerryPosition {
  previous: Point | null;
  current: Point | null;
}

// Entrypoint
async function main() {
  console.info("Data generator: started!");

  // Initialize a ferry object
  const ferry = new Ferry({ ports });

  const iotClient = await IoTClient.create({
    onMessage: (input, data) => {
      console.info(input, data);
    },
    onTwinDesiredProperties: ({ AverageSpeed, Jitter }) => {
      if (AverageSpeed) ferry.setAverageSpeed(AverageSpeed);
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
