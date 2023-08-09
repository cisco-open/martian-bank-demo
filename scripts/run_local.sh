# Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

#!/bin/bash

### ONLY FOR MAC ###

#######################################################################################
## Setup

cd ..

# Check for Dependencies
if ! command -v node &>/dev/null; then
    echo "\n Node.js is not installed. Please install Node.js and npm."
    exit 1
fi

if ! command -v python3 &>/dev/null; then
    echo "\n Python 3 is not installed. Please install Python 3."
    exit 1
fi

#######################################################################################
## Running Javascript microservices

run_javascript_microservice() {
    local service_name="$1"
    local service_alias="$2"
    local current_dir="$(pwd)"
    
    echo "Running $service_name microservice..."
    
    # Opening a new Terminal window
    osascript -e "\
        tell application \"Terminal\" to do script \
        \"cd '$current_dir' && cd '$service_name' && \
        npm install && npm run $service_alias\""
    sleep 2
    
    echo "$service_name is running ..."
    echo
}

run_javascript_microservice "ui" "ui"
run_javascript_microservice "customer-auth" "auth"
run_javascript_microservice "atm-locator" "atm"

#######################################################################################
# Running Python microservices

conda config --set auto_activate_base false &>/dev/null
brew update &>/dev/null
brew upgrade python3 &>/dev/null

run_python_microservice() {
    local service_name="$1"
    local service_alias="$2"
    local current_dir="$(pwd)"
    
    echo "Running $service_name microservice ..."
    
    # Opening a new Terminal window
    osascript -e "\
        tell application \"Terminal\" to do script \
        \"cd '$current_dir' && cd '$service_name' && \
        rm -rf venv_bankapp && python3 -m venv venv_bankapp && \
        source venv_bankapp/bin/activate && \
        pip3 install -r requirements.txt && python3 '$service_alias.py'\""
    sleep 2
    
    echo "$service_name is running ..."
    echo
}


run_python_microservice "dashboard" "dashboard"
run_python_microservice "accounts" "accounts"
run_python_microservice "transactions" "transaction"
run_python_microservice "loan" "loan"

echo "Setup completed successfully!"

