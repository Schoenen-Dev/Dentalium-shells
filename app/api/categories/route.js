// =====================================================================
//  NEW FILE:  app/api/categories/route.js
//
//  Before this, /api/categories fell through to the catch-all route,
//  which talks to MongoDB on localhost — dead on Vercel. That is why
//  the shop page only ever showed one "ALL" filter button.
//
//  This builds the category list from the products in your database.
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
      return NextResponse.json({ categories: ["All"] });
    }

    const unique = [
      ...new Set(rows.map((p) => p.category).filter(Boolean)),
    ].sort();

    return NextResponse.json({ categories: ["All", ...unique] });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ categories: ["All"] });
  }
}
