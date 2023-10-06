# MARTIAN BANK

<br />
 
MartianBank is a microservices demo application that simulates an app to allow customers to access and manage their bank accounts, perform financial transactions, locate ATMs, and apply for loans. It is built using [React](https://react.dev/),[ Node.js](https://nodejs.org/en/about), [Python](https://flask.palletsprojects.com/en/2.3.x/) and is packaged in [Docker](https://www.docker.com/) containers.  

<br />

# Highlights

- Micro Services Architecture  ​
- Helm based configurable deployments options​ (eg switching between HTTP and GRPC)​
- Docker, Kind and EKS based easy installations​
- Swagger APIs and comprehensive documentation​
- Performance tests and load generation capabilities​
- Integration with other opensource projects like APIClarity

<br />

# Table of Contents
- [Application Design](#application-design)
- [Getting Started](#installation)
  - [Installation on Docker Desktop Kubernetes](#1-installation-on-docker-desktop-kubernetes)
  - [Installation on Minikube Cluster](#2-installation-on-minikube-cluster)
  - [Installation on KIND Cluster](#3-installatioin-on-kind-cluster)
  - [Installation on AWS EKS Cluster](#4-installation-on-aws-eks-cluster)
  - [Running Locally](#5-local-installation)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)


<br />

#  Application Design

The Martian Bank UI is created using [React](https://react.dev/) and [react-redux toolkit](https://redux-toolkit.js.org/). There is an [NGINX](https://www.nginx.com/) container that acts as a reverse proxy for UI and backend services. There are 6 microservices, out of which 2 (customer-auth and atm-locator) are developed in Node.js whereas the others are done using Flask (Python). The dashboard microservice talks to accounts, transactions and loan microservices using [gRPC](https://grpc.io/) and [http](https://en.wikipedia.org/wiki/HTTP) (can be flipped and is available as a deployment parameter).

![Architecture Diagram](./images/Arch.png)

<br />

#  Installation
There are mulitple ways to install MartianBank.

<br />

##  1. Installation on Docker Desktop Kubernetes
This tutorial will guide you through the process of setting up and installing the MartianBank app using Helm on a Kubernetes cluster. Helm is a package manager for Kubernetes that simplifies the deployment of applications and services.

Before we begin, please ensure you have the following prerequisites installed:

1.  **Docker**: To run Kubernetes and containerized applications. You can download and install Docker from [here](https://www.docker.com/).
2.  **Kubernetes**: Enable Kubernetes within Docker Desktop. Follow the instructions provided in the official Docker documentation [here](https://docs.docker.com/desktop/kubernetes/).
3.  **kubectl**: The Kubernetes command-line tool to interact with the cluster. Install it using the guidelines found [here](https://kubernetes.io/docs/tasks/tools/).
4.  **Helm**: The package manager for Kubernetes. Helm allows you to define, install, and upgrade complex Kubernetes applications. Follow the installation instructions [here](https://helm.sh/docs/intro/install/).

Once you have the prerequisites installed, proceed with the following steps to set up MartianBank:

####  Step 1: Clone the MartianBank GitHub Repository
First, download the MartianBank GitHub repository using the following steps:

1.  Open your terminal or command prompt.

2.  Clone the repository by running the command:
```bash
git clone https://github.com/cisco-open/martian-bank-demo.git
```

3.  Change to the downloaded repository directory using the command:
```bash
cd martian-bank-demo
```

4.  Add the `configmap.yaml` config file to `martianbank/templates/` folder with the following content
```  yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: configmap-martianbank
data:
  DB_URL: # enter the DB url
  JWT_SECRET: # enter any string that you wish to use as a secret
```

When running Docker or pods, use `"mongodb://root:example@mongodb:27017"` for the local database.

**`NOTE:`** We recommend to change the mongoDB password to some value other than `example` in the above URL. To do this, you can edit `/martianbank/templates/configmap.yaml`.
 
####  Step 2: Install MartianBank using Helm
Now that you have the MartianBank repository downloaded, you can use Helm to install the app on your Kubernetes cluster.

1. To install MartianBank, use the Helm command:
```bash
helm install martianbank martianbank
```

By default loan, transaction and accounts microservices will run with http protocol. To switch to gRPC type the following command:
```bash
helm install martianbank martianbank --set SERVICE_PROTOCOL=grpc
```

Additionally, you can flip between mongoDB local and mongoDB Atlas (cloud database instance). To switch to local mongo, use the following flag:
```bash
helm install martianbank martianbank --set "mongodb.enabled=false"
```

By default, we use NGINX for reverse-proxy. If you want to deploy without NGINX, use this flag:
```bash
helm install martianbank martianbank --set "nginx.enabled=false"
```

2.  Wait for the installation to complete. Helm will deploy the necessary components to your Kubernetes cluster.

####  Step 3: Check Pod Status
After the installation is complete, you can verify the status of the pods running within your Kubernetes cluster.

To get a list of pods, run the following command:
```bash
kubectl get pods
```

####  Step 4: Get MartianBank App URL

To access the MartianBank app, you need to find the URL (IP address) of the running MartianBank service.
Run the following command to get the list of services:
```bash
kubectl get service
```

Look for the **EXTERNAL-IP** under the **_nginx_** microservice. This IP address is where the MartianBank app is accessible.

####  Step 5: Access MartianBank App
Now that you have the URL (IP address) of the MartianBank app, you can access it using a web browser.
1.  Copy the URL (IP address) from the **EXTERNAL-IP** field.
2.  Paste the URL in your browser's address bar, add the port (i.e. 8080) and press Enter to access the MartianBank app. For example, if the IP is `localhost`, simply put `localhost:8080` in the browser to access the MartianBank app. 

Congratulations! You have successfully installed and accessed the MartianBank app on your Kubernetes cluster using Helm. Now you can explore and use the app as needed. If you encounter any issues during installation, double-check the prerequisites and ensure that all steps were followed correctly. Happy banking with MartianBank!

####  Tutorial: Uninstalling the MartianBank App
In this section, you'll learn how to uninstall the MartianBank app from your Kubernetes cluster. We'll follow two simple steps to ensure a clean removal of the app.

**Step 1: Uninstall using Helm**
To remove the MartianBank app from the cluster, we'll use Helm to uninstall it.

1.  Open your terminal or command prompt.

2.  Run the following Helm command to uninstall the MartianBank release:
```bash
helm uninstall martianbank
```
This command will remove all the Kubernetes resources associated with the MartianBank release.


**Step 2: Delete Remaining Resources**
Although Helm has uninstalled the main components, there might still be some resources remaining in the cluster. To ensure a complete removal, we'll use kubectl to delete all resources in the default namespace.

1.  Run the following kubectl command:
```bash
kubectl delete all --all --namespace default
```

This command will delete all resources (pods, services, deployments, etc.) in the default namespace.

After performing the above two steps, the MartianBank app should be completely uninstalled from your Kubernetes cluster.


**Note:** If you have installed the MartianBank app in a namespace other than "default," make sure to change the `--namespace` flag in both the Helm and kubectl commands accordingly.

Now you have successfully uninstalled the MartianBank app from your Kubernetes cluster, and all associated resources have been removed. If you have any other Helm releases or resources running on the cluster, you can manage them similarly using Helm commands and kubectl operations.

<br />

##  2. Installation on Minikube Cluster

Let's go through the steps to install MartianBank using Minikube. Minikube allows you to run a single-node Kubernetes cluster on your local machine, making it ideal for testing and development purposes.

**Step 1: Install Minikube and Prerequisites**

If you haven't already installed Minikube and its prerequisites, follow the official Minikube installation guide based on your operating system: [Minikube Installation Guide](https://minikube.sigs.k8s.io/docs/start/)
  
**Step 2: Start Minikube Cluster**

1.  Open your terminal or command prompt.

2.  Start the Minikube cluster by running the following command:
```bash
minikube start
```

This command will create and start a local Kubernetes cluster using Minikube.

**Step 3: Install Helm**

Before installing MartianBank, you need to have Helm installed on your local machine.

-  Follow the official Helm installation guide based on your operating system: [Helm Installation Guide](https://helm.sh/docs/intro/install/)


**Step 4: Clone the MartianBank GitHub Repository**

1.  Open your terminal or command prompt.  

2.  Clone the MartianBank GitHub repository and navigate to the downloaded directory as mentioned in the previous tutorial.
```bash
git clone https://github.com/cisco-open/martian-bank-demo.git
cd martian-bank-demo
```

**Step 5: Install MartianBank using Helm**

Now that you have Minikube running and Helm installed, you can proceed with installing MartianBank on your Minikube cluster.

1.  To install MartianBank, use the Helm command:
```bash
helm install martianbank martianbank
```

Wait for the installation to complete. Helm will deploy the necessary components to your Minikube cluster.

**Step 6: Use Minikube Tunnel**

After installing MartianBank on your Minikube cluster, you may encounter that the command `kubectl get service` displays the services with an "external IP" in the "pending" state. This happens because Minikube does not natively support LoadBalancer type services with external IPs. However, you can use the `minikube tunnel` command to enable external access to LoadBalancer services.
  
To make the LoadBalancer type service accessible via an external IP in Minikube, you can use the `minikube tunnel` command. This command sets up a network route to expose the LoadBalancer's IP externally. Here's how to use it: Now, to make the LoadBalancer accessible from an external IP, run the following command in a **_new terminal_**:
```bash
minikube tunnel
```

The `minikube tunnel` command will create a network route to expose the LoadBalancer service to an external IP address. The external IP should no longer be in the "pending" state after running this command.

**Step 7: Access the MartianBank App**
  
After running `minikube tunnel`, the LoadBalancer's external IP should be available. You can get the IP by running:
```bash
kubectl get service
```
Look for the external IP in the output (for nginx pod). Copy the IP address and paste it into your browser's address bar. You should be able to access the MartianBank app.

**Step 8: Stop Minikube Tunnel**
Remember that the `minikube tunnel` command will continue running in your terminal until you stop it manually. When you're done testing the app, you can stop the tunnel by pressing `Ctrl + C` in the terminal where the `minikube tunnel` command is running.

That's it! Using `minikube tunnel`, you can expose LoadBalancer services in Minikube and access them via external IP addresses for testing and development.

  
**Step 9: Uninstall MartianBank**
If you want to uninstall MartianBank from your Minikube cluster, follow the same uninstallation steps mentioned in the previous tutorial:
```bash
helm uninstall martianbank
kubectl delete all --all --namespace default
```

That's it! You now have MartianBank installed and running on your Minikube cluster. Minikube provides an easy way to test and develop applications locally on a Kubernetes cluster. Happy testing with MartianBank on your Minikube setup!

<br />

##  3. Installation on Kind Cluster

**`Warning:`**  _Kind Cluster, by default, does not support the LoadBalancer type service with external IPs [[Load balancer external-ip pending · Issue #411 · kubernetes-sigs/kind (github.com)](https://github.com/kubernetes-sigs/kind/issues/411)]. This means that if you want to access services using an external IP in the Kind cluster, you will need to use an alternative approach. If you does not know how to resolove it, please follow the minikube or docker desktop kubernetes tutorials for installation setup._
  
Setting up MartianBank on a KIND (Kubernetes in Docker) cluster involves a few additional steps compared to a regular Kubernetes cluster. KIND allows you to create a lightweight Kubernetes cluster inside Docker containers, which is ideal for testing and development purposes. Here's how you can set up MartianBank on a KIND cluster:
  
**Step 1: Install KIND and Docker**
If you haven't already installed KIND and Docker, you need to do that first. Follow the official installation guides for [KIND](https://kind.sigs.k8s.io/docs/user/quick-start/#installation) and [Docker](https://docs.docker.com/get-docker/) based on your operating system.
  
**Step 2: Create a KIND Cluster**

1.  Open your terminal or command prompt.

2.  Create a KIND cluster by running the following command:
```bash
kind create cluster --name martianbank
```

This will create a new KIND cluster named "martianbank" with a single Kubernetes node.
  
**Step 3: Configure Kubectl**
  
The KIND cluster should now be running, but your `kubectl` is not automatically configured to communicate with the cluster. You need to set the context for your `kubectl` to use the KIND cluster.

1.  Run the following command to set the `kubectl` context to the new KIND cluster:
```bash
kubectl cluster-info --context kind-martianbank
```

**Step 4: Install MartianBank using Helm**

Now that your KIND cluster is set up and Helm is installed, you can proceed with installing MartianBank.

1.  Clone the MartianBank GitHub repository and navigate to the downloaded directory as mentioned in the previous tutorial.
  
2.  Install MartianBank using the Helm command:
```bash
helm install martianbank martianbank
``` 

**Step 5: Access MartianBank App**
After the installation is complete, you can access the MartianBank app just like before. Find the IP address of the running MartianBank service using `kubectl get service` and access it in your browser (previous tutorial).


**Step 6: Uninstall MartianBank**
If you want to uninstall MartianBank from the KIND cluster, follow the same uninstallation steps mentioned in the previous tutorial:
```bash
helm uninstall martianbank
kubectl delete all --all --namespace default
```

That's it! You now have MartianBank installed and running on your KIND cluster. Remember that KIND clusters are ephemeral and will be destroyed once you delete them. You can always create a new cluster with the same name or a different one using `kind create cluster` if needed. Happy testing with MartianBank on your KIND cluster.

<br />  

## 4.  Installation on AWS EKS cluster

**Step 1: Create an EKS cluster on AWS:**

1. Install AWS CLI tool and configure it (pass in access key, secret key, region, and it creates ~/.aws/config and ~/.aws/credentials files).
```shell
aws configure
```

2. Install eksctl tool
```shell
brew tap weaveworks/tap; brew install weaveworks/tap/eksctl
```

3. Install IAM authenticator
```shell
brew install aws-iam-authenticator
```

4. Create a cluster.yaml file anywhere on your system.
```yaml
apiVersion: eksctl.io/v1alpha5 
kind: ClusterConfig 
metadata: 
  name: <cluster-name> 
  region: us-east-1 
vpc: 
  cidr: "172.20.0.0/16" ## Can change this value 
  nat: 
   gateway: Single 
  clusterEndpoints: 
   publicAccess: true 
   privateAccess: true 
nodeGroups: 
  - name: ng-1 
    minSize: 2 
    maxSize: 2 
    instancesDistribution: 
      maxPrice: 0.093 
      instanceTypes: ["t3a.large", "t3.large"] 
      onDemandBaseCapacity: 0 
      onDemandPercentageAboveBaseCapacity: 50 
      spotInstancePools: 2 
    ssh: 
     publicKeyPath: <path> 
```

5.  Create an EKS cluster using this command (takes ~20 minutes)
```shell
eksctl create cluster -f cluster.yaml
```

**Step 2: Install MartianBank using Helm**

Now that your EKS cluster is set up, you can proceed with installing MartianBank.

1.  Go to your cloned repository and install MartianBank using the Helm command:
```shell
helm install martianbank martianbank
```

By default loan, transaction and accounts microservices will run with http protocol. To switch to gRPC type the following command:
```bash
helm install martianbank martianbank --set SERVICE_PROTOCOL=grpc
```

Additionally, you can flip between mongoDB local and mongoDB Atlas (cloud database instance). To switch to mongoDB Atlas, use the following flag:
```bash
helm install martianbank martianbank --set "mongodb.enabled=true"
```

By default, we use NGINX for reverse-proxy. If you want to deploy without NGINX, use this flag:
```bash
helm install martianbank martianbank --set "nginx.enabled=false"
```

2.  Verify that all pods are running using this command:
```shell
kubectl get pods
```

**Step 3: Access MartianBank App**

After the installation is complete, you can access the MartianBank app by finding the IP address of the running MartianBank service using `kubectl get service` and access it in your browser.


**Step 4: Uninstall MartianBank**

If you want to uninstall MartianBank from the EKS cluster, follow these uninstallation steps:
```shell
helm uninstall martianbank
kubectl delete all --all --namespace default
```
  
<br />

## 5. Local Installation

**Option 1: Running on localhost**

1. Clone the MartianBank GitHub repository and navigate to the downloaded directory.
```bash
git clone https://github.com/cisco-open/martian-bank-demo.git
cd martian-bank-demo
```

2. Install mongodb locally and run it. Follow the steps here: https://www.mongodb.com/docs/manual/installation/

3. Before you start with the MartianBank installation, ensure that you have `.env` files setup inside all the microservices. You need to create a `.env` file under these folders: `./customer-auth`, `./atm-locator`, `./dashboard`, `./accounts`, `./loan`, `./transactions`. Each `.env` file should look like this:
```yaml
DB_URL="your-database-connection-url"
```

4. To run all the microservices and UI:  
```bash
cd scripts
bash run_local.sh
```

Fire up `http://localhost:3000` to access the Martian Bank App.

5. To stop all the microservices:
```bash
cd scripts
bash stop_local.sh
```

<br />

# Roadmap

- Images for background, coin, card, and map.
- Swagger docs for remaining endpoints
- Blog posts and videos to support contributors
- End-to-end and unit tests
- Injecting secrets securely
- https and certificates support

<br />

#  Contributing
Pull requests and bug reports are welcome. For larger changes please create an Issue in GitHub first to discuss your proposed changes and possible implications.

More more details please see the [Contribution guidelines for this project](CONTRIBUTING.md)

<br />

#  License

[BSD 3-Clause License](https://opensource.org/license/bsd-3-clause/)

