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

    const { productId, qty, action, price, name, image } = body;

    // ADD ITEM

    if (action === "add") {
      const existing = cart.items.find((i) => i.id === productId);

      if (existing) {
        existing.qty += qty;
      } else {
        cart.items.push({
          id: productId,

          qty,

          price,

          name,

          image,
        });
      }
    }

    // UPDATE QUANTITY

    if (action === "set") {
      cart.items = cart.items.map((i) => {
        if (i.id === productId) {
          return {
            ...i,
            qty,
          };
        }

        return i;
      });
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
