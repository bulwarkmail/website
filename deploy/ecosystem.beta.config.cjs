// pm2 process for https://beta.bulwarkmail.org. Copied to
// /opt/bulwarkmail-website-beta/ecosystem.config.cjs by deploy/beta-deploy.sh.
module.exports = {
  apps: [
    {
      name: "bulwarkmail-website-beta",
      cwd: "/opt/bulwarkmail-website-beta/current",
      script: "/opt/bulwarkmail-website-beta/current/server.js",
      env: {
        NODE_ENV: "production",
        PORT: "3012",
        HOSTNAME: "127.0.0.1",
        NEXT_TELEMETRY_DISABLED: "1",
      },
      max_memory_restart: "512M",
    },
  ],
};
