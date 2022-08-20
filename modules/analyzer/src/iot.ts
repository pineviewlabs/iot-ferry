import { Mqtt as Transport } from "azure-iot-device-mqtt";
import { ModuleClient as Client } from "azure-iot-device";
import { Message } from "azure-iot-device";
import { exit } from "./helpers";

// Type describing the callback for a new message
type MessageCallback = (input: string, data: string) => void;

// Options used when creating IoTClient
interface IoTClientOptions {
  // Callback for a new message
  onMessage: MessageCallback;
}

// Helper class to work with IoT Client
export class IoTClient {
  constructor(private client: Client) {}

  // Create a new IoTClient instance
  static async create({ onMessage }: IoTClientOptions) {
    try {
      // Create and initialize IoT Client
      const client = await Client.fromEnvironment(Transport);
      client.on("error", exit.bind(-1));
      await client.open();
      console.info("IoT Hub module client initialized");

      // React to an incoming message
      client.on("inputMessage", (input: string, message: Message) => {
        // Transform the message data to a string
        const data = message.getBytes().toString("utf-8");
        console.info(
          `Message received: input=${input}; data=${data}`
        );
        // Execute the passed callback
        onMessage(input, data);
      });

      return new IoTClient(client);
    } catch (error) {
      exit(-1, error);
    }
  }

  // Send the data to the named output as an IoT message
  async send(output: string, data: string) {
    const message = new Message(data);
    await this.client.sendOutputEvent(output, message);
    console.info(
      `Message sent: output=${output}; data=${data}`
    );
  }
}
