import config from "config";
import { KafkaProducerBroker } from "../../config/kafka";
import { MessageProducerBroker } from "../types/brokers";

let messageProducerBroker: MessageProducerBroker | null = null;

export const createMessageProducerBroker = () => {
    if (!messageProducerBroker) {
        messageProducerBroker = new KafkaProducerBroker(
            config.get("kafka.clientId") as string,
            config.get("kafka.brokers") as string[],
        );
    }
    return messageProducerBroker;
};
