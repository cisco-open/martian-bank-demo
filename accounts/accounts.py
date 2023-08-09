# Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

from concurrent import futures
import random
import datetime
import os
import grpc
from accounts_pb2 import *
import accounts_pb2_grpc
import logging
from dotmap import DotMap
from pymongo.mongo_client import MongoClient
from flask import Flask, request, jsonify
# set logging to debug
logging.basicConfig(level=logging.DEBUG)

from dotenv import load_dotenv
load_dotenv()

# db_host = os.getenv("DATABASE_HOST", "localhost")
db_url = os.getenv("DB_URL")
if db_url is None:
    raise Exception("DB_URL environment variable is not set")


# protocol = os.getenv('SERVICE_PROTOCOL')
protocol = os.getenv('SERVICE_PROTOCOL', 'http')
if protocol is None:
    raise Exception("SERVICE_PROTOCOL environment variable is not set")

protocol = protocol.lower()
logging.debug(f"microservice protocol: {protocol}")


uri = db_url

client = MongoClient(uri)
db = client["bank"]
collection = db["accounts"]


class AccountsGeneric:
    def getAccountDetails(self, request):
        logging.debug("Get Account Details called")
        account = collection.find_one({"account_number": request.account_number})

      

        if account:
            return  {'account_number': account["account_number"],'name': account["name"], 'balance': account["balance"], 'currency': account["currency"]}
    

        return {}

    # Todo: check if the account already exist or not

    def createAccount(self, request):
        logging.debug("Create Account called")
        # find the account with email and account type if it already exist then return false
        count = collection.count_documents(
            {"email_id": request.email_id, "account_type": request.account_type}
        )

        logging.debug(f" count: {count}")

        if count > 0:
            logging.debug("Account already exist")
            return False  # CreateAccountResponse(result=False)

        account = {
            "email_id": request.email_id,
            "account_type": request.account_type,
            "address": request.address,
            "govt_id_number": request.govt_id_number,
            "government_id_type": request.government_id_type,
            # "account_holder_name": request.account_holder_name,
            "name": request.name,
            "balance": 100,
            "currency": "USD",
        }

        # assign a random 16 digit account number
        account[
            "account_number"
        ] = f"IBAN{random.randint(1000000000000000, 9999999999999999)}"
        # timestamp  the account creation
        account["created_at"] = datetime.datetime.now()
        # insert the account into the list of accounts
        collection.insert_one(account)
        return True  # CreateAccountResponse(result=True)

    def getAccounts(self, request):
        email_id = request.email_id
        accounts = collection.find({"email_id": email_id})
        account_list = []
        for account in accounts:
            # logging.debug(account["balance"])
            # account_list.append(
            #     Account(
            #         account_number=account["account_number"],
            #         email_id=account["email_id"],
            #         account_type=account["account_type"],
            #         address=account["address"],
            #         govt_id_number=account["govt_id_number"],
            #         government_id_type=account["government_id_type"],
            #         name=account["name"],
            #         balance=account["balance"],
            #         currency=account["currency"],
            #     )
            # )
            acc = {
                k: v
                for k, v in account.items()
                if k
                in [
                    "account_number",
                    "email_id",
                    "account_type",
                    "address",
                    "govt_id_number",
                    "government_id_type",
                    "name",
                    "balance",
                    "currency",
                ]
            }
            account_list.append(acc)

        return account_list


class AccountDetailsService(accounts_pb2_grpc.AccountDetailsServiceServicer):
    def __init__(self):
        self.accounts = AccountsGeneric()

    def getAccountDetails(self, request, context):

        logging.debug("Get Account Details called")

        account = self.accounts.getAccountDetails(request)

        if len(account) > 0:
            return AccountDetail(
               account_number=account["account_number"],
                name=account["name"],
                balance=account["balance"],
                currency=account["currency"],
            )
        return AccountDetail()

    def createAccount(self, request, context):
        # return self.accounts.createAccount(request)
        result = self.accounts.createAccount(request)
        return CreateAccountResponse(result=result)

    def getAccounts(self, request, context):
        # return self.accounts.getAccounts(request)
        accounts = self.accounts.getAccounts(request)
        account_list = []
        for account in accounts:
            account_list.append(
                Account(
                    account_number=account["account_number"],
                    email_id=account["email_id"],
                    account_type=account["account_type"],
                    address=account["address"],
                    govt_id_number=account["govt_id_number"],
                    government_id_type=account["government_id_type"],
                    name=account["name"],
                    balance=account["balance"],
                    currency=account["currency"],
                )
            )
        return GetAccountsResponse(accounts=account_list)


app = Flask(__name__)
accounts_generic = AccountsGeneric()
@app.route("/account-detail", methods=["POST"])
def getAccountDetails():
    data = request.json
    data = DotMap(data)
    # account_number = request.json["account_number"]
    account = accounts_generic.getAccountDetails(data)
    return jsonify(account)

@app.route("/create-account", methods=["POST"])
def createAccount():
    data = request.json
    data = DotMap(data)
    result = accounts_generic.createAccount(data)
    return jsonify(result)

@app.route("/get-all-accounts", methods=["POST"])
def getAccounts():
    data = request.json
    data = DotMap(data)
    accounts = accounts_generic.getAccounts(data)
    return jsonify(accounts)



def serverFlask(port):
    logging.debug(f"Starting Flask server on port {port}")
    app.run(host='0.0.0.0' ,port=port, debug=True)    


def serverGRPC(port):
    # recommendations_host = os.getenv("RECOMMENDATIONS_HOST", "localhost")
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    accounts_pb2_grpc.add_AccountDetailsServiceServicer_to_server(
        AccountDetailsService(), server
    )
    server.add_insecure_port(f"[::]:{port}")
    # server.add_insecure_port(f"{recommendations_host}:50051")
    # print server ip and port
    logging.debug(f"Server started at port {port}")
    # print IP
    server.start()
    server.wait_for_termination()




if __name__ == "__main__":
    port = 50051
    # serverGRPC(port)
    if protocol == "grpc":
        serverGRPC(port)
    else:
        serverFlask(port)
