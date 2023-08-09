/**
 * Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  atms: [],
  isLoading: false,
  error: null,
};

const atmSlice = createSlice({
  name: "atm",
  initialState,
  reducers: {
    setAtms: (state, action) => {
      state.atms = action.payload;
    },
  },
});

export const { setAtms } = atmSlice.actions;

export default atmSlice.reducer;
