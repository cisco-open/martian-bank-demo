# Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

FROM --platform=linux/amd64 python

RUN mkdir /service
COPY protobufs/ /service/protobufs/
COPY dashboard/ /service/dashboard/
WORKDIR /service/dashboard
RUN python -m pip install --upgrade pip
RUN python -m pip install -r requirements.txt


RUN python -m grpc_tools.protoc -I ../protobufs --python_out=. --grpc_python_out=. ../protobufs/accounts.proto
RUN python -m grpc_tools.protoc -I ../protobufs --python_out=. --grpc_python_out=. ../protobufs/loan.proto
RUN python -m grpc_tools.protoc -I ../protobufs --python_out=. --grpc_python_out=. ../protobufs/transaction.proto


EXPOSE 5000
ENV FLASK_APP=dashboard.py
ENTRYPOINT [ "flask", "run", "--host=0.0.0.0"]