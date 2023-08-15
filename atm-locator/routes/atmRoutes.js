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

/**
 * @openapi
 * /api/atm/:
 *   post:
 *     summary: Get all ATMs
 *     description: Get a list of all ATMs according to the filters
 *     tags:
 *       - ATM
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isOpenNow:
 *                 type: boolean
 *               isInterPlanetary:
 *                 type: boolean
 *     responses:
 *       '200':
 *         description: ATM details successfully fetched
 *       '404':
 *         description: Invalid request
 */
router.post("/", getATMs);

router.post("/add", addATM);

/**
 * @openapi
 * /api/atm/{id}:
 *   get:
 *     summary: Get ATM by ID
 *     description: Get ATM details by ID
 *     tags:
 *        - ATM
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the ATM
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: ATM details successfully fetched
 *       '404':
 *         description: Invalid request
 */

router.get("/:id", getSpecificATM);

export default router;
