// pm2 process for https://bulwarkmail.org. Copied to
// /opt/bulwarkmail-website-prod/ecosystem.config.cjs by
// deploy/production-deploy.sh. nginx proxies 127.0.0.1:3010.
module.exports = {
  apps: [
    {
      name: "bulwarkmail-website",
      cwd: "/opt/bulwarkmail-website-prod/current",
      script: "/opt/bulwarkmail-website-prod/current/server.js",
      env: {
        NODE_ENV: "production",
        PORT: "3010",
        HOSTNAME: "127.0.0.1",
        NEXT_TELEMETRY_DISABLED: "1",
      },
      max_memory_restart: "512M",
    },
  ],
};
