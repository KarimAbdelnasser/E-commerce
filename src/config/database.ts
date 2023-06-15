import { Sequelize } from "sequelize";
import { config } from "./config";

export const sequelize = new Sequelize({
    username: config.postgresqlUser,
    password: config.postgresqlPass,
    database: config.postgresqlDatabase,
    host: config.postgresqlHost,
    dialect: "postgres",
    logging: false,
});

export const dbCreation = async () => {
    try {
        // Check if the database exists
        const checkQuery = `SELECT * FROM pg_catalog.pg_database WHERE datname = '${config.postgresqlDatabase}';`;
        await sequelize.query(checkQuery);
        console.log(`Database '${config.postgresqlDatabase}' already exists.`);
    } catch (error: any) {
        const sequelizeWithoutDB = new Sequelize({
            dialect: "postgres",
            host: config.postgresqlHost,
            username: config.postgresqlUser,
            password: config.postgresqlPass,
        });
        if (
            error.message ===
            `database "${config.postgresqlDatabase}" does not exist`
        ) {
            // Create the database if it doesn't exist
            const createQuery = `CREATE DATABASE ${config.postgresqlDatabase};`;
            await sequelizeWithoutDB.query(createQuery);
            console.log(
                `Database '${config.postgresqlDatabase}' created successfully.`
            );
            sequelizeWithoutDB.close();
        } else {
            console.error("Error occurred while creating the database:", error);
        }
    }
};
