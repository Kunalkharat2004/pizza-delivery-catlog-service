import { Kafka, Producer } from 'kafkajs';
import { MessageProducerBroker } from '../common/types/brokers';

export class KafkaProducerBroker implements MessageProducerBroker {
    private producer: Producer;
    constructor(clientId: string, brokers: string[]) {
        const kafka = new Kafka({
            clientId,
            brokers,
        })
        this.producer = kafka.producer(); 
    }

    async connect() {
        await this.producer.connect();
    }

    async disconnect() {
        if (this.producer) {
            await this.producer.disconnect();
        }
    }
    /**
     * @param topic - The Kafka topic to which the message will be sent.
     * @param message - The message to be sent to the Kafka topic.
     * @throws {Error} - When the producer is not connected
     */
    async sendMessage(topic: string, message: string) {
        if (!this.producer) {
            throw new Error("Producer is not connected");
        }

        try {
            await this.producer.send({
                topic,
                messages: [
                    { value: message },
                ],
            });
        } catch (error) {
            console.error("Error sending message to Kafka:", error);
            throw error;
        }
    }
}