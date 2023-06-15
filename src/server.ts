import express from "express";
import mongoose from "mongoose";
import { sequelize, dbCreation } from "./config/database";
import { config } from "./config/config";
import routes from "./startup/routes";
import { logger } from "./utilities/logger";

const app: express.Application = express();

async function startServer() {
    try {
        await mongoose.connect(config.mongodb as string);

        logger.info("Connected to MongoDB");

        await dbCreation();

        await sequelize.authenticate();
        logger.info("Connected to the PostgreSQL database successfully.");

        const PORT = config.port || 3000;

        routes(app);

        const server = app.listen(PORT, function () {
            logger.info(`Server running on port: ${PORT} ...`);
        });

        process.on("SIGINT", async () => {
            try {
                await server.close();

                await sequelize.close();
                logger.info("Disconnected from PostgreSQL database");

                await mongoose.disconnect();
                logger.info("Disconnected from MongoDB");

                logger.info("Server closed");
                process.exit(0);
            } catch (error) {
                logger.error("Error disconnecting from databases:", error);
                process.exit(1);
            }
        });
    } catch (error) {
        logger.error("Error starting the server:", error);
        process.exit(1);
    }
}

startServer();
