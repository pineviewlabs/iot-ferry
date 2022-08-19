// Generate a pseudo-random number between min and max values
export const random = (min: number, max: number) =>
  Math.random() * (max - min) + min;

// Pause an execution for ms milliseconds
export const pause = (ms: number) => new Promise((res) => setTimeout(res, ms));
