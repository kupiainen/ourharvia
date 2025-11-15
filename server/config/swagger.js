// config/swagger.js

import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sauna API",
      version: "1.0.0",
      description: "API documentation for sauna sessions"
    },
  },
  apis: ["./routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app) => {
  // comment
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
