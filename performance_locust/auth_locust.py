# Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

from locust import HttpUser, task, SequentialTaskSet, between
from api_urls import ApiUrls
from faker import Faker

fake = Faker()


class MyUser(HttpUser):
    host = ApiUrls["VITE_USERS_URL"]

    @task
    class MyUserTasks(SequentialTaskSet):
        wait_time = between(2, 3)

        def on_start(self):
            # Create fake user data
            self.user_data = {
                "name": fake.unique.name(),
                "email": fake.unique.email(),
                "password": fake.unique.password(),
            }

            # Register
            self.client.post("/", json=self.user_data)

        @task
        def login(self):
            # Login
            self.client.post(
                "/auth",
                json={
                    "email": self.user_data["email"],
                    "password": self.user_data["password"],
                },
            )

        @task
        def get_profile(self):
            # Get Profile
            self.client.get("/profile", json={"email": self.user_data["email"]})

        @task
        def update_profile(self):
            # Update Profile
            self.client.put(
                "/profile",
                json={
                    "email": self.user_data["email"],
                    "password": fake.unique.password(),
                },
            )

        @task
        def logout(self):
            # Logout
            self.client.post("/logout", json={"email": self.user_data["email"]})