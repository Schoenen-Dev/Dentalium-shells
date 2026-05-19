import { NextResponse } from "next/server";

let cart = {
  items: [],
};

export async function GET() {
  return NextResponse.json({
    cart,
  });
}

export async function POST(request) {
  try {
    const body = await request.json();

    const { productId, qty, action } = body;

    // ADD PRODUCT

    if (action === "add") {
      const existing = cart.items.find((i) => i.id === productId);

      if (existing) {
        existing.qty += qty;
      } else {
        cart.items.push({
          id: productId,

          qty,

          price: body.price || 0,

          name: body.name || "",

          image: body.image || "",
        });
      }
    }

    // UPDATE QUANTITY

    if (action === "set") {
      cart.items = cart.items.map((i) =>
        i.id === productId
          ? {
              ...i,
              qty,
            }
          : i,
      );
    }

    // REMOVE ITEM

    if (action === "remove") {
      cart.items = cart.items.filter((i) => i.id !== productId);
    }

    return NextResponse.json({
      cart,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      cart: {
        items: [],
      },
    });
  }
}
