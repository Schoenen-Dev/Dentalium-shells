import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://backend.dentaliumshells.com/wp-json/custom/v1/products",
    );

    const rows = await response.json();

    // FORMAT PRODUCTS

    const formattedProducts = rows.map((product) => {
      const actualPrice = Number(product.actual_price || 0);

      const sellingPrice = Number(product.selling_price || 0);

      let discount = 0;

      if (actualPrice > 0) {
        discount = Math.round(
          ((actualPrice - sellingPrice) / actualPrice) * 100,
        );
      }

      return {
        id: product.id,

        category: product.category,

        name: product.category,

        price: sellingPrice,

        compareAt: actualPrice,

        images: [product.image],

        badge: `-${discount}%`,

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
