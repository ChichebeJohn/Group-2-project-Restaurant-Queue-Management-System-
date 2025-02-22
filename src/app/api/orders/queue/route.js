import db from "@/lib/db";

export async function GET() {
  const orders = db.prepare("SELECT * FROM orders ORDER BY orderTime ASC").all();

  let runningTime = 0;
  const queue = orders.map((order, index) => {
    const totalPrepTime = order.quantity * order.prepTime;
    const waitingTime = runningTime;
    runningTime += totalPrepTime;

    return {
      position: index + 1,
      email: order.email,
      meal: order.meal,
      quantity: order.quantity,
      totalPrepTime,
      waitingTime,
    };
  });

  return new Response(JSON.stringify(queue), { status: 200 });
}
