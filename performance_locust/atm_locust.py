# Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

from locust import HttpUser, task, SequentialTaskSet, between
from api_urls import ApiUrls


class MyUser(HttpUser):
    host = ApiUrls["VITE_ATM_URL"]

    @task
    class MyUserTasks(SequentialTaskSet):
        wait_time = between(2, 3)

        @task
        def get_all_atms(self):
            response = self.client.post("/")
            self.atm_data = response.json()

        @task
        def get_atm_details(self):
            for atm in self.atm_data:
                self.client.get(f"/{atm['_id']}")
