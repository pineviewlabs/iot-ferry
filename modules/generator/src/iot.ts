import { Mqtt as Transport } from "azure-iot-device-mqtt";
import { ModuleClient as Client, Twin } from "azure-iot-device";
import { Message } from "azure-iot-device";
import { exit } from "./helpers";

// Properties which could be controlled from IoT Hub
interface TwinDesiredProperties {
  AverageSpeed?: number;
  Jitter?: number;
}

// Type describing the callback for a properties change
type TwinDesiredPropertiesCallback = (props: TwinDesiredProperties) => void;
// Type describing the callback for a new message
type MessageCallback = (input: string, data: string) => void;

// Options used when creating IoTClient
interface IoTClientOptions {
  // Callback for a new message
  onMessage: MessageCallback;
  // Callback for a properties change
  onTwinDesiredProperties: TwinDesiredPropertiesCallback;
}

// Helper class to work with IoT Client
export class IoTClient {
  constructor(private client: Client) {}

  // Create a new IoTClient instance
  static async create({
    onMessage,
    onTwinDesiredProperties,
  }: IoTClientOptions) {
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

      // Initialize modules twin
      const twin = await client.getTwin();
      // Execute the passed callback with the immediately received properties
      onTwinDesiredProperties(twin.properties.desired);
      // React to properties change
      twin.on("properties.desired", (delta) => {
        // Execute the passed callback with the received properties delta
        onTwinDesiredProperties(delta);
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
