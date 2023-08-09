/**
 * Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // proxy: {
    //   '/auth': {
    //     target: 'http://host.docker.internal:8000',
    //     changeOrigin: true,
    //   },
    //   '/atm': {
    //     target: 'http://host.docker.internal:8001',
    //     changeOrigin: true,
    //   },
    // },
    proxy: {
      '/auth': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/atm': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
    },
    watch: {
      usePolling: true,
    },
    host: true,
  },
});
