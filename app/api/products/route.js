// =====================================================================
//  REPLACE:  app/api/products/route.js
//
//  force-dynamic stops Next.js freezing this at build time.
//  Also passes through the new "collection" field.
// =====================================================================

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BACKEND = "https://backend.dentaliumshells.com";

export async function GET() {
  try {
    const response = await fetch(`${BACKEND}/wp-json/custom/v1/products`, {
      cache: "no-store",
    });

    const rows = await response.json();

    if (!Array.isArray(rows)) {
      return NextResponse.json({ products: [] });
    }

    const formattedProducts = rows.map((product) => {
      const actualPrice = Number(product.actual_price || 0);
      const sellingPrice = Number(product.selling_price || 0);

      let discount = 0;

      if (actualPrice > 0 && actualPrice > sellingPrice) {
        discount = Math.round(
          ((actualPrice - sellingPrice) / actualPrice) * 100,
        );
      }

      return {
        id: product.id,

        // the collection the product belongs to - used by the filter buttons
        collection: product.collection || "Dentalium Shells",

        // product name (stored in the "category" column)
        name: product.category,

        category: product.category,

        price: sellingPrice,

        compareAt: actualPrice,

        images: [product.image],

        badge: discount > 0 ? `-${discount}%` : null,

        description: product.category,

        details: [],

        rating: 5,

        reviewCount: 0,
      };
    });

    return NextResponse.json({ products: formattedProducts });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ products: [] });
  }
}
