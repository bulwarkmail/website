import { CodeBlock } from "@/components/code-block";

// The same command as docs/getting-started/installation.md: one volume for
// everything the app writes under /app/data.
const INSTALL_COMMAND = `docker run -d --name bulwark -p 3000:3000 \\
  -v bulwark-data:/app/data \\
  ghcr.io/bulwarkmail/webmail:latest`;

/** The docker command of the docs quick start. The copy button puts it on one line. */
export function InstallQuickstart() {
  return (
    <CodeBlock
      code={INSTALL_COMMAND}
      copyText={INSTALL_COMMAND.replace(/\\\n\s+/g, " ")}
      label="Copy the command"
    />
  );
}
