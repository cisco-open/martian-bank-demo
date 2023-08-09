# Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

#######################################################################################
## OPTIONAL STEPS:

# clean all resources from previous deployments

helm uninstall martianbank -n bank-app
helm uninstall apiclarity -n apiclarity

kubectl delete all --all -n bank-app
kubectl delete all --all -n apiclarity

# delete namespaces

kubectl delete namespace bank-app
kubectl delete namespace apiclarity

#######################################################################################
## Steps to deploy martian-bank with apiclarity

# create namespaces

kubectl create namespace bank-app
kubectl label namespace bank-app istio-injection=enabled

# install martianbank (without NGINX)

helm install --set 'nginx.enabled=false' martianbank martianbank -n bank-app & sleep 20
kubectl get pods -n bank-app 
kubectl get services -n bank-app

# install API Clarity (note the namespace for envoyWasm)

helm install --set 'trafficSource.envoyWasm.enabled=true' --set 'trafficSource.envoyWasm.namespaces={bank-app}' --set 'supportExternalTraceSource.enabled=true' --create-namespace apiclarity apiclarity/apiclarity -n apiclarity & sleep 20
kubectl get pods -n apiclarity 
kubectl get services -n apiclarity

# make UI as load balancer
kubectl apply -f ./integrations/apiclarity/lb-apiclarity.yaml -n apiclarity

# after these steps, run this commmand to set the dashboard IP:
dashboard_external_ip=$(kubectl get services -n bank-app | grep dashboard | awk '{print $4}')
echo $dashboard_external_ip
helm upgrade martianbank martianbank -n bank-app --set 'nginx.enabled=false' --set "nginx.dashboardIP=$dashboard_external_ip" & sleep 40

# To generate load using locust
locust_pod=$(kubectl get pods -n bank-app | grep locust | awk '{print $1}')
echo $locust_pod
kubectl exec -it $locust_pod  -n bank-app -- /bin/bash -c "bash locust.sh"