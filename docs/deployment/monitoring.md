---
title: Monitoring
description: Send errors to your own error tracker, scrape Prometheus metrics, wire up health checks and export OpenTelemetry traces.
order: 8.5
edition: full
editionNote: "Metrics, health checks and tracing come from Bulwark's server (not Lite). Lite can only send browser errors to an error tracker, set in policy.json; see Error reporting in Lite below."
---

# Monitoring

<div class="bw-note bw-note-brand"><b>Next release.</b> Everything on this page ships with the release after {{BULWARK_VERSION}}. {{BULWARK_VERSION}} has only <code>/api/health</code> and <code>/api/ready</code>.</div>

Bulwark can hand four things to the tools you already run:

- [Error reporting](#error-reporting): errors from browsers and from the server, sent to a Sentry-protocol error tracker such as Bugsink, GlitchTip or Sentry.
- [Metrics](#metrics): a Prometheus endpoint with requests, sign-ins, calls to Stalwart and process figures.
- [Health checks](#health): a liveness and a readiness endpoint for Docker and Kubernetes.
- [Tracing](#tracing): OpenTelemetry spans over OTLP/HTTP.

All four are off on a fresh install, and a fresh install opens no new connection. Each one starts when you set its address or token. The admin console shows their state under **System > Monitoring**.

Most work in Bulwark happens in the browser, which talks to Stalwart directly. The server only handles page loads, sign-in and token refresh, settings sync, push previews, document editing, the plugin proxy and a few helpers. That's why error reporting covers browsers too, while metrics and traces only see the server's part.

## Error reporting

Set the address (DSN) your error tracker gives you for a project:

```sh
ERROR_REPORTING_DSN=https://<key>@errors.example.com/1
```

Or enter it under **System > Monitoring > Error reporting** in the admin console. A value saved there wins over the environment.

| Variable | What it does |
|---|---|
| `ERROR_REPORTING_DSN` | The DSN. Empty (the default) turns error reporting off. |
| `ERROR_REPORTING_DSN_FILE` | Path to a file holding the DSN, for Docker or Kubernetes secrets. |
| `ERROR_REPORTING_SAMPLE_RATE` | Share of errors sent to the tracker, `0` to `1`. Default `1`. Doesn't affect the counts on the admin page. |
| `ERROR_REPORTING_ENVIRONMENT` | The environment name in the tracker, for example `staging`. Default `production`. |

A DSN isn't a secret: browsers need it to send their reports, and Bulwark hands it to them with the rest of the page configuration.

What gets reported:

- **In the browser:** errors that reach an error boundary or the page's error screen, uncaught errors and unhandled promise rejections, and failed JMAP requests. A failed request is reported by its HTTP status, or by the method name and JMAP error type (`Email/set: overQuota`), never with the server's answer. Expected answers aren't reported: an expired token (401), Stalwart's concurrency limit (429), and `cannotCalculateChanges`, `anchorNotFound`, `stateMismatch` and `tooManyChanges`, after which the client simply syncs again. Errors whose stack lies entirely outside Bulwark's own code, such as those from browser extensions, are ignored.
- **On the server:** errors Next.js catches while rendering a page or running a route, and errors a route catches and logs at level `error`.

Each report carries the last 20 route changes and JMAP calls before it (the area of the app and the JMAP method names only), the release, the environment, and whether it came from a browser or the server.

Browsers send to the tracker directly, without cookies and without the page address as referrer. The server sends with a 5-second timeout and never makes a request wait for it. To keep a broken page from flooding the tracker, a browser sends each error once per browser session, at most 10 a minute and 30 per session. The server sends each error at most once an hour, and at most 60 a minute.

### What is removed

Mail content never leaves the browser in an error report, not even to your own tracker. Bulwark removes everything that could be content before anything is sent, and the server removes it again from what browsers report to it. From an error message it keeps only the first line, cut at 200 characters, and in it replaces:

- text in quotes of any kind (`"…"`, `'…'`, `` `…` ``, `“…”`, `„…“`, `‘…’`, `«…»`, `‹…›`)
- email addresses
- URLs, including `www.` addresses, query strings and all
- file names with a document, image, archive, mail, calendar, contact or key extension (`.pdf`, `.docx`, `.jpg`, `.zip`, `.eml`, `.ics`, `.vcf`, `.pem` and similar)
- `Bearer`, `Basic` and `Token` credentials, and JSON Web Tokens
- `key=value` pairs, such as cookies and query parameters
- random-looking strings of 24 characters or more that mix in digits or symbols (ids, hashes, keys)
- IPv4 addresses and phone-number-like digit runs
- whatever follows a status code and a dash, as in `Request failed: 400 - <server answer>`

The message `Failed to move "Merger plans" from ceo@example.com` arrives as `Failed to move "…" from [email]`.

Page addresses are reduced to the area of the app: `/de/mail/folder/Projects/M123` becomes `/mail/…`. Stack frames keep the file inside Bulwark's bundle (`/_next/static/chunks/...`), the line and the column, without the host, base path or query. Frames in browser extensions and other scripts show as `[other]`. Reports carry no user name, account or IP address.

### Readable stack traces

Bulwark's code is minified, so a stack trace points into one long line. The official images and release builds have source maps uploaded to the project's own tracker, which doesn't help yours. To get readable traces in your tracker, build your own image with `BULWARK_SOURCE_MAPS=1`, take the maps out of the build stage and upload them with `sentry-cli`:

```sh
docker buildx build --build-arg BULWARK_SOURCE_MAPS=1 --target sourcemaps --output type=local,dest=sourcemaps .
docker buildx build --build-arg BULWARK_SOURCE_MAPS=1 -t my-bulwark .
SENTRY_AUTH_TOKEN=<token> npx @sentry/cli --url https://errors.example.com/ \
  sourcemaps --org <org> --project <project> upload sourcemaps
```

The build gives every bundle file a debug ID, and every report names the debug IDs of the files in its stack, so the tracker finds the right map without release names. The image itself never contains a map: the build fails if one would end up in it. With Bugsink, use `--org bugsinkhasnoorgs`; Bugsink keeps maps per project, so upload to each project that receives events.

### Errors today

**System > Monitoring > Errors today** lists the errors of the current UTC day, most frequent first, with their name, top frame, runtime and version. Bulwark counts errors whenever error reporting, the metrics endpoint or the [error counts in the usage stats](/docs/features/telemetry) are on; otherwise it counts nothing. The counts are kept for 8 days, at most 200 different errors a day, in the telemetry data directory (or the shared store when you run [several instances](/docs/deployment/multi-instance), where every replica adds to the same counts).

### No third-party traffic

With [no third-party traffic](/docs/guides/organisation/third-party-traffic) on, the tracker still works: you set its address, so it is listed under **Still reachable** and the page's security policy lets browsers reach it.

### Error reporting in Lite

Bulwark Lite has no server, so there is no admin page and no daily counts. Browsers send straight to the tracker you set in `policy.json`:

```json
{
  "errorReporting": {
    "dsn": "https://<key>@errors.example.com/1",
    "sampleRate": 1,
    "environment": "production"
  }
}
```

The same scrubbing and limits apply. If your web server sends a Content-Security-Policy that limits `connect-src`, add the tracker's origin to it. The `_headers`, nginx and Caddy examples in a Lite zip built with `LITE_JMAP_SERVER_URL` allow only the JMAP server; in the Lite container, add the origin to `LITE_CSP_CONNECT_SRC`. A Lite build made with `LITE_NO_THIRD_PARTY_TRAFFIC=true` pins `connect-src` in every page, so error reports can't get out of it. See [Static hosting](/docs/deployment/static).

## Metrics

Set a token and Bulwark serves Prometheus metrics at `/api/metrics`:

```sh
METRICS_TOKEN=<a long random string>
```

| Variable | What it does |
|---|---|
| `METRICS_TOKEN` | Bearer token the scraper must send. Without one the endpoint answers 404, as if it didn't exist. |
| `METRICS_TOKEN_FILE` | Path to a file holding the token. `METRICS_TOKEN` wins when both are set. |

A request without `Authorization: Bearer <token>`, or with another token, gets 401. The token is read from the environment only; the admin console shows whether the endpoint is on but can't change it. Set it before starting Bulwark: request counting starts at startup.

Each replica serves its own numbers, so scrape every replica, not the load balancer:

```yaml
scrape_configs:
  - job_name: bulwark
    metrics_path: /api/metrics   # /webmail/api/metrics under a base path
    authorization:
      type: Bearer
      credentials_file: /etc/prometheus/bulwark-metrics-token
    static_configs:
      - targets: ["bulwark-1:3000", "bulwark-2:3000"]
```

On Kubernetes, use `kubernetes_sd_configs` with `role: pod` (or `endpoints`) and keep the pods of your Bulwark deployment, so every pod is a target.

### Metric list

| Metric | Type | Labels | What it counts |
|---|---|---|---|
| `bulwark_http_requests_total` | counter | `group`, `method`, `status` | Requests this replica served |
| `bulwark_http_request_duration_seconds` | histogram | `group`, `method` | Time to answer them |
| `bulwark_signins_total` | counter | `outcome` | Sign-ins this server handled |
| `bulwark_upstream_requests_total` | counter | `target`, `outcome` | Requests this server made to other services |
| `bulwark_upstream_request_duration_seconds` | histogram | `target` | Time those took |
| `bulwark_browser_errors_total` | counter | | Errors browsers reported to this replica |
| `bulwark_errors_today` | gauge | | Errors counted today (UTC) by the whole deployment, browsers and servers. The same on every replica: use `max`, not `sum`. |
| `bulwark_build_info` | gauge | `version`, `build` | Always 1 |
| `bulwark_uptime_seconds` | gauge | | Seconds since the process started |

The labels take fixed values only, never user names or hosts users typed:

- `group`: `api:<folder>` for each folder under `/api` (`api:auth`, `api:wopi`, ...), `api:other`, `page:<area>` for the app's areas (`page:mail`, `page:calendar`, `page:contacts`, `page:files`, `page:settings`, `page:admin`, `page:login`, ...), `page:home`, `page:other`, `static` (bundle files), `image`, `asset` and `other`
- `method`: `GET`, `HEAD`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS` or `other`
- `status`: `2xx`, `3xx`, `4xx`, `5xx`
- `outcome` of sign-ins: `success`, `failure`, `refresh_failure` (a token refresh was refused) and `rate_limited`
- `target`: `stalwart`, `wopi` (the document editor's discovery), `translate`, `plugin_proxy` and `oauth` (token exchange, refresh and revocation)
- `outcome` of upstream requests: `ok` for any answer below 500 (a 401 from Stalwart is an answer), `error` for a 5xx or no answer

The histograms use the buckets 5, 10, 25, 50, 100, 250 and 500 milliseconds and 1, 2.5, 5, 10 and 30 seconds.

Sign-ins count when they go through Bulwark's server: starting a session after a password sign-in, the TOTP and token exchanges, the OAuth code exchange (`success`, `failure`, `rate_limited`) and token refreshes (`refresh_failure` when refused). A password that Stalwart refuses in the browser never reaches Bulwark, so it isn't counted; neither is the browser's own JMAP traffic to Stalwart.

On top of these come the standard Node.js process metrics with the `bulwark_` prefix: CPU time, `bulwark_process_resident_memory_bytes`, heap sizes, `bulwark_nodejs_eventloop_lag_seconds` and its percentiles, active handles, garbage collection and `bulwark_nodejs_version_info`. On Linux there are also open file descriptors and virtual memory.

## Health

| Endpoint | Answers | Use it for |
|---|---|---|
| `/api/health/live` | 200 while the process answers, nothing else checked | Liveness probes and the Docker health check |
| `/api/health/ready` | 200 when this replica can serve, 503 otherwise | Readiness probes |

`/api/health/ready` checks that the configuration is loaded, that the [shared store](/docs/deployment/multi-instance) answers when you use one, that the data directories are writable, and that Stalwart's `/.well-known/jmap` answers within 2 seconds (any status below 500 counts). The result is reused for 5 seconds, so probes can't flood Stalwart. The answer names the checks, never a host or path:

```json
{ "ready": false, "checks": { "config": "ok", "store": "ok", "dataDirs": "ok", "stalwart": "fail" } }
```

A check that doesn't apply says `skipped`: the data directories when a shared store holds the data, Stalwart while no server is configured.

`/api/health` and `/api/ready` stay as they were.

The Docker image runs a health check against `/api/health/live` every 30 seconds, with the base path the image was built with. Liveness deliberately ignores Stalwart: an orchestrator that restarts Bulwark because the mail server is down helps nobody.

On Kubernetes:

```yaml
livenessProbe:
  httpGet:
    path: /api/health/live      # prefix the base path, e.g. /webmail/api/health/live
    port: 3000
  periodSeconds: 30
  failureThreshold: 3
readinessProbe:
  httpGet:
    path: /api/health/ready
    port: 3000
  periodSeconds: 10
  failureThreshold: 3
```

A Stalwart outage then takes the pods out of the Service without restarting them.

## Tracing

Bulwark exports OpenTelemetry traces over OTLP/HTTP when an OTLP endpoint is set in the standard variables:

```sh
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318
OTEL_SERVICE_NAME=bulwark-webmail
```

Without an endpoint, the OpenTelemetry SDK isn't even loaded. Bulwark reads the standard `OTEL_*` variables and invents none of its own:

| Variable | What it does |
|---|---|
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Base URL of the OTLP/HTTP receiver; traces go to `<endpoint>/v1/traces` |
| `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` | Full URL for traces, used as it is; wins over the one above |
| `OTEL_SDK_DISABLED=true` | Keeps tracing off whatever else is set |
| `OTEL_TRACES_EXPORTER` | Tracing stays off unless it is unset or includes `otlp` (`none` turns it off) |
| `OTEL_SERVICE_NAME` | Service name, default `bulwark-webmail` |
| `OTEL_RESOURCE_ATTRIBUTES` | Extra resource attributes, such as `deployment.environment=staging` |
| `OTEL_EXPORTER_OTLP_HEADERS`, `OTEL_EXPORTER_OTLP_TIMEOUT`, `OTEL_EXPORTER_OTLP_COMPRESSION`, `OTEL_EXPORTER_OTLP_CERTIFICATE` and their `_TRACES_` forms | Read by the exporter as the OpenTelemetry specification describes |
| `OTEL_TRACES_SAMPLER`, `OTEL_TRACES_SAMPLER_ARG`, `OTEL_BSP_*` | Sampling and batching, read by the SDK |

Only OTLP over HTTP with JSON bodies is built in, not gRPC or protobuf; OpenTelemetry Collector, Jaeger, Tempo and most other receivers accept it on port 4318. Restart Bulwark after changing these.

You get Next.js's own spans for each request, page render and route handler, and a client span for every call the server makes to Stalwart, the document editor, translation, the plugin proxy and the OAuth provider (`upstream stalwart`, `upstream wopi`, ...). Calls to Stalwart carry a W3C `traceparent` header, so a Stalwart that exports traces can attach its spans to the same trace.

Every span is cleaned before export:

- URLs keep only their scheme and host, in span names too. A Stalwart download URL ends in the attachment's file name, so the path goes.
- Request paths become the app area (`/mail/…`); route patterns such as `/api/admin/plugins/[id]` stay.
- Query strings, fragments, user agents, client addresses, request and response headers and `enduser.*` attributes are dropped.
- Email addresses and credentials in any other attribute are replaced.
- A failed upstream call records the error's type, not its message.

A quick setup with Jaeger:

```yaml
services:
  bulwark:
    image: ghcr.io/bulwarkmail/webmail:latest
    environment:
      OTEL_EXPORTER_OTLP_ENDPOINT: http://jaeger:4318
  jaeger:
    image: jaegertracing/jaeger:latest
    ports:
      - "16686:16686"   # the Jaeger UI
```

With no third-party traffic on, the OTLP endpoint is a host you set, so it is listed under **Still reachable** like the error tracker.

## Logs

`LOG_FORMAT=json` covers every line Bulwark itself writes, its startup messages included. Admin actions also go to the log as `audit: <action>` entries, besides the audit log the admin console shows. See [Logging](/docs/getting-started/configuration/environment-reference#logging).

## Next step

For the variables in one place, see the [Environment reference](/docs/getting-started/configuration/environment-reference#monitoring).
