# kubeless-hello-world-sample

## Main Dependencies and Requisites

- [TypeScript 3.8](https://www.typescriptlang.org/).
- [Node.js](https://nodejs.org/).
- [Kubeless](https://kubeless.io/docs)
- [Kubernetes](https://kubernetes.io/docs)
- [Kafka](https://kafka.apache.org/documentation/)


## Install dependencies on k8s cluster


### Deploy kafka:
Rodar o yaml abaixo para provisionar os PVs:
```yaml
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: zoo-pv
  labels:
    type: local
spec:
  volumeMode: Filesystem
  accessModes:
  - ReadWriteOnce
  capacity:
    storage: 5Gi
  hostPath:
    path: "/zoo"

---

apiVersion: v1
kind: PersistentVolume
metadata:
  name: kafka-pv
  labels:
    type: local
spec:
  volumeMode: Filesystem
  accessModes:
  - ReadWriteOnce
  capacity:
    storage: 5Gi
  hostPath:
    path: "/kafka"

```

Execute following bash to create zookeeper/kafka deployments
```bash
	export RELEASE=$(curl -s https://api.github.com/repos/kubeless/kafka-trigger/releases/latest | grep tag_name | cut -d '"' -f 4)
	kubectl create -f https://github.com/kubeless/kafka-trigger/releases/download/$RELEASE/kafka-zookeeper-$RELEASE.yaml
```

### Create kubeless CRDs
Execute following bash to create the CRDs:
```bash
export RELEASE=$(curl -s https://api.github.com/repos/kubeless/kubeless/releases/latest | grep tag_name | cut -d '"' -f 4)
kubectl create ns kubeless
kubectl create -f https://github.com/kubeless/kubeless/releases/download/$RELEASE/kubeless-$RELEASE.yaml
```


### Deploy function
Build the project, define the KUBELESS_FUNCTION_NAME and KUBELESS_TOPIC_NAME the function will listen to, deploy the funcion and create the function's trigger.
```bash
npm run build
export KUBELESS_FUNCTION_NAME=test
export KUBELESS_TOPIC_NAME=test-topic
export KUBELESS_RUNTIME=nodejs6
kubeless function deploy $KUBELESS_FUNCTION_NAME --runtime $KUBELESS_RUNTIME --dependencies package.json --handler index.start --from-file dist/index.js
kubeless trigger kafka create $KUBELESS_FUNCTION_NAME --function-selector created-by=kubeless,function=$KUBELESS_FUNCTION_NAME --trigger-topic $KUBELESS_TOPIC_NAME
```


## CI Config

In the CI you have to set the following environment variables:
```
KUBELESS_RUNTIME=nodejs6
KUBELESS_FUNCTION_NAME=test
KUBELESS_TOPIC_NAME=test-topic
```