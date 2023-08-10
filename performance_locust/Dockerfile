# Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

FROM --platform=linux/amd64 python

RUN mkdir /service
COPY . /service/
WORKDIR /service/
RUN python -m pip install --upgrade pip
RUN python -m pip install -r requirements.txt

RUN chmod +x locust.sh

EXPOSE 8089 5557 5558
ENTRYPOINT [ "sleep", "infinity" ]