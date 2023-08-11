/**
 * Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import mongoose from "mongoose";
import ATM from "../models/atmModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const connectDB = async () => {
  try {
    console.log(
      ` --- Connecting to MongoDB for atm-locator microservice --- `.cyan
    );

    if (process.env.DATABASE_HOST) {
      console.log(
        `Connecting to local MongoDB at ${process.env.DATABASE_HOST} ...`
      );
      const conn = await mongoose.connect(
        `mongodb://${process.env.DATABASE_HOST}:27017/`
      );
    } else {
      console.log(
        `Connecting to MongoDB Atlas (Cloud) at ${process.env.DB_URL} ...`
      );
      const conn = await mongoose.connect(process.env.DB_URL);
    }

    console.log(` --- MongoDB Connected --- `.cyan);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }

  console.log(`Seeding database with data from atm_data.json ...`);

  const atmDataFile = join(
    dirname(fileURLToPath(import.meta.url)),
    "atm_data.json"
  );
  const rawData = fs.readFileSync(atmDataFile);
  const jsonData = JSON.parse(rawData);
  const processedData = jsonData.map((item) => ({
    ...item,
    _id: new mongoose.Types.ObjectId(item._id.$oid),
    createdAt: new Date(item.createdAt.$date),
    updatedAt: new Date(item.updatedAt.$date),
  }));
  try {
    try {
      await ATM.collection.drop();
    } catch (error) {
      console.log(`Error: ${error.message}`.red.bold);
    }
    await ATM.insertMany(processedData);
    console.log(`Database seeded with ${processedData.length} records.`);
  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
  }
};

export default connectDB;
