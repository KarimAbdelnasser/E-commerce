import * as dotenv from "dotenv";
dotenv.config();

export const config = {
    jwt: process.env.JWT_SECRET || "defaultSecret",
    salt: process.env.SALT,
    mongodb: process.env.MONGODB_URL,
    port: process.env.PORT,
    mail: process.env.MAIL,
    mailPass: process.env.MAIL_PASS,
    postgresUrl: process.env.POSTGRESQL_URL,
    postgresqlHost: process.env.POSTGRESQL_HOST,
    postgresqlDatabase: process.env.POSTGRESQL_DATABASE,
    postgresqlUser: process.env.POSTGRESQL_USERNAME,
    postgresqlPass: process.env.POSTGRESQL_PASSWORD,
};
