const express = require("express");
const next = require("next");
const db = require("./src/lib/db"); // adjust path as needed

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Set up your periodic task here:
setInterval(() => {
  const nowMs = Date.now();
  const orders = db.prepare("SELECT id, total_prep_time, order_time FROM queue").all();
  orders.forEach((order) => {
    const elapsedSec = Math.floor((nowMs - new Date(order.order_time).getTime()) / 1000);
    const newRemainingTime = Math.max(order.total_prep_time - elapsedSec, 0);
    db.prepare(`UPDATE queue SET total_prep_time = ? WHERE id = ?`).run(newRemainingTime, order.id);
  });
}, 10000); // run every 10 seconds

app.prepare().then(() => {
  const server = express();
  server.all("*", (req, res) => {
    return handle(req, res);
  });
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
