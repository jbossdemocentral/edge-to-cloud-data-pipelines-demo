## Prerequisites

This Camel Quarkus component integrates, MQTT and HTTP clients (such as IoT devices, handsets, 3rd party clients) with an AI/ML engine, to obtain detection results from images.

You'll need:

 - the REST AI/ML engine
 - an AMQ Broker (local or remote)
 - S3 storage provided by OpenShift Data Foundation


###Deploy the AI/ML engine:

	Follow instructions from this tutorial link:
	https://redhat-scholars.github.io/rhods-od-workshop/rhods-od-workshop/2-01-deploy-s2i.html#_openshift_console

	Validate the deployment with:

	```
	MY_IMAGE=./images/numberplate2.jpeg && \
	MY_ROUTE=https://YOUR_ROUTE_URL/ && \
	(echo -n '{"image": "'; base64 $MY_IMAGE; echo '"}') | curl -X POST -H "Content-Type: application/json" -d @- ${MY_ROUTE}/predictions
	```

###Deploy the broker

- Local broker
  Follow AMQ instructions to deploy a local instance.

- on OpenShift
  You can use the AMQ operator to deploy an instance.
  Or you can follow these instructions:

  1) Login with admin credentials and create a new project

  ```
  oc new-project demo
  ```

  1) using the CLI:

```
oc replace --force -f \
https://raw.githubusercontent.com/jboss-container-images/jboss-amq-7-broker-openshift-image/74-7.4.0.GA/templates/amq-broker-74-basic.yaml
```

	```
	oc new-app --template=amq-broker-74-basic \
	-p AMQ_PROTOCOL=openwire,amqp,stomp,mqtt,hornetq \
	-p AMQ_USER=admin \
	-p AMQ_PASSWORD=admin
	```

  3) [optional] Create a route by exposing the MQTT service

<br>


###S3 Storage

Pending

<br>

## Running the service

>**Note**: the stub needs to be up and running for a successful end-to-end execution. Refer to the stub's Readme doc for instructions to run it.

Run it locally executing the command below:

```
./mvnw clean compile quarkus:dev
```

## Test with cURL

### Binary mode

To send an image in binary via HTTP, use the following `curl` command:

```
MY_IMAGE=./images/small-dog.jpeg && \
MY_ROUTE=http://localhost:8080 && \
curl -H 'Content-Type:application/octet-stream' ${MY_ROUTE}/binary --data-binary @${MY_IMAGE}
```

### JSON mode

To send a JSON message containing the image encoded in base64 use the following `curl` command:

```
MY_IMAGE=./images/small-dog.jpeg && \
MY_ROUTE=http://localhost:8080 && \
(echo -n '{"image": "'; base64 $MY_IMAGE; echo '"}') | \
curl -X POST -H "Content-Type: application/json" -d @- ${MY_ROUTE}/test
```



## Deploying to Openshift


###Configure your integration with S3

Follow the same steps indicated in the Camel Workshop

Step 7:
 - https://github.com/RedHat-Middleware-Workshops/workshop-camel3/blob/main/docs/labs/stage5/walkthrough.adoc#deploy-in-openshift

Configure:
 - `src/main/resources/application.properties`

<br>

###Deploy

Ensure you create/switch-to the namespace where you want to deploy the stub.

Run the following command to trigger the deployment:
```
./mvnw clean package -DskipTests -Dquarkus.kubernetes.deploy=true
```

To test the stub once deployed, open a tunnel with the following command:
```
oc port-forward service/simple 8080
```

