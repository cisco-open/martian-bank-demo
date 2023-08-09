/**
 * Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log(
      ` --- Connecting to MongoDB for customer-auth microservice --- `.cyan
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
        `Connecting to MongoDB Atlas for customer-auth at ${process.env.DB_URL}`
      );
      const conn = await mongoose.connect(process.env.DB_URL);
    }
    console.log(` --- MongoDB Connected --- `.cyan);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

export default connectDB;
