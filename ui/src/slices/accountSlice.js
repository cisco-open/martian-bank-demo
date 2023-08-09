/**
 * Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  new_account: [],
  all_accounts: [],
  selected_account: [],
  current_account: [],
  isLoading: false,
  error: null,
};

const accountSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    createAccount: (state, action) => {
      state.new_account = action.payload;
    },
    getAccounts: (state, action) => {
      state.all_accounts = action.payload;
    },
    selectedAccount: (state, action) => {
      state.selected_account = action.payload;
    },
    deleteSelectedAccount: (state, action) => {
      state.selected_account = [];
    },
    currentAccount: (state, action) => {
      state.current_account = action.payload;
    },
    deleteCurrentAccount: (state, action) => {
      state.current_account = [];
    },
  },
});

export const {
  createAccount,
  getAccounts,
  selectedAccount,
  deleteSelectedAccount,
  currentAccount,
  deleteCurrentAccount,
} = accountSlice.actions;

export default accountSlice.reducer;
