import db from "@/lib/db";

export async function GET() {
  const queueRecords = db.prepare(`
    SELECT id, email, total_prep_time, order_time, position
    FROM queue
    ORDER BY position ASC
  `).all();

  const nowMs = Date.now();
  let cumulativeTimeSec = 0;
  let firstOrderRemaining = 0;

  const queue = queueRecords.map((record, index) => {
    const totalPrepTimeSec = record.total_prep_time;
    let remainingTimeSec = null;
    if (index === 0) {
      const orderTimeMs = new Date(record.order_time).getTime();
      const elapsedSec = Math.floor((nowMs - orderTimeMs) / 1000);
      remainingTimeSec = Math.max(totalPrepTimeSec - elapsedSec, 0);
      firstOrderRemaining = remainingTimeSec;
    }
    
    // For orders after the first, waiting time is the remaining time of the first order plus
    // the full prep times of all orders in between.
    const waitingTimeSec = index === 0 ? 0 : firstOrderRemaining + cumulativeTimeSec;
    cumulativeTimeSec += totalPrepTimeSec;
    
    return {
      id: record.id,
      email: record.email,
      order_time: record.order_time,
      position: record.position,
      totalPrepTime: totalPrepTimeSec / 60, // in minutes
      waitingTime: waitingTimeSec / 60,     // in minutes
      remainingTime: index === 0 ? remainingTimeSec : null
    };
  });

  return new Response(JSON.stringify(queue), {
    headers: { "Content-Type": "application/json" },
  });
}
