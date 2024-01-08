# Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
"""Client and server classes corresponding to protobuf-defined services."""
"""
Client and server classes corresponding to protobuf-defined services for LoanService.
"""

"""
Client and server classes corresponding to protobuf-defined services for LoanService.
"""

import grpc
import loan_pb2 as loan__pb2

# Ensure that the protobuf module is correctly generated and available
if not hasattr(loan__pb2, 'LoanRequest'):
    raise ImportError("loan_pb2 module does not have LoanRequest")
if not hasattr(loan__pb2, 'LoanResponse'):
    raise ImportError("loan_pb2 module does not have LoanResponse")
if not hasattr(loan__pb2, 'LoansHistoryRequest'):
    raise ImportError("loan_pb2 module does not have LoansHistoryRequest")
if not hasattr(loan__pb2, 'LoansHistoryResponse'):
    raise ImportError("loan_pb2 module does not have LoansHistoryResponse")


class LoanServiceStub:
    """
    Stub class for the LoanService.
    Provides methods to interact with the LoanService via gRPC.
    """

    def __init__(self, channel):
        """
        Initialize the LoanServiceStub.

        Args:
            channel: A grpc.Channel.
        """
        self.process_loan_request = channel.unary_unary(
            '/LoanService/ProcessLoanRequest',
            request_serializer=loan__pb2.LoanRequest.SerializeToString,
            response_deserializer=loan__pb2.LoanResponse.FromString,
        )
        self.get_loan_history = channel.unary_unary(
            '/LoanService/getLoanHistory',
            request_serializer=loan__pb2.LoansHistoryRequest.SerializeToString,
            response_deserializer=loan__pb2.LoansHistoryResponse.FromString,
        )


class LoanServiceServicer:
    """
    Servicer class for the LoanService.
    Implements server-side methods for handling LoanService requests.
    """

    def process_loan_request(self, request, context):
        """
        Process a loan request. (To be implemented)

        Args:
            request: A LoanRequest object.
            context: gRPC context.
        """
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def get_loan_history(self, request, context):
        """
        Retrieve loan history. (To be implemented)

        Args:
            request: A LoansHistoryRequest object.
            context: gRPC context.
        """
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_loan_service_servicer_to_server(servicer, server):
    """
    Register the LoanServiceServicer to a gRPC server.

    Args:
        servicer: An instance of LoanServiceServicer.
        server: A gRPC server instance.
    """
    rpc_method_handlers = {
        'process_loan_request': grpc.unary_unary_rpc_method_handler(
            servicer.process_loan_request,
            request_deserializer=loan__pb2.LoanRequest.FromString,
            response_serializer=loan__pb2.LoanResponse.SerializeToString,
        ),
        'get_loan_history': grpc.unary_unary_rpc_method_handler(
            servicer.get_loan_history,
            request_deserializer=loan__pb2.LoansHistoryRequest.FromString,
            response_serializer=loan__pb2.LoansHistoryResponse.SerializeToString,
        ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
        'LoanService', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))



class LoanService:
    """
    LoanService class providing static methods for gRPC calls.
    """

    @staticmethod
    def process_loan_request(request, target, options=(), channel_credentials=None,
                           call_credentials=None, insecure=False, compression=None,
                           wait_for_ready=None, timeout=None, metadata=None):
        """
        Static method to process a loan request via gRPC.

        Args:
            request: A LoanRequest object.
            target: Target server address.
            options, channel_credentials, call_credentials, insecure, compression,
            wait_for_ready, timeout, metadata: gRPC call parameters.
        """
        return grpc.experimental.unary_unary(request, target, '/LoanService/ProcessLoanRequest',
                                             loan__pb2.LoanRequest.SerializeToString,
                                             loan__pb2.LoanResponse.FromString,
                                             options, channel_credentials,
                                             insecure, call_credentials, compression,
                                             wait_for_ready, timeout, metadata)

    @staticmethod
    def get_loan_history(request, target, options=(), channel_credentials=None,
                       call_credentials=None, insecure=False, compression=None,
                       wait_for_ready=None, timeout=None, metadata=None):
        """
        Static method to retrieve loan history via gRPC.

        Args:
            request: A LoansHistoryRequest object.
            target: Target server address.
            options, channel credentials, call credentials, insecure, compression,
            wait for ready, timeout, metadata: gRPC call parameters.
        """
        return grpc.experimental.unary_unary(request, target, '/LoanService/getLoanHistory',
                                             loan__pb2.LoansHistoryRequest.SerializeToString,
                                             loan__pb2.LoansHistoryResponse.FromString,
                                             options, channel_credentials,
                                             insecure, call_credentials, compression,
                                             wait_for_ready, timeout, metadata)
