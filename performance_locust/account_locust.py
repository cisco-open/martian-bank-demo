# Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

from locust import HttpUser, task, SequentialTaskSet, between
from api_urls import ApiUrls
import random
from faker import Faker

fake = Faker()


class MyUser(HttpUser):
    host = ApiUrls["VITE_ACCOUNTS_URL"]

    @task
    class MyUserTasks(SequentialTaskSet):
        wait_time = between(2, 3)

        def on_start(self):
            # Create fake account data
            self.user_data = {
                "name": fake.unique.name(),
                "email_id": fake.unique.email(),
                "account_type": random.choice(
                    ["Checking", "Savings", "Money Market", "Investment"]
                ),
                "government_id_type": random.choice(
                    ["Driver's License", "Passport", "SSN"]
                ),
                "govt_id_number": fake.unique.ssn(),
                "address": fake.unique.address(),
            }

            # Create a new account
            self.client.post(
                "/create",
                data=self.user_data,
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )

        @task
        def get_all_accounts(self):
            self.client.post(
                "/allaccounts",
                data={"email_id": self.user_data["email_id"]},
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )

        @task
        def get_particular_account(self):
            self.client.get(
                "/detail",
                data={"email": self.user_data["email_id"]},
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )
