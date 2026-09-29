---
title: Kubernetes
description: Deploy Bulwark on Kubernetes with the community-maintained HelmForge chart.
order: 2
edition: full
---

# Kubernetes

Bulwark does not publish official Kubernetes manifests. The HelmForge community maintains a Helm chart that deploys the full edition using Bulwark's official container image.

> The chart is maintained by HelmForge, not by the Bulwark project. Report chart and Kubernetes deployment issues to [HelmForge](https://github.com/helmforgedev/charts/issues). Report application issues to [Bulwark](https://github.com/bulwarkmail/webmail/issues).

## Prerequisites

- Kubernetes 1.30 or later
- Helm
- A running Stalwart JMAP endpoint reachable by both the Bulwark pod and users' browsers
- A default StorageClass, unless you disable persistence or bind an existing claim

The chart deploys Bulwark only. It does not install or manage Stalwart.

## Install from the Helm repository

Add the HelmForge repository, then install Bulwark in a dedicated namespace:

```sh
helm repo add helmforge https://repo.helmforge.dev
helm repo update helmforge
helm upgrade --install bulwark-mail helmforge/bulwark-mail \
  --namespace mail \
  --create-namespace
```

The same chart is also published as an OCI artifact at `oci://ghcr.io/helmforgedev/helm/bulwark-mail`.

## Complete the setup wizard

Wizard mode is enabled by default. Forward the service locally:

```sh
kubectl -n mail port-forward service/bulwark-mail 3000:3000
```

Open `http://localhost:3000` and enter the public URL of your Stalwart JMAP server. A cluster-local URL normally does not work because users' browsers must also reach and trust the endpoint.

## Configure declaratively

For repeatable deployments, create a `values.yaml` file and switch to declarative mode:

```yaml
config:
  mode: declarative
  jmap:
    serverUrl: https://mail.example.com
```

Apply the configuration:

```sh
helm upgrade --install bulwark-mail helmforge/bulwark-mail \
  --namespace mail \
  --create-namespace \
  --values values.yaml
```

See the [HelmForge Bulwark chart documentation](https://helmforge.dev/docs/charts/bulwark-mail) for the complete values reference, secret keys, persistence, Ingress, Gateway API, NetworkPolicy, OAuth and External Secrets options.

## Updates

Refresh the repository index and upgrade the release:

```sh
helm repo update helmforge
helm upgrade bulwark-mail helmforge/bulwark-mail \
  --namespace mail \
  --values values.yaml
```

If you use wizard mode without a values file, omit `--values values.yaml`. Review the chart release notes and your saved values before each upgrade.
