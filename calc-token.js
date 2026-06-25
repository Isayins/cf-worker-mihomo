const { createHash } = require("node:crypto");

function md5md5(text) {
  const first = createHash("md5").update(text).digest("hex");
  return createHash("md5").update(first.slice(7, 27)).digest("hex");
}

const [host, uuid] = process.argv.slice(2);

if (!host || !uuid) {
  console.error("Usage: node calc-token.js <worker-host> <uuid>");
  process.exit(1);
}

console.log(md5md5(host + uuid));
