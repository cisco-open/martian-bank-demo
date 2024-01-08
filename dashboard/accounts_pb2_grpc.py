# Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
"""Client and server classes corresponding to protobuf-defined services."""
# grpc_service.py
"""Client and server classes corresponding to protobuf-defined services."""
import grpc
import accounts_pb2 
import accounts_pb2_grpc

class AccountDetailsServiceStub:
    """Stub for the AccountDetailsService."""

    def __init__(self, channel):
        """Initialize the AccountDetailsServiceStub.

        Args:
            channel (grpc.Channel): A gRPC channel.
        """
        self.get_account_details = channel.unary_unary(
            '/AccountDetailsService/getAccountDetails',
            request_serializer=accounts_pb2.GetAccountDetailRequest.SerializeToString,
            response_deserializer=accounts_pb2.AccountDetail.FromString,
        )
        self.create_account = channel.unary_unary(
            '/AccountDetailsService/createAccount',
            request_serializer=accounts_pb2.CreateAccountRequest.SerializeToString,
            response_deserializer=accounts_pb2.CreateAccountResponse.FromString,
        )
        self.get_accounts = channel.unary_unary(
            '/AccountDetailsService/getAccounts',
            request_serializer=accounts_pb2.GetAccountsRequest.SerializeToString,
            response_deserializer=accounts_pb2.GetAccountsResponse.FromString,
        )


class AccountDetailsServiceServicer(object):
    """Service for managing account details."""

    def get_account_details(self, request, context):
        """Retrieve account details based on the request.

        Args:
            request: The request for account details.
            context: The gRPC context.

        Raises:
            NotImplementedError: If the method is not implemented.
        """
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def create_account(self, request, context):
        """Create a new account.

        Args:
            request: The request to create an account.
            context: The gRPC context.

        Raises:
            NotImplementedError: If the method is not implemented.
        """
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def get_accounts(self, request, context):
        """Get a list of accounts.

        Args:
            request: The request to get accounts.
            context: The gRPC context.

        Raises:
            NotImplementedError: If the method is not implemented.
        """
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_account_details_service_servicer_to_server(servicer, server):
    """Register the servicer with the server.

    Args:
        servicer: The service implementation.
        server: The gRPC server.
    """
    rpc_method_handlers = {
        'getAccountDetails': grpc.unary_unary_rpc_method_handler(
            servicer.get_account_details,
            request_deserializer=accounts_pb2.GetAccountDetailRequest.FromString,
            response_serializer=accounts_pb2.AccountDetail.SerializeToString,
        ),
        'createAccount': grpc.unary_unary_rpc_method_handler(
            servicer.create_account,
            request_deserializer=accounts_pb2.CreateAccountRequest.FromString,
            response_serializer=accounts_pb2.CreateAccountResponse.SerializeToString,
        ),
        'getAccounts': grpc.unary_unary_rpc_method_handler(
            servicer.get_accounts,
            request_deserializer=accounts_pb2.GetAccountsRequest.FromString,
            response_serializer=accounts_pb2.GetAccountsResponse.SerializeToString,
        ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
        'AccountDetailsService', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))



 # This class is part of an EXPERIMENTAL API.
class AccountDetailsService(object):
    """message GetAccountDetailResponse {
    AccountDetail account = 1;
    }

    """

    @staticmethod
    def get_account_details(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/AccountDetailsService/getAccountDetails',
            accounts_pb2.GetAccountDetailRequest.SerializeToString,
            accounts_pb2.AccountDetail.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def create_account(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/AccountDetailsService/createAccount',
            accounts_pb2.CreateAccountRequest.SerializeToString,
            accounts_pb2.CreateAccountResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def get_accounts(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/AccountDetailsService/getAccounts',
            accounts_pb2.GetAccountsRequest.SerializeToString,
            accounts_pb2.GetAccountsResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)
