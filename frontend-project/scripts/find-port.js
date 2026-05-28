const net = require("net");

function findFreePort(start) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(start, "127.0.0.1");
    server.on("listening", () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") resolve(findFreePort(start + 1));
      else reject(err);
    });
  });
}

module.exports = findFreePort;
