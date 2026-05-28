const fs = require("fs");
const path = require("path");

const dirs = ["backend-project", "frontend-project"];

dirs.forEach((dir) => {
  const examplePath = path.join(__dirname, "..", dir, ".env.example");
  const envPath = path.join(__dirname, "..", dir, ".env");

  if (fs.existsSync(examplePath) && !fs.existsSync(envPath)) {
    fs.copyFileSync(examplePath, envPath);
    console.log(`Created ${dir}/.env from .env.example`);
  } else if (fs.existsSync(envPath)) {
    console.log(`${dir}/.env already exists, skipping`);
  }
});
