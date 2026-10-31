---
title: Run Bulwark at home
description: "Stalwart and Bulwark on a home server, NAS or ARM board: Compose, a reverse proxy, bind mounts, Lite on an existing web server, and packages other people maintain."
order: 4
---

# Run Bulwark at home

This page is for a home server, a NAS, a Proxmox VM or an ARM board that runs Stalwart for you, your family or a club. Stalwart is the mail server. Bulwark is the webmail next to it. The page shows the usual layout and what to change from the standard Compose file. It has no step-by-step guide per NAS or platform; the [packages other people maintain](#packages-other-people-maintain) come closest to that.

Check [Requirements and sizing](/docs/deployment/requirements) first for the Stalwart version, the architectures and the memory Bulwark used.

## The layout

One reverse proxy takes port 443 and sends each hostname to its container. Stalwart keeps its mail ports for itself.

```text
internet or LAN
      |
      | 80, 443
      v
  reverse proxy (Caddy)
      |-- mail.example.com     -> stalwart:8080   JMAP, Stalwart's web admin
      |-- webmail.example.com  -> bulwark:3000    Bulwark

      | 25, 465, 993
      v
  stalwart                                         SMTP and IMAP, its own TLS
```

Bulwark's port 3000 and Stalwart's HTTP port don't need to be published at all. The proxy reaches both over the Compose network.

## Start from the Compose file

The [Docker Compose](/docs/deployment/docker/compose) page has the file that runs Stalwart and Bulwark together. For the layout above, change three things in it:

- Remove `443:443` and `8080:8080` from the `stalwart` ports. Keep 25, 465 and 993.
- Remove `3000:3000` from the `bulwark` ports.
- Add a proxy service:

```yaml
  caddy:
    image: caddy:2
    ports:
      - "80:80"
      - "443:443"
      - "443:443/udp" # HTTP/3
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy-data:/data # certificates
    restart: unless-stopped

volumes:
  caddy-data:
```

And a `Caddyfile` next to it:

```caddy
mail.example.com {
	reverse_proxy stalwart:8080
}

webmail.example.com {
	reverse_proxy bulwark:3000
}
```

Set `JMAP_SERVER_URL` in the `bulwark` service to `https://mail.example.com`. Bulwark and Stalwart now have different origins, so turn on Stalwart's [CORS setting](/docs/getting-started/configuration/stalwart-setup#cors-configuration).

Things to know about this setup:

- Caddy gets a certificate for each name from Let's Encrypt. That needs both names in public DNS and ports 80 and 443 reachable from the internet. For names that only resolve on your LAN, use a DNS challenge (a Caddy build with your DNS provider's module) or `tls internal`, whose root certificate every device then has to trust.
- Stalwart still needs its own certificate for SMTP and IMAP. With port 443 taken by Caddy, its ACME TLS-ALPN challenge can't reach it; pick the DNS challenge in Stalwart's ACME settings instead.
- Port 8080 is the plain HTTP listener a default Stalwart install has. If yours listens somewhere else, change the first `reverse_proxy` line.
- Caddy passes event streams straight through, so push needs no extra setting. With nginx, see [Reverse proxy](/docs/deployment/docker/reverse-proxy#eventsource-support).
- Bulwark's sign-in checks now reach Stalwart through Caddy as well. Read [Client address](/docs/getting-started/configuration/stalwart-setup#client-address) before you turn on Stalwart's forwarded-header setting.
- Some home routers don't loop a connection to your own public address back into the LAN. If Bulwark's container can't reach `https://mail.example.com`, point the name at the machine Caddy runs on:

  ```yaml
    bulwark:
      extra_hosts:
        - "mail.example.com:192.168.1.10"
  ```

The full [Reverse proxy](/docs/deployment/docker/reverse-proxy) page has the same pieces for nginx and Traefik.

## Bind mounts and uid 1001

On a NAS you usually want Bulwark's data in a folder on a share, not in a Docker volume. Bulwark runs as uid 1001, so that folder has to be writable by uid 1001:

```bash
sudo mkdir -p /srv/bulwark/data
sudo chown -R 1001:1001 /srv/bulwark/data
```

```yaml
  bulwark:
    volumes:
      - /srv/bulwark/data:/app/data
```

Mount all of `/app/data`, not single folders inside it. The setup wizard writes the config there and Bulwark keeps the session secret it generates there, so a container recreated without it starts from scratch. [What survives an upgrade](/docs/deployment/updating#what-survives-an-upgrade) lists what each folder holds.

## Lite on the web server you already run

If your NAS or router already serves websites, [Bulwark Lite](/docs/getting-started/lite) needs nothing more. Lite is a folder of static files: unzip the release, set `jmapServerUrl` in `config.json`, and turn on CORS in Stalwart. [Static hosting](/docs/deployment/static) has the steps and server snippets. Stalwart 0.16.6 or later can also serve Lite itself, with no other web server; see [Install on Stalwart](/docs/deployment/stalwart-app).

Lite signs in with a password and a two-factor code. It has no admin console, no plugins and no web push; [Editions](/docs/getting-started/editions) lists the rest.

## ARM boards

The images are built for `linux/arm64` as well as `linux/amd64`, and Docker pulls the right one by itself. There is no 32-bit ARM image, so a Raspberry Pi needs a 64-bit operating system: `uname -m` has to print `aarch64`. The memory figures on [Requirements and sizing](/docs/deployment/requirements#memory-and-cpu) were measured on amd64; nothing was measured on an ARM board.

## What to expose to the internet

| Port | Service | Expose it when |
| --- | --- | --- |
| 25 | Stalwart, SMTP | you receive mail from other servers |
| 465 | Stalwart, SMTP submission | mail apps send from outside your network |
| 993 | Stalwart, IMAP | mail apps read from outside your network |
| 80, 443 | the reverse proxy | you use the webmail from outside, or Let's Encrypt has to reach Caddy |

Whether a home connection can take mail on port 25 at all depends on your provider; that is a question for Stalwart's docs, not Bulwark's.

Reading mail away from home needs more than Bulwark's address. The browser loads the mail straight from Stalwart's JMAP address, so both `webmail.example.com` and `mail.example.com` have to answer over HTTPS from wherever you are. If you'd rather keep them on the LAN, use a VPN such as WireGuard to get back into your network.

Push needs nothing coming in. Stalwart sends changes out to the push relay over HTTPS, so it needs outbound access to `notifications.relay.bulwarkmail.org`, or to your own relay at a public HTTPS name. A relay on a LAN address doesn't work. [What has to reach what](/docs/deployment/requirements#what-has-to-reach-what) has the whole list.

Bulwark's port 3000 and Stalwart's HTTP port stay inside the Compose network in this layout; nothing outside it needs them.

## Packages other people maintain

These packages are maintained outside the Bulwark project. Report problems with them to their maintainers, and **check which version each one installs before you use it**, because they don't always follow Bulwark's releases.

- **TrueNAS**: the community app [bulwark-webmail](https://github.com/truenas/apps/tree/master/ix-dev/community/bulwark-webmail) in TrueNAS's community train. Community-maintained; check which version it installs.
- **Kubernetes**: the HelmForge chart `helmforge/bulwark-mail`, described on [Kubernetes](/docs/deployment/kubernetes). Community-maintained; check which version it installs.
- **NixOS**: the [bulwark package](https://github.com/NixOS/nixpkgs/blob/master/pkgs/by-name/bu/bulwark/package.nix) and the `services.bulwark` module in nixpkgs. Community-maintained; check which version it installs.

## Next step

Start with the [Docker Compose](/docs/deployment/docker/compose) file, or read the [homelab page](/homelab) for what Bulwark adds on top of Stalwart at home.
