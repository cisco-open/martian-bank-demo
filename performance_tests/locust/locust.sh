# Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

#!/bin/bash

#######################################################################################
## Setup

rm -rf venv_locust
rm -rf __pycache__

python3 -m venv venv_locust
source venv_locust/bin/activate
pip install -r requirements.txt

#######################################################################################
## Running Locust

locust -f auth_locust.py --headless -u 1 -r 1 --run-time 10s 
sleep 2

locust -f atm_locust.py --headless -u 1 -r 1 --run-time 6s 
sleep 2

locust -f account_locust.py --headless -u 1 -r 1 --run-time 6s  
sleep 2

locust -f transaction_locust.py --headless -u 1 -r 1 --run-time 12s  
sleep 2

locust -f loan_locust.py --headless -u 1 -r 1 --run-time 7s 
sleep 5

#######################################################################################
## Cleanup

deactivate venv_locust
rm -rf venv_locust
rm -rf __pycache__

#######################################################################################
## End

echo "Done!"

