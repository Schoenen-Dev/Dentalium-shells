import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      port: 10005,
      user: "root",
      password: "root",
      database: "local",
    });

    const [rows] = await connection.execute(
      "SELECT * FROM wp_products ORDER BY id ASC",
    );

    await connection.end();

    // CONVERT DATABASE DATA TO FRONTEND FORMAT
    const formattedProducts = rows.map((product) => {
      const actualPrice = Number(product.actual_price || 0);
      const sellingPrice = Number(product.selling_price || 0);

      // CALCULATE DISCOUNT %
      let discount = 0;

      if (actualPrice > 0) {
        discount = Math.round(
          ((actualPrice - sellingPrice) / actualPrice) * 100,
        );
      }

      return {
        id: product.id,

        // CATEGORY
        category: product.category,

        // PRODUCT NAME
        name: product.category,

        // SELLING PRICE
        price: sellingPrice,

        // ACTUAL PRICE
        compareAt: actualPrice,

        // IMAGE ARRAY
        images: [product.image],

        // DISCOUNT BADGE
        badge: `-${discount}%`,

        // OPTIONAL DETAILS
        description: product.category,
        details: [],
        rating: 5,
        reviewCount: 0,
      };
    });

    return NextResponse.json({
      products: formattedProducts,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      products: [],
    });
  }
}
