# Istio on Minikube

Run your containerized workloads and microservices as part of a service-mesh 


## Prepare istio environment

### get istio version - 1.20.3 - release # 1.20

```shell
istioctl proxy-status
```

### install addons

```shell
for ADDON in kiali jaeger prometheus grafana 
do 
   ADDON_URL="https://raw.githubusercontent.com/istio/istio/release-1.20/samples/addons/$ADDON.yaml" 
   kubectl apply -f $ADDON_URL
done
```

### verify addons

```shell
kubectl port-forward svc/grafana 3000:3000 -n istio-system

# http://localhost:3000/dashboards

kubectl port-forward svc/kiali 20001:20001 -n istio-system

# http://localhost:20001

```

### install application

```shell
kubectl create namespace workshop
kubectl label namespace workshop istio-injection=enabled

helm install mesh-basic . -n workshop

helm uninstall mesh-basic -n workshop
```
