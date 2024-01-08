# Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

# app.py
import os
import random
import datetime
import logging
import grpc
from concurrent import futures
from flask import Flask, request, jsonify
from pymongo import MongoClient
from dotenv import load_dotenv
from accounts_pb2 import *
import accounts_pb2_grpc
from dotmap import DotMap

# Load environment variables
load_dotenv()
db_url = os.getenv("DB_URL")
if db_url is None:
    raise ValueError("DB_URL environment variable is not set")

protocol = os.getenv('SERVICE_PROTOCOL', 'http').lower()
if protocol not in ['http', 'grpc']:
    raise ValueError("SERVICE_PROTOCOL environment variable must be 'http' or 'grpc'")

# Database setup
client = MongoClient(db_url)
db = client["bank"]
collection = db["accounts"]

# Configure logging
logging.basicConfig(level=logging.DEBUG)

class AccountsService:
    """
    Service for handling account operations.
    """

    def __init__(self):
        self.collection = collection

    def get_account_details(self, account_number):
        """
        Retrieves account details given an account number.

        Args:
            account_number (str): The account number.

        Returns:
            dict: Account details if found, empty dict otherwise.
        """
        logging.debug("Get Account Details called")
        account = self.collection.find_one({"account_number": account_number})
        return account if account else {}

    def create_account(self, account_data):
        """
        Creates a new account with the provided data.

        Args:
            account_data (dict): Data for the new account.

        Returns:
            bool: True if account creation is successful, False otherwise.
        """
        logging.debug("Create Account called")
        # Check if the account already exists
        existing_count = self.collection.count_documents(
            {"email_id": account_data.email_id, "account_type": account_data.account_type}
        )
        if existing_count > 0:
            logging.debug("Account already exists")
            return False

        new_account = {
            "email_id": account_data.email_id,
            "account_type": account_data.account_type,
            "address": account_data.address,
            "govt_id_number": account_data.govt_id_number,
            "government_id_type": account_data.government_id_type,
            "name": account_data.name,
            "balance": 100,
            "currency": "USD",
            "account_number": f"IBAN{random.randint(1000000000000000, 9999999999999999)}",
            "created_at": datetime.datetime.now()
        }
        self.collection.insert_one(new_account)
        return True

    def get_accounts(self, email_id):
        """
        Retrieves all accounts for a given email ID.

        Args:
            email_id (str): Email ID to search for accounts.

        Returns:
            list: A list of accounts associated with the email ID.
        """
        accounts = self.collection.find({"email_id": email_id})
        return [acc for acc in accounts if acc is not None]


class AccountDetailsService(accounts_pb2_grpc.AccountDetailsServiceServicer):
    """
    gRPC service for account details.
    """

    def __init__(self):
        self.service = AccountsService()

    def get_account_details(self, request, context):
        account = self.service.get_account_details(request.account_number)
        if account:
            return AccountDetail(**account)
        return AccountDetail()

    def create_account(self, request, context):
        result = self.service.create_account(request)
        return CreateAccountResponse(result=result)

    def get_accounts(self, request, context):
        accounts = self.service.get_accounts(request.email_id)
        return GetAccountsResponse(accounts=[Account(**acc) for acc in accounts])


# Flask App Setup
app = Flask(__name__)
accounts_service = AccountsService()

@app.route("/account-detail", methods=["POST"])
def get_account_details():
    data = DotMap(request.json)
    account = accounts_service.get_account_details(data.account_number)
    return jsonify(account)

@app.route("/create-account", methods=["POST"])
def create_account():
    data = DotMap(request.json)
    result = accounts_service.create_account(data)
    return jsonify(result=result)

@app.route("/get-all-accounts", methods=["POST"])
def get_accounts():
    data = DotMap(request.json)
    accounts = accounts_service.get_accounts(data.email_id)
    return jsonify(accounts)


def run_server():
    port = 50051
    if protocol == "grpc":
        server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
        accounts_pb2_grpc.add_AccountDetailsServiceServicer_to_server(
            AccountDetailsService(), server
        )
        server.add_insecure_port(f"[::]:{port}")
        logging.debug(f"gRPC server starting on port {port}")
        server.start()
        server.wait_for_termination()
    else:
        logging.debug(f"Flask server starting on port {port}")
        app.run(host='0.0.0.0', port=port, debug=True)


if __name__ == "__main__":
    run_server()
