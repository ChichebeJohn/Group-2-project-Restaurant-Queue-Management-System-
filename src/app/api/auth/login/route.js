import db from "@/lib/db";
import { compare } from "bcryptjs";

export async function POST(req) {
  const { email, password } = await req.json();
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

  const isMatch = await compare(password, user.password);
  if (!isMatch) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });

  return new Response(JSON.stringify({
    message: "Login successful",
    user: { firstName: user.firstName, lastName: user.lastName, email: user.email }
  }), { status: 200 });
}
