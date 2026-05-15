import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME || 'dentalium';

let cachedClient = null;
async function getDb() {
  if (!cachedClient) {
    cachedClient = new MongoClient(MONGO_URL);
    await cachedClient.connect();
  }
  return cachedClient.db(DB_NAME);
}

const SEED_PRODUCTS = [
  {
    id: 'p-001',
    slug: 'sacred-dentalium-strand',
    name: 'Sacred Dentalium Strand',
    category: 'Dentalium Shells',
    price: 189,
    compareAt: 240,
    stock: 24,
    rating: 4.9,
    reviewCount: 87,
    badge: 'Best Seller',
    images: [
      'https://images.unsplash.com/photo-1571378023115-0df759b786aa?crop=entropy&cs=srgb&fm=jpg&q=85',
      'https://images.unsplash.com/photo-1650012332958-2aa054c850ff?crop=entropy&cs=srgb&fm=jpg&q=85'
    ],
    short: 'Hand-graded ivory tusk shells, polished by tide and time.',
    description: 'Each strand of our Sacred Dentalium is hand-graded for color and curvature, then polished by the rhythm of the tide. Strung on archival silk, this piece carries an heirloom weight — quietly elegant, worn for ceremony or every day.',
    details: ['Genuine ivory dentalium tusk shells','Hand-knotted on natural silk','Adjustable 18"–22" length','Sustainably wild-harvested','Comes in a recycled linen pouch']
  },
  {
    id: 'p-002',
    slug: 'tideline-pearl-necklace',
    name: 'Tideline Pearl Necklace',
    category: 'Pearl Jewelry',
    price: 245,
    compareAt: null,
    stock: 12,
    rating: 4.8,
    reviewCount: 41,
    badge: 'New',
    images: [
      'https://images.unsplash.com/photo-1654699991520-aaaf4dd2608b?crop=entropy&cs=srgb&fm=jpg&q=85'
    ],
    short: 'Freshwater pearls cradled in 14k gold-fill.',
    description: 'Lustrous baroque freshwater pearls suspended on a whisper-fine 14k gold-fill chain. Inspired by the line where ocean meets sand — soft, luminous, undeniably feminine.',
    details: ['AAA freshwater baroque pearls','14k gold-fill chain','Lobster clasp','16" with 2" extender']
  },
  {
    id: 'p-003',
    slug: 'goldleaf-shell-earrings',
    name: 'Goldleaf Shell Earrings',
    category: 'Seashell Jewelry',
    price: 98,
    compareAt: 130,
    stock: 38,
    rating: 4.95,
    reviewCount: 156,
    badge: 'Limited',
    images: [
      'https://images.unsplash.com/photo-1778182553300-7593326ca29d?crop=entropy&cs=srgb&fm=jpg&q=85'
    ],
    short: 'Real shells dipped in 18k gold leaf.',
    description: 'Tiny, perfect shells gathered at low tide and dipped in 18k gold leaf. Light as a breath, warm as morning sun on the water.',
    details: ['Genuine seashells, 18k gold dipped','Hypoallergenic posts','Drop length: 1.25"','One-of-a-kind — no two pairs identical']
  },
  {
    id: 'p-004',
    slug: 'heritage-trade-necklace',
    name: 'Heritage Trade Necklace',
    category: 'Heirloom Pieces',
    price: 420,
    compareAt: null,
    stock: 6,
    rating: 5.0,
    reviewCount: 22,
    badge: 'Heirloom',
    images: [
      'https://images.unsplash.com/photo-1611853904829-6d0f4034ce2f?crop=entropy&cs=srgb&fm=jpg&q=85'
    ],
    short: 'Multi-strand dentalium with brass trade beads.',
    description: 'A reverent nod to the original trade routes of the Pacific Northwest. Multi-strand dentalium woven with antique brass beads and red coral accents. A piece with stories already inside it.',
    details: ['Multi-strand dentalium','Antique brass trade beads','Red coral accents','Hand-knotted, 24" length']
  },
  {
    id: 'p-005',
    slug: 'driftwood-shell-mobile',
    name: 'Driftwood Shell Mobile',
    category: 'Coastal Decor',
    price: 145,
    compareAt: null,
    stock: 9,
    rating: 4.85,
    reviewCount: 33,
    images: [
      'https://images.unsplash.com/photo-1765077613984-87e023a96501?crop=entropy&cs=srgb&fm=jpg&q=85'
    ],
    short: 'Sun-bleached driftwood, hand-strung shells.',
    description: 'A meditation in salt and sun — driftwood gathered from northern beaches, paired with hand-strung shells that move like wind chimes without the chime. For windows that deserve poetry.',
    details: ['Sun-bleached driftwood (~16" wide)','Mixed natural shells','Hand-knotted hemp cord','Each piece unique']
  },
  {
    id: 'p-006',
    slug: 'low-tide-scallop-set',
    name: 'Low Tide Scallop Set',
    category: 'Seashell Jewelry',
    price: 78,
    compareAt: 95,
    stock: 45,
    rating: 4.7,
    reviewCount: 64,
    images: [
      'https://images.unsplash.com/photo-1650012332958-2aa054c850ff?crop=entropy&cs=srgb&fm=jpg&q=85'
    ],
    short: 'Scallop pendant + matching studs.',
    description: 'A quiet little set for everyday wear — a small scallop pendant on a delicate chain, plus matching studs. Layers beautifully, lives in your jewelry box for decades.',
    details: ['Sterling silver','Genuine scallop shell','Pendant: 16" chain','Studs: 8mm']
  }
];

async function ensureSeed(db) {
  const count = await db.collection('products').countDocuments();
  if (count === 0) {
    await db.collection('products').insertMany(SEED_PRODUCTS.map(p => ({ ...p, createdAt: new Date() })));
  }
}

function json(data, status = 200) {
  return NextResponse.json(data, { status });
}

export async function GET(request, { params }) {
  try {
    const db = await getDb();
    await ensureSeed(db);
    const path = (params?.path || []).join('/');
    const url = new URL(request.url);

    if (path === '' || path === 'health') return json({ ok: true, service: 'dentalium-api' });

    if (path === 'products') {
      const category = url.searchParams.get('category');
      const q = url.searchParams.get('q');
      const filter = {};
      if (category && category !== 'All') filter.category = category;
      if (q) filter.name = { $regex: q, $options: 'i' };
      const products = await db.collection('products').find(filter, { projection: { _id: 0 } }).toArray();
      return json({ products });
    }

    if (path.startsWith('products/')) {
      const slug = path.split('/')[1];
      const product = await db.collection('products').findOne({ slug }, { projection: { _id: 0 } });
      if (!product) return json({ error: 'Not found' }, 404);
      return json({ product });
    }

    if (path === 'categories') {
      const products = await db.collection('products').find({}, { projection: { category: 1 } }).toArray();
      const cats = [...new Set(products.map(p => p.category))];
      return json({ categories: ['All', ...cats] });
    }

    if (path.startsWith('cart/')) {
      const sessionId = path.split('/')[1];
      const cart = await db.collection('carts').findOne({ sessionId }, { projection: { _id: 0 } });
      return json({ cart: cart || { sessionId, items: [] } });
    }

    if (path === 'orders') {
      const orders = await db.collection('orders').find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).limit(50).toArray();
      return json({ orders });
    }

    return json({ error: 'Route not found' }, 404);
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}

export async function POST(request, { params }) {
  try {
    const db = await getDb();
    const path = (params?.path || []).join('/');
    const body = await request.json().catch(() => ({}));

    if (path === 'products') {
      const product = {
        id: uuidv4(),
        slug: (body.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Math.random().toString(36).slice(2, 6),
        name: body.name,
        category: body.category || 'Seashell Jewelry',
        price: Number(body.price) || 0,
        compareAt: body.compareAt ? Number(body.compareAt) : null,
        stock: Number(body.stock) || 0,
        rating: 5.0,
        reviewCount: 0,
        badge: body.badge || null,
        images: body.images || [],
        short: body.short || '',
        description: body.description || '',
        details: body.details || [],
        createdAt: new Date(),
      };
      await db.collection('products').insertOne(product);
      const { _id, ...clean } = product;
      return json({ product: clean });
    }

    if (path === 'cart') {
      const { sessionId, productId, qty = 1, action = 'add' } = body;
      if (!sessionId || !productId) return json({ error: 'sessionId and productId required' }, 400);
      const product = await db.collection('products').findOne({ id: productId }, { projection: { _id: 0 } });
      if (!product && action !== 'remove') return json({ error: 'Product not found' }, 404);
      let cart = await db.collection('carts').findOne({ sessionId });
      if (!cart) cart = { sessionId, items: [] };
      const idx = cart.items.findIndex(i => i.productId === productId);
      if (action === 'remove') {
        cart.items = cart.items.filter(i => i.productId !== productId);
      } else if (action === 'set') {
        if (idx >= 0) cart.items[idx].qty = qty;
        else cart.items.push({ productId, qty, name: product.name, price: product.price, image: product.images?.[0], slug: product.slug });
      } else { // add
        if (idx >= 0) cart.items[idx].qty += qty;
        else cart.items.push({ productId, qty, name: product.name, price: product.price, image: product.images?.[0], slug: product.slug });
      }
      cart.items = cart.items.filter(i => i.qty > 0);
      await db.collection('carts').updateOne({ sessionId }, { $set: cart }, { upsert: true });
      const { _id, ...clean } = cart;
      return json({ cart: clean });
    }

    if (path === 'orders') {
      const order = {
        id: uuidv4(),
        orderNumber: 'DS-' + Date.now().toString().slice(-6),
        customer: body.customer || {},
        items: body.items || [],
        subtotal: body.subtotal || 0,
        shipping: body.shipping || 0,
        total: body.total || 0,
        status: 'received',
        createdAt: new Date(),
      };
      await db.collection('orders').insertOne(order);
      // clear cart
      if (body.sessionId) await db.collection('carts').deleteOne({ sessionId: body.sessionId });
      const { _id, ...clean } = order;
      return json({ order: clean });
    }

    if (path === 'newsletter') {
      await db.collection('newsletter').insertOne({ email: body.email, createdAt: new Date() });
      return json({ ok: true });
    }

    return json({ error: 'Route not found' }, 404);
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    const db = await getDb();
    const path = (params?.path || []).join('/');
    if (path.startsWith('products/')) {
      const id = path.split('/')[1];
      await db.collection('products').deleteOne({ id });
      return json({ ok: true });
    }
    return json({ error: 'Route not found' }, 404);
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}
