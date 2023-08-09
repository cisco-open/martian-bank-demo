# Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

import os 

VITE_ACCOUNTS_URL = os.getenv("VITE_ACCOUNTS_URL") or 'http://127.0.0.1:5000/account'
VITE_USERS_URL = os.getenv("VITE_USERS_URL") or 'http://localhost:8000/api/users'
VITE_ATM_URL = os.getenv("VITE_ATM_URL") or 'http://localhost:8001/api/atm'
VITE_TRANSFER_URL = os.getenv("VITE_TRANSFER_URL") or 'http://127.0.0.1:5000/transaction'
VITE_LOAN_URL = os.getenv("VITE_LOAN_URL") or 'http://127.0.0.1:5000/loan'

ApiUrls = {
    'VITE_ACCOUNTS_URL': VITE_ACCOUNTS_URL,
    'VITE_USERS_URL': VITE_USERS_URL,
    'VITE_ATM_URL': VITE_ATM_URL,
    'VITE_TRANSFER_URL': VITE_TRANSFER_URL,
    'VITE_LOAN_URL': VITE_LOAN_URL,
}
