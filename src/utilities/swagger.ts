import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "ECOMMERCE API Docs",
            description:
                "Welcome to our eCommerce API! Explore a wide range of products, from fashion to electronics, and create delightful shopping experiences for your users. Our user-friendly API documentation and comprehensive endpoints empower you to integrate seamlessly and deliver exceptional eCommerce solutions.",
            version: "1.0.0",
            contact: {
                name: "Karim Alaraby",
                email: "karimalaraby96@gmail.com",
            },
        },
        components: {
            securitySchemas: {
                jwtAuth: {
                    type: "apiKey",
                    in: "header",
                    bearerFormat: "JWT",
                    name: "Authorization",
                    description: "Bearer JWT token",
                },
            },
        },
        security: [
            {
                jwtAuth: [],
            },
        ],
    },
    apis: ["./src/routes/*.ts", "./src/models/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
