// Built-in Node.js module to work with file system
const fs = require("fs").promises;

// Path to a file with generated coordinates
const dataFilePath =
  "/tmp/shiny-data/points.csv";

//const dataFilePath = "points.csv";

// Limits (min/max values)
const bounds = {
  // Latitude
  lat: {
    min: 10,
    max: 15,
  },
  // Longitude
  lng: {
    min: 40,
    max: 50,
  },
  // Speed
  speed: {
    min: -0.1,
    max: 0.1,
  },
  // Speed alteration
  speedDelta: {
    min: -0.05,
    max: 0.05,
  },
};

// Generate a pseudo-random number between min and max values
const random = ({ min, max }) =>
  Math.random() * (max - min) + min;

// Adjust the value if out of bounds
const bound = ({ min, max }, value) =>
  value > max ? max : value < min ? min : value;

// Are passed coordinates considered to be in the corner (according to map limits)
// Used to get out of corners :)
const isCornered = ({ lat, lng }, lim = bounds.speed.max) => {
  const isLatMin = lat - bounds.lat.min < lim;
  const isLatMax = bounds.lat.max - lat < lim;
  const isLngMin = lng - bounds.lng.min < lim;
  const isLngMax = bounds.lng.max - lng < lim;
  return (
    (isLatMin && isLngMin) ||
    (isLatMin && isLngMax) ||
    (isLatMax && isLngMin) ||
    (isLatMax && isLngMax)
  );
};

// Pause an execution for ms milliseconds
const pause = (ms) => new Promise((res) => setTimeout(res, ms));

// Entrypoint
async function main() {
  console.info("Data generator: started");

  // Ferry's current position
  const position = {
    lat: bounds.lat.min + (bounds.lat.max - bounds.lat.min) / 2,
    lng: bounds.lng.min + (bounds.lng.max - bounds.lng.min) / 2,
  };

  // Ferry's current speed
  const speed = {
    lat: random(bounds.speed),
    lng: random(bounds.speed),
  };

  // Write a CSV header
  await fs.writeFile(dataFilePath, "lat,lng\n");

  // Infinite loop to generate infinite amount of points
  // Well, at least until the disk is full :)
  while (true) {
    // Generate and write a CSV row with ferry's current coordinates
    const line = `${position.lat},${position.lng}`;
    await fs.appendFile(dataFilePath, `${line}\n`);
    console.info(`New line: ${line}`);

    // Update the ferry's current position (considering map limits)
    position.lat = bound(bounds.lat, position.lat + speed.lat);
    position.lng = bound(bounds.lng, position.lng + speed.lng);

    // Update the ferry's current speed (considering speed limits)
    speed.lat = bound(bounds.speed, speed.lat + random(bounds.speedDelta));
    speed.lng = bound(bounds.speed, speed.lng + random(bounds.speedDelta));

    // Check if ferry is cornered and "bounce" out of corner if so
    if (isCornered(position)) {
      console.info("We're cornered! Emergency turnaround!");
      speed.lat = -speed.lat;
      speed.lng = -speed.lng;
    }

    // Wait for one second before generating the next position
    await pause(1000);
  }
}

main();
