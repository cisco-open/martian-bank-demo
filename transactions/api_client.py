# Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
# Use of this source code is governed by a BSD-style.
# license that can be found in the LICENSE file.
""" This module provides a gRPC client for sending transaction requests to a transaction service.
It demonstrates the creation of a gRPC channel, the instantiation of a service stub, and 
the execution of a method provided by the transaction service. Specifically, it sends a 
request to transfer funds between accounts using the SendMoney method of the TransactionService. 
The module is designed to interact with a gRPC server running on localhost at port 50052.
"""
import grpc 
from transaction_pb2_grpc import TransactionServiceStub
from transaction_pb2 import TransactionRequest, TransactionResponse

channel = grpc.insecure_channel('localhost:50052')
client = TransactionServiceStub(channel)
request =TransactionRequest(sender_account_number="3", receiver_account_number="2", amount=10.0)
response = client.SendMoney (request)
print(response)
