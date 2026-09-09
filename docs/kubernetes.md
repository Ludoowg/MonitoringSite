# Kubernetes & GitOps

This document continues the Docker and Jenkins implementation presented in the [main README](../README.md). It explains the initial manual Kubernetes deployment and its evolution into a GitOps workflow with ArgoCD and Argo Rollouts.

For pipeline details, see the [Jenkins CI/CD documentation](ci-cd.md).

## Initial manual Kubernetes deployment

### Cluster prerequisites

The project runs on a local Kubernetes cluster provided by Docker Desktop. `kubectl`, Helm, and Kustomize are installed on the host.

NGINX Gateway Fabric is installed with Helm after installing the Gateway API CRDs. Its controller provides the `nginx` GatewayClass, so the project only declares a Gateway and HTTPRoute rather than creating a second conflicting GatewayClass.

The following components are installed once at cluster level:

- metrics-server for resource metrics and HPA decisions;
- NGINX Gateway Fabric for incoming HTTP traffic;
- Sealed Secrets for encrypted secret management;
- ArgoCD for GitOps reconciliation;
- Argo Rollouts for progressive delivery.

### Manifest organization

The initial implementation used a `bootstrap` directory containing the namespace and database Secret. These resources were applied before the application because PostgreSQL and the backend depended on them.

The current manifests use a Kustomize structure:

- `k8s/base` contains resources shared by every environment;
- `k8s/overlays/dev` applies development replicas and resource settings;
- `k8s/overlays/prod` applies production resource settings, immutable image tags, and the backend HPA;
- `k8s/infra` contains the cluster-level metrics-server manifest.

Before adopting ArgoCD, the deployment order was bootstrap, cluster infrastructure, and finally the selected Kustomize overlay.

### Images and Jenkins integration

The base workloads reference the `latest` backend and frontend images. In production, Jenkins builds and pushes images tagged with the Git commit SHA, then uses Kustomize to update the corresponding tags in the production overlay.

The frontend image is built with `VITE_API_URL=/api`. This makes browser API calls use the same entry point as the frontend and allows Gateway API to route them to the backend.

### Networking and persistent data

Kubernetes Services expose components inside the cluster and give them stable DNS names. The Gateway is the HTTP entry point and its HTTPRoute sends:

- `/api` traffic to the active backend Service;
- `/` traffic to the active frontend Service.

NGINX Gateway Fabric creates the data-plane Service associated with the Gateway. On the local cluster, this Service can be exposed temporarily with:

```bash
kubectl port-forward -n monitoring-site service/nginx-gateway-nginx 8081:80
```

The application is then available at `http://localhost:8081`.

PostgreSQL runs in a StatefulSet and mounts a PersistentVolumeClaim. Recreating its pod does not delete database data as long as the PVC and its underlying volume are retained.

Readiness probes remove unavailable pods from Service endpoints until they can receive traffic. Liveness probes allow Kubernetes to restart containers that have become unhealthy or unresponsive.

### Environments and autoscaling

The development and production overlays apply different replica and resource settings. Resource requests are used by the scheduler and provide the baseline for CPU utilization calculations. Resource limits define the maximum resources a container may consume.

In production, the HPA targets the backend Rollout. It adjusts the desired replica count between 2 and 4 to keep average CPU utilization close to 80%.

## Migration to ArgoCD and GitOps

### ArgoCD's role

ArgoCD is installed in its own namespace, while its CLI runs on the local machine and communicates with the ArgoCD API server.

The `monitoring-site-prod` Application watches the repository's `k8s/overlays/prod` path and deploys it to the `monitoring-site` namespace. Git is the source of truth: ArgoCD compares the desired state stored in Git with the live cluster state and reconciles differences. Kubernetes remains responsible for scheduling and running workloads.

The complete delivery flow is:

```text
Code push
  → Jenkins tests, scans, and builds
  → versioned images pushed to Docker Hub
  → image tags updated and committed to Git
  → ArgoCD reconciliation
  → Argo Rollouts blue/green release
```

### Secret management

The PostgreSQL Secret cannot be committed to Git in plaintext. The local `kubeseal` CLI encrypts it with the Sealed Secrets controller's public key. Only the encrypted SealedSecret is committed.

ArgoCD applies the SealedSecret without knowing the plaintext values. The controller uses its private key inside the cluster to create the real Kubernetes Secret named `db-secrets`.

A sealed value is bound to its encryption scope, including its Secret name and namespace, and to the controller key used to encrypt it. It must therefore be regenerated for another namespace or for a cluster with a different key pair.

The controller's private key must be backed up if encrypted secrets need to remain usable after rebuilding the cluster. Losing that key means existing SealedSecrets cannot be decrypted by a newly installed controller.

### Namespace creation and sync order

The ArgoCD Application uses `CreateNamespace=true` to create `monitoring-site`; sync waves do not create namespaces.

Sync waves determine the order in which ArgoCD applies the resources generated by Kustomize:

- wave `-1`: SealedSecret;
- wave `1`: PostgreSQL PVC, Service, and StatefulSet;
- wave `2`: backend/frontend Rollouts and their active/preview Services;
- wave `3`: Gateway and HTTPRoute;
- wave `4`: backend HPA.

Kustomize still assembles the base and overlays. Sync waves replace the previous manual ordering of multiple `kubectl apply` operations.

### Automated reconciliation

The Application uses automated synchronization with:

- `prune`, which removes cluster resources that were removed from Git;
- `selfHeal`, which restores resources modified manually in the cluster;
- `ignoreDifferences` for `/spec/replicas` on the backend Rollout, allowing the HPA to control that value without ArgoCD restoring the static Git value.

The HPA does not create pods directly. It changes the desired replica count on the Rollout, and the Rollout controller creates or removes pods accordingly.

## Blue/green delivery with Argo Rollouts

ArgoCD applies Rollout resources, while the separately installed Argo Rollouts controller executes their release strategy.

The backend and frontend Deployments were replaced with Rollouts using a blue/green strategy. During an update, the stable version continues receiving user traffic while the new version starts in preview pods.

Each Rollout uses two Services:

- `*-service-active` receives user traffic and is referenced by the HTTPRoute;
- `*-service-preview` targets the candidate version before promotion.

Because `autoPromotionEnabled` is set to `false`, a candidate version is not promoted automatically. The preview can be inspected first, then promoted manually. The controller updates the active Service selector to send traffic to the new ReplicaSet.

For example, the frontend preview can be reached locally with:

```bash
kubectl port-forward -n monitoring-site service/frontend-service-preview 8082:80
```

Rollout status and promotion can be controlled with the Argo Rollouts kubectl plugin:

```bash
kubectl argo rollouts status frontend -n monitoring-site
kubectl argo rollouts promote frontend -n monitoring-site
```

Blue/green was selected because the local cluster can temporarily run the stable and preview versions in parallel. A canary strategy would instead expose a gradually increasing share of traffic to the candidate release, with additional routing and analysis configuration.

## Rollback approach

Git remains the source of truth for a durable rollback. A previous image tag can be restored in the production Kustomize overlay, or the image-update commit can be reverted. After that change is pushed, ArgoCD reconciles the cluster and Argo Rollouts deploys the restored version.

## Operational checks

Useful commands for inspecting the deployment include:

```bash
argocd app get monitoring-site-prod
kubectl get rollouts,pods,hpa -n monitoring-site
kubectl describe rollout backend -n monitoring-site
kubectl get gateway,httproute -n monitoring-site
kubectl top pods -n monitoring-site
```

## Current limitations

This is a local production-like DevOps lab rather than a public production SaaS. Future improvements include:

- deployment to a remote cluster;
- RBAC, dedicated ServiceAccounts, NetworkPolicies, and security contexts;
- PostgreSQL backups and a tested restore procedure;
- a dedicated Kubernetes Job for Prisma migrations;
- Prometheus, Grafana, centralized logs, and alerting;
- TLS and external DNS for public access.
