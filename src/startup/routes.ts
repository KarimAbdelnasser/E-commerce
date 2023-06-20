import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { usersRouter } from "../routes/users";
import { productsRouter } from "../routes/products";
import { ordersRouter } from "../routes/orders";
import { morganMiddleware } from "../utilities/morganConfig";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../utilities/swagger";

export = (app: express.Application) => {
    app.use(express.json());
    app.use(morganMiddleware);
    app.use(bodyParser.json());
    app.use("/user", usersRouter);
    app.use("/product", productsRouter);
    app.use("/order", ordersRouter);
    // Add the Swagger UI route
    app.use(
        "/docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
            swaggerOptions: {
                security: [{ jwtAuth: [] }],
            },
        })
    );
    // Docs in JSON format
    app.use("/docs.json", (_req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
    app.use((req: Request, res: Response, next: NextFunction) => {
        res.redirect("/docs");
    });
};
