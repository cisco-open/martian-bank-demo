# Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

#######################################################################################

## Install packages to scan license (on mac OS)
npm i -g license-checker-rseidelsohn --silent
pip3 install prettytable --quiet
brew install jq --quiet

#######################################################################################
## Clear existing licenses.txt file (if any)
echo -n > ./licenses.txt
cd ..

#######################################################################################
## Generate license reports

# report for Python microservicesxs
python3 python_licenses.py >> ./licenses/licenses.txt

# report for javascript microservices
cd ui
license-checker-rseidelsohn --json --production --direct | jq -r 'to_entries | map([(.key | split("@"))[-2], (.key | split("@"))[-1], .value.licenses] | @tsv) | .[]' | column -t -s $'\t' >>../licenses/licenses.txt
cd ..

cd customer-auth
license-checker-rseidelsohn --json --production --direct  | jq -r 'to_entries | map([(.key | split("@"))[-2], (.key | split("@"))[-1], .value.licenses] | @tsv) | .[]' | column -t -s $'\t' >>../licenses/licenses.txt
cd ..

cd atm-locator
license-checker-rseidelsohn --json --production --direct  | jq -r 'to_entries | map([(.key | split("@"))[-2], (.key | split("@"))[-1], .value.licenses] | @tsv) | .[]' | column -t -s $'\t' >>../licenses/licenses.txt
cd ..

echo "License report generated successfully!"