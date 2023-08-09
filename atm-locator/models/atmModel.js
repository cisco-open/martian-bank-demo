/**
 * Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import mongoose from "mongoose";

const atmSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zip: {
        type: String,
        required: true,
      },
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    timings: {
      monFri: {
        type: String,
        required: true,
      },
      satSun: {
        type: String,
        required: true,
      },
      holidays: {
        type: String,
      },
    },
    atmHours: {
      type: String,
      required: true,
    },
    numberOfATMs: {
      type: Number,
      required: true,
    },
    isOpen: {
      type: Boolean,
      required: true,
    },
    interPlanetary: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ATM = mongoose.model("ATM", atmSchema);

export default ATM;
