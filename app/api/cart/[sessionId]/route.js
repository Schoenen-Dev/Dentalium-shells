// =====================================================================
//  NEW FILE:  app/api/cart/[sessionId]/route.js
//
//  Loads the visitor's cart from the PHP backend.
// =====================================================================

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BACKEND = "https://backend.dentaliumshells.com";

export async function GET(request, { params }) {
  try {
    const sessionId = params.sessionId;

    const response = await fetch(
      `${BACKEND}/api/cart/${encodeURIComponent(sessionId)}`,
      { cache: "no-store" },
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ cart: { items: [] } });
  }
}
