/**
 * Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @openapi
 * /api/users/:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the provided name, email, and password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the registered user
 *                 name:
 *                   type: string
 *                   description: The name of the registered user
 *                 email:
 *                   type: string
 *                   description: The email of the registered user
 *         headers:
 *          Set-Cookie:
 *           description: Authentication cookie containing the access token
 *          schema:
 *          type: string
 *       '400':
 *         description: Invalid user data or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message describing the issue
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message or "Internal Server Error"
 *                 stack:
 *                   type: string
 *                   description: Stack trace (only in development mode)
 */

router.post("/", registerUser);

/**
 * @swagger
 * /api/users/auth:
 *   post:
 *     summary: Authenticate user and get token
 *     description: Authenticate a user with the provided email and password and retrieve an access token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the authenticated user
 *                 name:
 *                   type: string
 *                   description: The name of the authenticated user
 *                 email:
 *                   type: string
 *                   description: The email of the authenticated user
 *         headers:
 *           Set-Cookie:
 *             description: Authentication cookie containing the access token
 *             schema:
 *               type: string
 *       '400':
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message describing the issue
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message or "Internal Server Error"
 *                 stack:
 *                   type: string
 *                   description: Stack trace (only in development mode)
 */
router.post("/auth", authUser);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout user and clear authentication
 *     description: Logout the currently authenticated user and clear the JWT token from the request headers.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: JWT token in the format "\<token\>"
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating successful logout
 *       '400':
 *         description: No JWT token found in the request headers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the absence of a JWT token
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message or "Internal Server Error"
 *                 stack:
 *                   type: string
 *                   description: Stack trace (only in development mode)
 */
router.post("/logout", logoutUser);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     description: Get the profile of the currently authenticated user.
 *     tags:
 *       - User Profile
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the user
 *                 name:
 *                   type: string
 *                   description: The name of the user
 *                 email:
 *                   type: string
 *                   description: The email of the user
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The creation date of the user profile
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: The last update date of the user profile
 *       '401':
 *         description: User is not authenticated or the token is invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating authentication failure
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message or "Internal Server Error"
 *                 stack:
 *                   type: string
 *                   description: Stack trace (only in development mode)
 *   put:
 *     summary: Update user profile
 *     description: Update the profile of the currently authenticated user.
 *     tags:
 *       - User Profile
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the user
 *             required:
 *               - name
 *     responses:
 *       '200':
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the updated user profile
 *                 name:
 *                   type: string
 *                   description: The updated name of the user
 *                 email:
 *                   type: string
 *                   description: The email of the user
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The creation date of the user profile
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: The last update date of the user profile
 *       '400':
 *         description: Invalid request data or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message describing the issue
 *       '401':
 *         description: User is not authenticated or the token is invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating authentication failure
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message or "Internal Server Error"
 *                 stack:
 *                   type: string
 *                   description: Stack trace (only in development mode)
 */

router.route("/profile").get(getUserProfile).put(updateUserProfile);

// router
//   .route("/profile")
//   .get(protect, getUserProfile)
//   .put(protect, updateUserProfile);

export default router;
