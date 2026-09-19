import { CodeBlock } from "@/components/code-block";

const INSTALL_COMMAND = `docker run -d -p 3000:3000 --name bulwark \\
  -v bulwark-config:/app/data/admin \\
  -v bulwark-state:/app/data/admin-state \\
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
