const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outputDir = path.join(root, "dist", "renderer");
const viteCli = path.join(root, "node_modules", "vite", "bin", "vite.js");

function cleanRendererOutput() {
  if (!fs.existsSync(outputDir)) return;

  if (process.platform === "win32") {
    const escapedPath = outputDir.replace(/'/g, "''");
    execFileSync(
      "powershell.exe",
      ["-NoProfile", "-Command", `Remove-Item -LiteralPath '${escapedPath}' -Recurse -Force`],
      { cwd: root, stdio: "inherit" }
    );
    return;
  }

  fs.rmSync(outputDir, { recursive: true, force: true });
}

cleanRendererOutput();

execFileSync(
  process.execPath,
  [viteCli, "build", "--base", "./", "--outDir", "dist/renderer", "--emptyOutDir", "--minify", "false"],
  { cwd: root, stdio: "inherit" }
);
