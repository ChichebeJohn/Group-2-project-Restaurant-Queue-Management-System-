import db from "@/lib/db";
import { hash } from "bcryptjs";

export async function POST(req) {
  const { firstName, lastName, email, password } = await req.json();
  
  const hashedPassword = await hash(password, 10);

  try {
    db.prepare("INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)")
      .run(firstName, lastName, email, hashedPassword);
    return new Response(JSON.stringify({ message: "User registered successfully" }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Email already exists" }), { status: 400 });
  }
}
