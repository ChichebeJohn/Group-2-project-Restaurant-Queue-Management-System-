import db from "@/lib/db";

export async function GET(req) {
    try {
        const categories = db.prepare("SELECT * FROM categories").all();
        const meals = db.prepare("SELECT * FROM meals").all();

        return new Response(JSON.stringify({ categories, meals }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to fetch menu" }), {
            status: 500,
        });
    }
}
