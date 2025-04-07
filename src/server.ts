import app from "./app";
import { initDB } from "./config/db";
import logger from "./config/logger";
import config from "config";
const startServer = async () => {
    const PORT = config.get("server.port") ?? 3300;
    try {
        await initDB();
        // logger.info("Connected to MongoDB successfully!");

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
