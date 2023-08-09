/**
 * Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import asyncHandler from "express-async-handler";
import ATM from "../models/atmModel.js";

// @desc    Returns list of all ATMs
// @route   POST /api/atm
// @access  Public
const getATMs = asyncHandler(async (req, res) => {
  let query = {
    interPlanetary: false,
  };
  if (req.body.isOpenNow) {
    query.isOpen = true;
  }
  if (req.body.isInterPlanetary) {
    query.interPlanetary = true;
  }
  const ATMs = await ATM.find(query, {
    name: 1,
    coordinates: 1,
    address: 1,
    isOpen: 1,
  });
  const shuffledATMs = [...ATMs].sort(() => Math.random() - 0.5).slice(0, 4);
  if (shuffledATMs) {
    res.status(200).json(shuffledATMs);
  } else {
    res.status(404).json("No ATMs found");
    throw new Error("No results found");
  }
});

// @desc    Add new ATM
// @route   POST /atm/add
// @access  Private
const addATM = asyncHandler(async (req, res) => {
  const {
    name,
    street,
    city,
    state,
    zip,
    latitude,
    longitude,
    monFri,
    satSun,
    holidays,
    atmHours,
    numberOfATMs,
    isOpen,
    interPlanetary,
  } = req.body;
  const atm = new ATM({
    name,
    address: {
      street,
      city,
      state,
      zip,
    },
    coordinates: {
      latitude,
      longitude,
    },
    timings: {
      monFri,
      satSun,
      holidays,
    },
    atmHours,
    numberOfATMs,
    isOpen,
    interPlanetary,
  });

  const createdATM = await atm.save();
  if (createdATM) {
    res.status(201).json(createdATM);
  } else {
    res.status(404);
    throw new Error("Could not create ATM");
  }
});

// @desc    Add specific ATM data
// @route   GET /atm/:id
// @access  Public
const getSpecificATM = asyncHandler(async (req, res) => {
  const atm = await ATM.findById(req.params.id);
  if (atm) {
    res.status(200).json({
      coordinates: atm.coordinates,
      timings: atm.timings,
      atmHours: atm.atmHours,
      numberOfATMs: atm.numberOfATMs,
      isOpen: atm.isOpen,
    });
  } else {
    res.status(404).json({ message: "ATM information not found" });
    throw new Error("ATM not found");
  }
});

export { getATMs, addATM, getSpecificATM };
