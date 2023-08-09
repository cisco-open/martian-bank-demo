# Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

FROM --platform=linux/amd64 python

RUN mkdir /service
COPY protobufs/ /service/protobufs/
COPY transactions/ /service/transactions/
WORKDIR /service/transactions
RUN python -m pip install --upgrade pip
RUN python -m pip install -r requirements.txt

RUN python -m grpc_tools.protoc -I ../protobufs --python_out=. --grpc_python_out=. ../protobufs/transaction.proto

EXPOSE 50052

ENTRYPOINT ["python", "transaction.py"]