import db from "@/lib/db";

export async function POST(req) {
  const { email, meal, quantity, prepTime } = await req.json();

  try {
    db.prepare("INSERT INTO orders (email, meal, quantity, prepTime) VALUES (?, ?, ?, ?)")
      .run(email, meal, quantity, prepTime);

    return new Response(JSON.stringify({ message: "Order placed successfully!" }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to place order" }), { status: 500 });
  }
}
