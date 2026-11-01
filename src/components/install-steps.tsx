import Link from "next/link";
import { CodeBlock } from "@/components/code-block";

const GITHUB = "https://github.com/bulwarkmail/webmail";

/** The three Docker steps: run, open the setup link from the log, put a proxy in front. */
export function DockerSteps() {
  return (
    <ol className="bw-steps">
      <li>
        <span className="bw-steps-n">1</span>
        <div>
          Run the container.
          <CodeBlock
            prompt
            code="docker run -d --name bulwark -p 3000:3000 -v bulwark-data:/app/data ghcr.io/bulwarkmail/webmail:latest"
            label="Copy the command"
          />
        </div>
      </li>
      <li>
        <span className="bw-steps-n">2</span>
        <div>
          Run <code className="bw-icode">docker logs bulwark</code> and open the setup link it prints. The wizard checks
          your Stalwart server and sets the admin password.
        </div>
      </li>
      <li>
        <span className="bw-steps-n">3</span>
        <div>
          Put your{" "}
          <Link href="/docs/deployment/docker/reverse-proxy" className="bw-link">
            reverse proxy
          </Link>{" "}
          in front for HTTPS. The docs have examples for Caddy, nginx and Traefik.
        </div>
      </li>
    </ol>
  );
}

/** The three static-file steps for Bulwark Lite. */
export function LiteSteps() {
  return (
    <ol className="bw-steps">
      <li>
        <span className="bw-steps-n">1</span>
        <div>
          Download <code className="bw-icode">bulwark-lite-&lt;version&gt;.zip</code> from the{" "}
          <a href={`${GITHUB}/releases/latest`} target="_blank" rel="noopener noreferrer" className="bw-link">
            latest release
          </a>{" "}
          and unzip it.
        </div>
      </li>
      <li>
        <span className="bw-steps-n">2</span>
        <div>
          Set <code className="bw-icode">jmapServerUrl</code> in <code className="bw-icode">config.json</code> to your
          Stalwart server.
        </div>
      </li>
      <li>
        <span className="bw-steps-n">3</span>
        <div>
          Upload the folder and turn on the Permissive CORS policy in Stalwart&apos;s HTTP settings. The{" "}
          <Link href="/docs/deployment/static" className="bw-link">
            static hosting
          </Link>{" "}
          page has the steps, and how to let Stalwart serve Lite itself instead.
        </div>
      </li>
    </ol>
  );
}
