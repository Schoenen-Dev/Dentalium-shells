import db from "@/lib/db";

export async function GET() {
  try {
    const [products] = await db.execute(
      `
      SELECT *
      FROM wp_products
      ORDER BY id ASC
      `,
    );

    return Response.json(products);
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}
