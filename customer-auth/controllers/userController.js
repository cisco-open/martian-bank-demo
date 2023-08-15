/**
 * Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
// import { Worker } from 'worker_threads';
// import generateToken from "../utils/generateToken.js";

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Name, email and password are required");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      // generateToken(res, user._id);
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message || "Internal Server Error",
      stack: process.env.NODE_ENV === "production" ? null : error.stack,
    });
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // generateToken(res, user._id);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(400);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      status: false,
      message: error.message || "Internal Server Error",
      stack: process.env.NODE_ENV === "production" ? null : error.stack,
    });
  }

  // const worker = new Worker('./workers/authWorker.js');

  // worker.on('message', (result) => {
  //   if (result.valid) {
  //     generateToken(res, result.user._id);
  //     res.json({
  //       _id: result.user._id,
  //       name: result.user.name,
  //       email: result.user.email,
  //     });
  //   } else {
  //     res.status(401);
  //     throw new Error('Invalid email or password');
  //   }
  // });
  // worker.postMessage({ email, password });
});

// @desc    Logout user and clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  try {
    // const jwtCookie = req.headers.authorization;

    // if (jwtCookie === undefined) {
    //   res.status(400);
    //   throw new Error("No JWT cookie found");
    // }
    // else{
    //   res.status(200).json({ message: "Logged out successfully" });
    // }

    res.status(200).json({ message: "Logged out successfully" });

    // res.cookie("jwt", "", {
    //   httpOnly: true,
    //   expires: new Date(0),
    // });
    // res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message || "Internal Server Error",
      stack: process.env.NODE_ENV === "production" ? null : error.stack,
    });
  }
};

// @desc    Get user profile
// @route   POST api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({email: req.body.email});

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message || "Internal Server Error",
      stack: process.env.NODE_ENV === "production" ? null : error.stack,
      feedback: "",
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({email: req.body.email});

    if (user) {
      user.password = req.body.password || user.password;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      });
      
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message || "Internal Server Error",
      stack: process.env.NODE_ENV === "production" ? null : error.stack,
      feedback: "",
    });
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
