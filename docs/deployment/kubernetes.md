---
title: Kubernetes
description: Run Bulwark on Kubernetes with the project's manifests (one or many replicas) or the community HelmForge chart.
order: 6
edition: full
editionNote: "This page runs Bulwark (not Lite) on Kubernetes. Lite is static files and needs none of this; see Static hosting."
---

# Kubernetes

Two ways to run Bulwark on Kubernetes:

- **Bulwark's manifests** in [`deploy/kubernetes`](https://github.com/bulwarkmail/webmail/tree/main/deploy/kubernetes): three replicas behind a Service, sharing one Valkey store, no volume for Bulwark itself. Every change to them is tested on a kind cluster in Bulwark's CI. They need a Bulwark release newer than 1.19.1.
- **The HelmForge chart**, maintained by the community: one replica with a PersistentVolume, a setup wizard, and many options (Gateway API, NetworkPolicy, External Secrets). Report chart issues to [HelmForge](https://github.com/helmforgedev/charts/issues).

Both need a running Stalwart (or other JMAP) server that the pods and users' browsers can reach. Neither installs it.

## Bulwark's manifests

Prerequisites: Kubernetes 1.30 or later, `kubectl`, and a default StorageClass for Valkey's volume.

```sh
git clone --depth 1 https://github.com/bulwarkmail/webmail.git
cd webmail/deploy/kubernetes
cp base/secrets.env.example base/secrets.env
```

Fill in `base/secrets.env` (generate each value with `openssl rand -base64 32`):

```env
SESSION_SECRET=...
ADMIN_PASSWORD=...
VALKEY_PASSWORD=...
```

Set at least the JMAP server in `base/bulwark.env`, and pin the image to a release in `base/kustomization.yaml` (`newTag`), then apply:

```sh
kubectl apply -k .
kubectl -n bulwark rollout status deployment/bulwark
kubectl -n bulwark port-forward service/bulwark 3000:80
```

Open `http://localhost:3000`, or put the `bulwark` Service behind your ingress controller; `ingress.example.yaml` has an nginx example. Any load balancing works: the replicas share sessions, admin config and everything else through the store, so no sticky sessions are needed.

What you get:

| Object | What it does |
|---|---|
| Deployment `bulwark` | 3 replicas, no volumes, read-only root filesystem, non-root. Readiness on `/api/ready`, liveness on `/api/health`. Rolling updates one pod at a time |
| Service `bulwark` | Port 80 to the pods |
| PodDisruptionBudget `bulwark` | At most one replica down during node maintenance |
| StatefulSet and Service `valkey` | The shared store: Valkey 8 with persistence (AOF) and `maxmemory-policy noeviction` on a 1 GiB volume |
| ConfigMap `bulwark-env`, Secret `bulwark-secrets` | Generated from `base/bulwark.env` and `base/secrets.env` |

Change the namespace, image tag, replica count or resources in an overlay of your own next to `overlays/`, so updates of the base merge cleanly. To use a managed Redis or Valkey instead of the bundled one, remove `valkey.yaml` from `base/kustomization.yaml` and point `REDIS_URL` at it.

### Configuration in git

`overlays/config-in-git` keeps the admin config and the user policy in the repository instead of the admin console: put your `config.json` and `policy.json` next to its `kustomization.yaml` and apply that overlay instead:

```sh
kubectl apply -k overlays/config-in-git
```

Every replica reads both files from a ConfigMap and picks up a change within a few seconds of the ConfigMap updating. The admin console shows the settings but refuses to save them. Sessions, synced settings and the audit log still live in the store. To start from what you have, use **Export policy.json** on the admin console's **Domains and groups** page (see [the policy file](/docs/guides/organisation/domains-and-groups#the-policy-file)).

### Moving from one instance

A Bulwark that ran with a volume (the HelmForge chart, Docker) moves over without losing anything: start one replica with `REDIS_URL` set and the old volume mounted at `/app/data`, against the empty store. On its first start it copies the admin config, plugins, branding, synced settings, plugin credentials and the audit log into the store, and the log says what it imported. Then scale to three replicas without the volume. [Running several instances](/docs/deployment/multi-instance#moving-an-existing-install) has the details and the way back.

### Updates

Change `newTag` to the new release and apply again. The Deployment replaces one pod at a time and waits for each new one to be ready, so users stay signed in. While two versions run side by side a page may need a reload.

## The HelmForge chart

```sh
helm repo add helmforge https://repo.helmforge.dev
helm repo update helmforge
helm upgrade --install bulwark-mail helmforge/bulwark-mail \
  --namespace mail \
  --create-namespace \
  --set image.tag=1.19.1-always
```

Set `image.tag` yourself. The chart's default tag lags behind Bulwark's releases: chart 1.2.0 installs `1.15.0-always`. Use the current release with the `-always` suffix the chart's default carries, for example `1.19.1-always`. The `-always` images are the same release built so that every URL carries its language prefix (`/en/...`); the plain tags leave it out for the default language. Stalwart 1.0 needs {{BULWARK_VERSION}} or newer.

The chart runs one replica; it refuses more. For several, use Bulwark's manifests above.

The same chart is also published as an OCI artifact at `oci://ghcr.io/helmforgedev/helm/bulwark-mail`.

### Complete the setup wizard

Wizard mode is enabled by default. Forward the service locally:

```sh
kubectl -n mail port-forward service/bulwark-mail 3000:3000
```

Get the setup token from the SETUP REQUIRED block in the pod log:

```sh
kubectl -n mail logs deploy/bulwark-mail
```

Open `http://localhost:3000`, paste the token, and enter the public URL of your Stalwart JMAP server. A cluster-local URL normally does not work because users' browsers must also reach and trust the endpoint.

### Configure declaratively

For repeatable deployments, create a `values.yaml` file and switch to declarative mode:

```yaml
image:
  tag: "1.19.1-always"
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

### Chart updates

Set `image.tag` in `values.yaml` to the new release, then refresh the repository index and upgrade:

```sh
helm repo update helmforge
helm upgrade bulwark-mail helmforge/bulwark-mail \
  --namespace mail \
  --values values.yaml
```

If you use wizard mode without a values file, replace `--values values.yaml` with `--set image.tag=<version>-always`; without it the upgrade falls back to the chart's default tag. Review the chart release notes and your saved values before each upgrade.

## Next step

Before people sign in, work through [Roll Bulwark out to an organisation](/docs/guides/organisation/rollout), which lists what to set in Stalwart and in Bulwark.
