// =====================================================================
//  REPLACE:  app/api/products/route.js
//
//  THE BUG: in Next.js 14, a GET route handler with no dynamic input is
//  run ONCE at build time and the result is frozen into the deployment.
//  Your backend had no products when Vercel last built, so this route
//  has been serving an empty list ever since — no matter what you add
//  in the admin panel.
//
//  The two lines below force it to fetch fresh on every request.
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

    // FORMAT PRODUCTS
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

        category: product.category,

        name: product.category,

        price: sellingPrice,

        compareAt: actualPrice,

        images: [product.image],

        // no badge when there is no real discount
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
