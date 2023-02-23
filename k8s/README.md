1. Install AMQ Streams operator using the CLI

2. Patch the features gateway to enable KRaft support

   ```sh
   kubectl -n kafka set env deployment/strimzi-cluster-operator STRIMZI_FEATURE_GATES=+UseKRaft
   ```

3. Create the Kafka broker

   ```sh
   kubectl apply -f k8s/kraft-kafka.yaml
   ```

4. Get the certificate for the external route

   ```sh
   kubectl get kafkas/edge -o jsonpath='{.status.listeners[?(@.name=="tls")].certificates[0]}' >> edge-kafka-ca.pem
   ```

5. Set the bootstrap server endpoint

   ```sh
   export BOOTSTRAP_SERVER=edge-kafka-bootstrap.127.0.0.1.nip.io:443
   ```

6. Check the metadata using `kcat`

   ```sh
   kcat -b $BOOTSTRAP_SERVER \
   -X security.protocol=SSL \
   -X ssl.ca.location=edge-kafka-ca.pem \
   -L
   ```

   You should get an output similar to the following:

   ```
   Metadata for all topics (from broker -1: ssl://edge-kafka-bootstrap.127.0.0.1.nip.io:443/bootstrap):
    1 brokers:
     broker 0 at edge-kafka-0.127.0.0.1.nip.io:443 (controller)
    0 topics:
   ```

   

