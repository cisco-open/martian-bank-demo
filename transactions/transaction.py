# Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

from concurrent import futures
import datetime
from bson.objectid import ObjectId
import os
import grpc
from flask import Flask, request, jsonify

from dotmap import DotMap

# Configure the logging settings
import logging

logging.basicConfig(
    level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s"
)
from transaction_pb2 import *
import transaction_pb2_grpc
from flask import Flask, request, jsonify

from google.protobuf.json_format import MessageToDict

from dotenv import load_dotenv
load_dotenv()

import logging

# set logging to debug
logging.basicConfig(level=logging.DEBUG)

from pymongo.mongo_client import MongoClient


# db_host = os.getenv("DATABASE_HOST", "localhost")

db_url = os.getenv("DB_URL")
if db_url is None:
    raise Exception("DB_URL environment variable is not set")                   

uri = db_url


# protocol = os.getenv('SERVICE_PROTOCOL')
protocol = os.getenv('SERVICE_PROTOCOL', 'http')
if protocol is None:
    raise Exception("SERVICE_PROTOCOL environment variable is not set")

protocol = protocol.lower()
logging.debug(f"microservice protocol: {protocol}")



client = MongoClient(uri)
db = client["bank"]
collection_accounts = db["accounts"]
collection_transactions = db["transactions"]


class TransactionGeneric:
    def SendMoney(self, request):
        sender_account = self.__getAccount(request.sender_account_number)
        receiver_account = self.__getAccount(request.receiver_account_number)
        return self.__transfer(
            sender_account, receiver_account, float(request.amount), request.reason
        )

    def GetTransactionByID(self, request):
        transaction_id = request.transaction_id
        logging.debug(f"Transaction ID: {transaction_id}")
        count = collection_transactions.count_documents(
            {"_id": ObjectId(transaction_id)}
        )

        if count == 0:
            return {}

        transaction = collection_transactions.find_one(
            {"_id": ObjectId(transaction_id)}
        )

        return {
            "account_number": transaction["receiver"],
            "amount": transaction["amount"],
            "reason": transaction["reason"],
            "time_stamp": f"{transaction['time_stamp']}",
            "type": "credit",
            "transaction_id": str(transaction["_id"]),
        }

    def GetTransactionsHistory(self, request):
        account_number = request.account_number
        # logging.debug(f"Account Number: {account_number}")

        # find based on account number only based on sender
        transactions_credit = collection_transactions.find({"sender": account_number})
        transactions_debit = collection_transactions.find({"receiver": account_number})

        transactions_list = []
        for t in transactions_credit:
            temp_t = {
                "account_number": t["receiver"],
                "amount": t["amount"],
                "reason": t["reason"],
                "time_stamp": f"{t['time_stamp']}",
                "type": "credit",
                "transaction_id": str(t["_id"]),
            }
            transactions_list.append(temp_t)

        for t in transactions_debit:
            temp_t = {
                "account_number": t["receiver"],
                "amount": t["amount"],
                "reason": t["reason"],
                "time_stamp": f"{t['time_stamp']}",
                "type": "credit",
                "transaction_id": str(t["_id"]),
            }
            transactions_list.append(temp_t)

        return transactions_list

    def Zelle(self, request):
        sender_email = request.sender_email
        receiver_email = request.receiver_email
        amount = float(request.amount)
        reason = request.reason
        sender_account = self.__getAccountwithEmail(sender_email)
        receiver_account = self.__getAccountwithEmail(receiver_email)

        return self.__transfer(sender_account, receiver_account, amount, reason)

    def __transfer(self, sender_account, receiver_account, amount, reason):
        # if sender_account is not None or receiver_account is not None:

        if sender_account is None:
            return {"approved": False, "message": "Sender Account Not Found."}

        if receiver_account is None:
            return {"approved": False, "message": "Receiver Account Not Found."}


        result = self.__doTransaction(
            sender_account, receiver_account, amount, reason=reason
        )
        logging.debug(f"---> sender: {sender_account}")
        logging.debug(f"--->receiver: {receiver_account}")
        return result

    def __doTransaction(self, sender, receiver, amount, reason=""):
        if sender["balance"] < amount:
            return {"approved": False, "message": "Insufficient Balance"}

        sender["balance"] -= amount
        receiver["balance"] += amount

        # update sender account
        collection_accounts.update_one(
            {"account_number": sender["account_number"]},
            {"$set": {"balance": sender["balance"]}},
        )

        # update receiver account
        collection_accounts.update_one(
            {"account_number": receiver["account_number"]},
            {"$set": {"balance": receiver["balance"]}},
        )

        # add transaction
        collection_transactions.insert_one(
            {
                "sender": sender["account_number"],
                "receiver": receiver["account_number"],
                "amount": amount,
                "reason": reason,
                "time_stamp": datetime.datetime.now(),
            }
        )

        return {"approved": True, "message": "Transaction is Successful."}

    def __getAccountwithEmail(self, email):
        logging.debug(f"Email: {email}")
        # log the document with the email
        logging.debug(
            f"Document with email: {collection_accounts.count_documents({'email_id': email, 'account_type': 'Checking'})}"
        )

        document = None

        if (
            collection_accounts.count_documents(
                {"email_id": email, "account_type": "Checking"}
            )
            == 1
        ):
            checking_account = collection_accounts.find(
                {"email_id": email, "account_type": "Checking"}
            )
            document = checking_account[0]
            logging.debug(f"Checking Account: {document}")
            return document
        else:
            if (
                collection_accounts.count_documents(
                    {"email_id": email, "account_type": "Savings"}
                )
                == 1
            ):
                saving_account = collection_accounts.find(
                    {"email_id": email, "account_type": "Savings"}
                )
                document = saving_account[0]
                logging.debug(f"Savings Account: {document}")
                return document
            # logging.debug(f"Savings Account: {document}")
        logging.debug("No Account Found")
        return document

    def __getAccount(self, account_num):
        r = None
        accounts = collection_accounts.find()
        # logging.debug(f"Accounts: {list(accounts)}")
        for acc in accounts:
            if acc["account_number"] == account_num:
                r = acc
                break
        # logging.debug(f"Account {r}")
        return r


class TransactionService(transaction_pb2_grpc.TransactionServiceServicer):
    def __init__(self):
        self.transaction = TransactionGeneric()

    def sendMoney(self, request, context):
        t = TransactionResponse()
        result = self.transaction.SendMoney(request)
        t.approved = result["approved"]
        t.message = result["message"]
        return t

    def Zelle(self, request, context):
        result = self.transaction.Zelle(request)
        t = TransactionResponse(approved=result["approved"], message=result["message"])
        return t

    def getTransactionByID(self, request, context):
        result = self.transaction.GetTransactionByID(request)
        if len(result) == 0:
            return Transaction()
        else:
            return Transaction(
                account_number=result["account_number"],
                amount=result["amount"],
                reason=result["reason"],
                time_stamp=result["time_stamp"],
                type="credit",
                transaction_id=result["transaction_id"],
            )

    def getTransactionsHistory(self, request, context):
        results = self.transaction.GetTransactionsHistory(request)
        transactions_list = []
        for t in results:
            temp_t = Transaction(
                account_number=t["account_number"],
                amount=t["amount"],
                reason=t["reason"],
                time_stamp=t["time_stamp"],
                type=t["type"],
                transaction_id=t["transaction_id"],
            )
            transactions_list.append(temp_t)

        return GetALLTransactionsResponse(transactions=transactions_list)






app = Flask(__name__)
transaction_generic = TransactionGeneric()

@app.route("/transfer", methods=["POST"])
def sendMoney():
    data = request.json
    data = DotMap(data)
    result = transaction_generic.SendMoney(data)
    return jsonify(result)

@app.route("/zelle", methods=["POST"])
def zelle():
    logging.debug(" Zelle API called")
    data = request.json
    data = DotMap(data)
    result = transaction_generic.Zelle(data)
    return jsonify(result)

@app.route("/transaction-with-id", methods=["POST"])
def getTransactionByID():
    logging.debug(" Get Transaction By ID API called")
    data = request.json
    data = DotMap(data)
    result = transaction_generic.GetTransactionByID(data)
    return jsonify(result)

@app.route("/transaction-history", methods=["POST"])
def getTransactionsHistory():
    data = request.json
    data = DotMap(data)
    result = transaction_generic.GetTransactionsHistory(data)
    return jsonify(result)



def serverFlask(port):
    logging.debug(f"Starting Flask server on port {port}")
    app.run(host='0.0.0.0' ,port=port, debug=True)


def serverGRPC(port):
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    transaction_pb2_grpc.add_TransactionServiceServicer_to_server(
        TransactionService(), server
    )
    server.add_insecure_port(f"[::]:{port}")
    logging.debug(f"Starting server. Listening on port {port}.")
    server.start()
    server.wait_for_termination()

if __name__ == "__main__":
    port  = 50052
    # serverGRPC(port)
    # serverFlask(port)

    if protocol == "grpc":
        serverGRPC(port)
    else:
        serverFlask(port)

