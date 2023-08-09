/**
 * Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import { apiSlice } from "./usersApiSlice";
import ApiUrls from "./apiUrls";

const transferUrl = import.meta.env.VITE_TRANSFER_URL || ApiUrls.VITE_TRANSFER_URL;

export const transferApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    postTransfer: builder.mutation({
      query: (data) => ({ 
        url: `${transferUrl}`, 
        method: "POST", 
        body: data 
      }),
    }),
    postTransferExternal: builder.mutation({
      query: (data) => ({
        url: `${transferUrl}zelle/`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { usePostTransferMutation, usePostTransferExternalMutation } = transferApiSlice;
