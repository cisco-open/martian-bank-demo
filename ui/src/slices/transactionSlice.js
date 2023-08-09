/**
 * Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  history: [],
  isLoading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    storeTransaction: (state, action) => {
      state.history = action.payload;
    },
  },
});

export const { storeTransaction } = transactionSlice.actions;

export default transactionSlice.reducer;
