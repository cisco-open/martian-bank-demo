/**
 * Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import { parentPort } from "worker_threads";
import User from "../models/userModel.js";
import connectDB from "../config/db.js";

parentPort.on("message", async (message) => {
  const { email, password } = message;

  try {
    connectDB();
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      parentPort.postMessage({
        valid: true,
        user: {
          _id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      parentPort.postMessage({ valid: false });
    }
  } catch (error) {
    parentPort.postMessage({ valid: false, error: error.message });
  }
});
