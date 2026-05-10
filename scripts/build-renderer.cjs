const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outputDir = path.join(root, "dist_hotfix");
const indexFile = path.join(outputDir, "index.html");
const command = process.execPath;
const args = [
  path.join(root, "node_modules", "vite", "bin", "vite.js"),
  "build",
  "--base",
  "./",
  "--outDir",
  "dist_hotfix",
  "--emptyOutDir",
  "--minify",
  "false"
];

const child = spawn(command, args, {
  cwd: root,
  stdio: "inherit",
  shell: false
});

child.on("close", (code) => {
  const hasBundle = fs.existsSync(indexFile) && fs.existsSync(path.join(outputDir, "assets"));
  if (code === 0 || hasBundle) {
    process.exit(0);
  }
  process.exit(code || 1);
});

child.on("error", (error) => {
  console.error(error);
  process.exit(1);
});
