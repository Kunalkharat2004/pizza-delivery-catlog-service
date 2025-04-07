import app from "./app";
import logger from "./config/logger";
import config from "config";
const startServer = () => {
    const PORT = config.get("server.port") ?? 3300;
    try {
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
