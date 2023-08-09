# Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

FROM --platform=linux/amd64 node:14
WORKDIR /usr/src/app
COPY ./package*.json /usr/src/app
RUN npm install
COPY . ./
EXPOSE 8000
CMD ["npm", "start"]