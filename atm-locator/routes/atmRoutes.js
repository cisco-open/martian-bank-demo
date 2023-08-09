/**
 * Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import express from "express";
import {
  getATMs,
  addATM,
  getSpecificATM,
} from "../controllers/atmController.js";

const router = express.Router();

router.post("/", getATMs);
router.post("/add", addATM);
router.get("/:id", getSpecificATM);

export default router;
