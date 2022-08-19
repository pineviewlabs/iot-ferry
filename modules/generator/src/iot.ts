import { Mqtt as Transport } from "azure-iot-device-mqtt";
import { ModuleClient as Client, Twin } from "azure-iot-device";
import { Message } from "azure-iot-device";
import { exit } from "./helpers";

interface TwinDesiredProperties {
  AverageSpeed?: number;
  Jitter?: number;
}

type TwinDesiredPropertiesCallback = (props: TwinDesiredProperties) => void;
type MessageCallback = (input: string, data: string) => void;

interface IoTClientOptions {
  onMessage: MessageCallback;
  onTwinDesiredProperties: TwinDesiredPropertiesCallback;
}

export class IoTClient {
  constructor(private client: Client) {}

  static async create({
    onMessage,
    onTwinDesiredProperties,
  }: IoTClientOptions) {
    try {
      const client = await Client.fromEnvironment(Transport);
      client.on("error", exit.bind(-1));
      await client.open();
      console.info("IoT Hub module client initialized");

      client.on("inputMessage", (input: string, message: Message) => {
        const data = message.getBytes().toString("utf-8");
        console.info(
          `Message received: input=${input}; data=${data}`
        );
        onMessage(input, data);
      });

      const twin = await client.getTwin();
      onTwinDesiredProperties(twin.properties.desired);
      twin.on("properties.desired", (delta) => {
        onTwinDesiredProperties(delta);
      });

      return new IoTClient(client);
    } catch (error) {
      exit(-1, error);
    }
  }

  async send(output: string, data: string) {
    const message = new Message(data);
    await this.client.sendOutputEvent(output, message);
    console.info(
      `Message sent: output=${output}; data=${data}`
    );
  }
}
