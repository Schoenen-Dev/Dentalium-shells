import db from "@/lib/db";

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");

    await db.execute(
      `
      DELETE FROM wp_products
      WHERE id = ?
      `,
      [id],
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
