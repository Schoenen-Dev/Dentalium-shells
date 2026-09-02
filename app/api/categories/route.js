// =====================================================================
//  REPLACE:  app/api/categories/route.js
//
//  Returns the three collections shown on the site - NOT the product
//  names. Previously every product name became a filter button, which
//  is why the filter bar filled up with size labels.
// =====================================================================

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const COLLECTIONS = [
  "Dentalium Shells",
  "Seashell Jewelry",
  "Coastal Decor",
];

export async function GET() {
  return NextResponse.json({ categories: ["All", ...COLLECTIONS] });
}
