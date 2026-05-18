import { writeFile } from "fs/promises";
import path from "path";
import db from "@/lib/db";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get("name");
    const actual_price = formData.get("actual_price");
    const selling_price = formData.get("selling_price");

    const image = formData.get("image");

    const bytes = await image.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const fileName = Date.now() + "-" + image.name;

    const uploadPath = path.join(process.cwd(), "public/uploads", fileName);

    await writeFile(uploadPath, buffer);

    const imageUrl = `/uploads/${fileName}`;

    console.log("INSERTING PRODUCT...");

    await db.execute(
      `
      INSERT INTO wp_products
      (name, actual_price, selling_price, image)
      VALUES (?, ?, ?, ?)
      `,
      [name, actual_price, selling_price, imageUrl],
    );

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.log("DATABASE ERROR:");
    console.log(error);

    return Response.json({
      success: false,
      error: error.message,
    });
  }
}
