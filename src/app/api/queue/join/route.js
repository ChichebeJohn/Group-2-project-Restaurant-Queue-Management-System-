import db from "@/lib/db";

export async function POST(req) {
  try {
    const { cart, userEmail, totalPrepTime } = await req.json();
    if (!userEmail) {
      return new Response(JSON.stringify({ error: "User email is required" }), { status: 400 });
    }

    // totalPrepTime is in seconds
    const lastPosition = db
      .prepare(`SELECT MAX(position) AS maxPos FROM queue`)
      .get()?.maxPos || 0;
    const newPosition = lastPosition + 1;

    db.prepare(`
      INSERT INTO queue (email, total_prep_time, position, order_time) 
      VALUES (?, ?, ?, datetime('now'))
    `).run(userEmail, totalPrepTime, newPosition);

    // Optionally, recalc the updated queue:
    const queueRecords = db.prepare(`
      SELECT id, email, total_prep_time, order_time, position
      FROM queue
      ORDER BY position ASC
    `).all();

    // Emit the update using Socket.io if it's been initialized.
    // In the App Router, we don't have access to res.socket.
    // Instead, if you've attached your Socket.io instance to a global variable, use that.
    if (globalThis.io) {
      globalThis.io.emit("queueUpdated", queueRecords);
    }

    return new Response(JSON.stringify({ message: "Order joined queue" }), { status: 200 });
  } catch (error) {
    console.error("Error joining queue:", error);
    return new Response(JSON.stringify({ error: "Error joining queue" }), { status: 500 });
  }
}

