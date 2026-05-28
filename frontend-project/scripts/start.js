const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const findFreePort = require("./find-port");

(async () => {
  const PORT = await findFreePort(3001);
  fs.writeFileSync(path.join(__dirname, "..", ".port"), String(PORT));

  const child = spawn("npx", ["react-scripts", "start"], {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, PORT: String(PORT) },
  });

  child.on("exit", (code) => process.exit(code));
})();
