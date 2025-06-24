import app from "./app";
import { initDB } from "./config/db";
import logger from "./config/logger";
import config from "config";
import { createMessageProducerBroker } from "./common/factories/brokerFactory";
const startServer = async () => {
    const PORT = config.get("server.port") ?? 3300;
    try {
        await initDB();
        logger.info("Database connection established");

        const messageProducerBroker = createMessageProducerBroker();
        await messageProducerBroker.connect();
        logger.info("Connected to broker");

        app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));
    } catch (err: unknown) {
        if (err instanceof Error) {
            logger.error(err.message);
            logger.on("finish", () => {
                process.exit(1);
            });
        }
    }
};

startServer();
