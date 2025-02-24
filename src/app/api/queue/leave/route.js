import db from "@/lib/db";

export async function DELETE(req) {
  try {
    const { userEmail } = await req.json();
    const userOrder = db.prepare(`SELECT * FROM queue WHERE email = ?`).get(userEmail);
    if (!userOrder) {
      return new Response(JSON.stringify({ error: "Order not found in queue" }), { status: 404 });
    }

    const nowMs = Date.now();
    const orderTimeMs = new Date(userOrder.order_time).getTime();
    const elapsedSec = Math.floor((nowMs - orderTimeMs) / 1000);
    const remainingTime = Math.max(userOrder.total_prep_time - elapsedSec, 0);

    if (remainingTime > 0) {
      return new Response(JSON.stringify({ error: "Order still has time remaining" }), { status: 400 });
    }

    db.prepare(`DELETE FROM queue WHERE email = ?`).run(userEmail);

    // Reassign positions sequentially
    const remainingOrders = db.prepare(`SELECT id FROM queue ORDER BY position ASC`).all();
    remainingOrders.forEach((order, index) => {
      db.prepare(`UPDATE queue SET position = ? WHERE id = ?`).run(index + 1, order.id);
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error leaving queue:", error);
    return new Response(JSON.stringify({ error: "Error leaving queue" }), { status: 500 });
  }
}
