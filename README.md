# Edge-to-Core Data Pipelines for AI/ML Demo

The Edge to Core Data Pipelines for AI/ML solution pattern provides an architecture solution for scenarios in which edge devices generate image data, which must be collected,  processed, and stored at the edge before being utilized to train AI/ML  models at the core data center or cloud.

### Prerequisites

This Camel Quarkus component combines MQTT and HTTP clients (such as IoT devices, cellphones, and third-party clients) with an AI/ML engine to obtain image detection results.

You will require:

- An OpenShift Container Platform cluster running version 4.12 or above with Cluster Admin access.

  You can obtain one by ordering from [Red Hat Demo Platform](https://demo.redhat.com/catalog?search=4.12) or deploying the trial version available at [Try Red Hat OpenShift](https://www.redhat.com/en/technologies/cloud-computing/openshift/try-it)

- Docker is installed and running.
  The ansible playbook that configures the environment is run using Docker and Linux container images in this demonstration. You should use the most recent Docker version. See the [Docker Engine installation documentation](https://docs.docker.com/engine/installation/) for further information. 

## Install the demo

1. Clone [this](https://github.com/RedHat-Middleware-Workshops/camel-edge-rhte) GitHub repository:

    ```sh
    git clone https://github.com/hguerrero/edge-to-cloud-data-pipelines-demo.git
    ```

2. Change to the Ansible directory.

    ```sh
    cd edge-to-cloud-data-pipelines-demo/ansible
    ```

3. Login into your OpenShift cluster from the `oc` command line.

    ```sh
    KUBECONFIG=kube-demo
    oc login --username=adminuser --server=https://(...):6443 --insecure-skip-tls-verify=true
    ```

    Replace the `--server` url with your own cluster API endpoint.

4. Set the cluster admin variable.

    ```sh
    OCP_USERNAME=<your_username>
    ```

5. Run the playbook

    ```sh
    docker run -i -t --rm --entrypoint /usr/local/bin/ansible-playbook \
        -v $PWD:/runner \
        -v $PWD/kube-demo:/home/runner/.kube/config \
        quay.io/agnosticd/ee-multicloud:v0.0.11  \
        -e="ocp_username=${OCP_USERNAME}" \
        ./install.yaml
    ```

  
