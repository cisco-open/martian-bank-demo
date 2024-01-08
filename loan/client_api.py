# Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

"""
This module implements a gRPC client for interacting with a Loan Service.
It creates a gRPC channel, uses the LoanServiceStub to send a LoanRequest,
and prints the response from the server.
"""

import grpc
from loan_pb2_grpc import LoanServiceStub
from loan_pb2 import LoanRequest

# Create a gRPC channel to connect to the server
channel = grpc.insecure_channel('localhost:50053')

# Create a stub (client) to communicate with the gRPC service
client = LoanServiceStub(channel)

# Creating a loan request
request = LoanRequest(account_number="3", amount=10.0)

# Processing the loan request through the client stub
response = client.ProcessLoanRequest(request)

# Print the response from the server
print(response)
