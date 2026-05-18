import db from "@/lib/db";

export async function PUT(req) {
  try {
    const body = await req.json();

    const { id, category, actual_price, selling_price } = body;

    await db.execute(
      `
      UPDATE wp_products
      SET
        category = ?,
        actual_price = ?,
        selling_price = ?
      WHERE id = ?
      `,
      [category, actual_price, selling_price, id],
    );

    return Response.json({
      success: true,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}
