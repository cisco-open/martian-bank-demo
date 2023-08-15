/**
 * Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import fs from "fs/promises";
import yaml from "js-yaml";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const getYamlContent = async () => {
  try {
    const swaggerSpecsFile = join(
      dirname(fileURLToPath(import.meta.url)),
      "swagger.yaml"
    );
    const yamlContent = await fs.readFile(swaggerSpecsFile, "utf8");
    return yamlContent;
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
};

const parsedData = yaml.load(await getYamlContent());

// Swagger options
const swaggerOptions = {
  definition: parsedData,
  apis: ["./routes/userRoutes.js"],
};

// Create Swagger specification object
const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const swaggerDocs = (app, port) => {
  // Swagger page
  app.use(
    "/docs",
    swaggerUI.serve,
    swaggerUI.setup(swaggerSpec, { explorer: true })
  );

  // Documentation in JSON format
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(
    `Swagger documentation available at :${port}/docs`
  );
};
