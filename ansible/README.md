# Installation

## Ansible

### Run with docker

Run using the container based executing environment:

```sh
docker run -i -t --rm --entrypoint /usr/bin/ansible-playbook \
		-v $PWD:/runner \
		-v ~/tmp/kube-rhpds:/home/runner/.kube/config \
		registry.redhat.io/ansible-automation-platform-22/ee-supported-rhel8:latest \
		./install.yaml
```