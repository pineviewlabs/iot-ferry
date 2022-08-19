import { promises as fs } from "fs";
import { pause } from "./helpers";

import { ports } from "./ports";
import { Route } from "./route";

// File to save the route coordinates to
const dataFilePath = "/tmp/shiny-data/route.csv";

// Entrypoint
async function main() {
  console.info("Data generator: started!");

  // Initialize a route generator object
  const route = new Route(ports);

  // Write a CSV header
  await fs.writeFile(dataFilePath, "lng,lat\n");

  // Infinite loop to generate infinite amount of points
  // Well, at least until the disk is full :)
  while (true) {
    // Generate a ferry's next position
    const position = route.tick();

    // Generate and write a CSV row with ferry's current position
    const line = `${position.lng},${position.lat}`;
    await fs.appendFile(dataFilePath, `${line}\n`);
    console.info(`New line: ${line}`);

    // Wait for one second before generating the next position
    await pause(1000);
  }
}

main();
