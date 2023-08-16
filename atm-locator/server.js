/**
 * Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import path from "path";
import express from "express";
import dotenv from "dotenv";

import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import colors from "colors";

import { swaggerDocs } from './utils/swagger.js';

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import atmRoutes from "./routes/atmRoutes.js";

// Load environment variables from .env file
dotenv.config();

// connect to MongoDB Atlas database
import connectDB from "./config/db.js";
connectDB();

const port = process.env.PORT || 8001;
const app = express();

// mounting middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({credentials: true, origin: true}));
app.use(cookieParser());
app.use(morgan("dev"));

// mounting routes
app.use("/api/atm", atmRoutes);

// Swagger documentation
swaggerDocs(app, port);

// error handling middlewares
app.use(notFound);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`atm-locator server started on port ${port}`.green.bold)
);
