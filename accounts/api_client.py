# Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

import grpc
from accounts_pb2_grpc import *
from accounts_pb2 import *

channel = grpc.insecure_channel('localhost:50051')
client = AccountDetailsServiceStub(channel)

request = CreateAccountRequest(email_id="test", account_type="test", address="test",  govt_id_number="test", government_id_type="test",  name="test")
response = client.createAccount(request)
print(response)