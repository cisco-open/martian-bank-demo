# Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

FROM --platform=linux/amd64 python

RUN mkdir /service
COPY protobufs/ /service/protobufs/
COPY accounts/ /service/accounts/
WORKDIR /service/accounts
RUN python -m pip install --upgrade pip
RUN python -m pip install -r requirements.txt


RUN python -m grpc_tools.protoc -I ../protobufs --python_out=. --grpc_python_out=. ../protobufs/accounts.proto


EXPOSE 50051

ENTRYPOINT ["python", "accounts.py"]