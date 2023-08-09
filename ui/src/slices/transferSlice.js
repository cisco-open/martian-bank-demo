/**
 * Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  current_transfer: [],
  isLoading: false,
  error: null,
};

const transferSlice = createSlice({
  name: "transfer",
  initialState,
  reducers: {
    createTransfer: (state, action) => {
      state.current_transfer = action.payload;
    },
  },
});

export const { createTransfer } = transferSlice.actions;

export default transferSlice.reducer;
