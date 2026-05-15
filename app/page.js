"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ShoppingBag,
  Search,
  Star,
  Plus,
  Minus,
  Trash2,
  Heart,
  Truck,
  Shield,
  Sparkles,
  Anchor,
  ChevronRight,
  Menu,
  X,
  Check,
} from "lucide-react";

const HERO_IMG =
  "https://images.unsplash.com/photo-1611794485509-701be5a5d4c5?crop=entropy&cs=srgb&fm=jpg&q=85";
const ABOUT_IMG =
  "https://images.unsplash.com/photo-1611853904829-6d0f4034ce2f?crop=entropy&cs=srgb&fm=jpg&q=85";
const STORY_IMG =
  "https://images.unsplash.com/photo-1571378023115-0df759b786aa?crop=entropy&cs=srgb&fm=jpg&q=85";

const fmt = (n) => `$${Number(n).toFixed(2)}`;

function getSession() {
  if (typeof window === "undefined") return "srv";
  let s = localStorage.getItem("ds_session");
  if (!s) {
    s = "sess_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("ds_session", s);
  }
  return s;
}

const App = () => {
  const [view, setView] = useState("home"); // home | shop | product | checkout | admin | confirm
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeCat, setActiveCat] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [cart, setCart] = useState({ items: [] });
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [sessionId, setSessionId] = useState("");
  const [newsletter, setNewsletter] = useState("");
  const [newsletterOk, setNewsletterOk] = useState(false);

  useEffect(() => {
    setSessionId(getSession());
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    fetchProducts();
    fetchCategories();
    fetchCart();
  }, [sessionId]);

  const fetchProducts = async () => {
    setLoading(true);
    const r = await fetch("/api/products");
    const d = await r.json();
    setProducts(d.products || []);
    setLoading(false);
  };
  const fetchCategories = async () => {
    const r = await fetch("/api/categories");
    const d = await r.json();
    setCategories(d.categories || ["All"]);
  };
  const fetchCart = async () => {
    if (!sessionId) return;
    const r = await fetch(`/api/cart/${sessionId}`);
    const d = await r.json();
    setCart(d.cart || { items: [] });
  };

  const addToCart = async (product, qty = 1) => {
    const r = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        productId: product.id,
        qty,
        action: "add",
      }),
    });
    const d = await r.json();
    setCart(d.cart);
    setCartOpen(true);
  };

  const updateQty = async (productId, qty) => {
    const r = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, productId, qty, action: "set" }),
    });
    const d = await r.json();
    setCart(d.cart);
  };
  const removeItem = async (productId) => {
    const r = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, productId, action: "remove" }),
    });
    const d = await r.json();
    setCart(d.cart);
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (activeCat !== "All" && p.category !== activeCat) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [products, activeCat, search]);

  const subtotal = (cart.items || []).reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 12;
  const total = subtotal + shipping;
  const itemCount = (cart.items || []).reduce((s, i) => s + i.qty, 0);

  const goShop = (cat) => {
    setActiveCat(cat || "All");
    setView("shop");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goProduct = (p) => {
    setSelected(p);
    setView("product");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitNewsletter = async (e) => {
    e.preventDefault();
    if (!newsletter) return;
    await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newsletter }),
    });
    setNewsletterOk(true);
    setNewsletter("");
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* TOP BAR */}
      <div className="bg-deep text-white text-xs py-2 px-4 text-center font-sans tracking-wider">
        ✦ FREE SHIPPING ON ORDERS OVER $150 · HAND-CRAFTED · SUSTAINABLY SOURCED
        ✦
      </div>

      {/* NAV */}
      <nav className="sticky top-0 z-40 bg-cream/90 backdrop-blur border-b border-sand">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between h-20">
          <button
            onClick={() => setView("home")}
            className="flex items-center gap-2 group"
          >
            <Anchor className="w-6 h-6 text-gold" />
            <div className="font-serif text-xl lg:text-2xl tracking-wide text-deep">
              Dentalium <span className="text-gold italic">Shells</span>
            </div>
          </button>
          <div className="hidden md:flex items-center gap-8 font-sans text-sm tracking-wide">
            <button
              onClick={() => setView("home")}
              className="hover:text-gold transition"
            >
              Home
            </button>
            <button
              onClick={() => goShop("All")}
              className="hover:text-gold transition"
            >
              Shop All
            </button>
            <button
              onClick={() => goShop("Dentalium Shells")}
              className="hover:text-gold transition"
            >
              Dentalium
            </button>

            <button
              onClick={() => setView("contact")}
              className="hover:text-gold transition"
            >
              Contact
            </button>
            <button
              onClick={() => setView("admin")}
              className="hover:text-gold transition opacity-60"
            >
              Admin
            </button>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCartOpen(true)}
              className="relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-sand bg-cream px-4 py-4 space-y-3 font-sans">
            {[
              "Home",
              "Shop All",
              "Dentalium Shells",
              "Seashell Jewelry",
              "Coastal Decor",
            ].map((x) => (
              <button
                key={x}
                onClick={() => {
                  x === "Home"
                    ? setView("home")
                    : goShop(x === "Shop All" ? "All" : x);
                  setMenuOpen(false);
                }}
                className="block w-full text-left py-1"
              >
                {x}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* MAIN VIEWS */}
      {view === "home" && (
        <Home
          products={products}
          loading={loading}
          goShop={goShop}
          goProduct={goProduct}
          addToCart={addToCart}
          newsletter={newsletter}
          setNewsletter={setNewsletter}
          submitNewsletter={submitNewsletter}
          newsletterOk={newsletterOk}
        />
      )}
      {view === "shop" && (
        <Shop
          products={filtered}
          categories={categories}
          activeCat={activeCat}
          setActiveCat={setActiveCat}
          search={search}
          setSearch={setSearch}
          loading={loading}
          goProduct={goProduct}
          addToCart={addToCart}
        />
      )}
      {view === "product" && selected && (
        <ProductPage
          product={selected}
          addToCart={addToCart}
          goShop={goShop}
          products={products}
          goProduct={goProduct}
        />
      )}
      {view === "checkout" && (
        <Checkout
          cart={cart}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          sessionId={sessionId}
          onPlaced={(o) => {
            setOrder(o);
            setView("confirm");
            fetchCart();
          }}
        />
      )}
      {view === "confirm" && order && (
        <Confirmation order={order} goHome={() => setView("home")} />
      )}

      {view === "contact" && <Contact/>}

      {view === "admin" && (
        <Admin onCreated={fetchProducts} products={products} />
      )}

      <Footer goShop={goShop} />

      {/* CART DRAWER */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent className="w-full sm:max-w-md flex flex-col bg-cream">
          <SheetHeader>
            <SheetTitle className="font-serif text-2xl text-deep">
              Your Bag ({itemCount})
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {(cart.items || []).length === 0 && (
              <div className="text-center text-muted-foreground mt-20">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-serif text-lg">Your bag is empty</p>
                <p className="text-sm mt-1">Discover something beautiful.</p>
              </div>
            )}
            {(cart.items || []).map((item) => (
              <div
                key={item.productId}
                className="flex gap-3 pb-4 border-b border-sand"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="font-serif text-sm text-deep">
                    {item.name}
                  </div>
                  <div className="text-gold text-sm mt-1">
                    {fmt(item.price)}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        updateQty(item.productId, Math.max(0, item.qty - 1))
                      }
                      className="w-7 h-7 border border-sand rounded flex items-center justify-center hover:bg-sand"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm w-6 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.productId, item.qty + 1)}
                      className="w-7 h-7 border border-sand rounded flex items-center justify-center hover:bg-sand"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="ml-auto text-muted-foreground hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {(cart.items || []).length > 0 && (
            <div className="border-t border-sand pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : fmt(shipping)}</span>
              </div>
              <div className="flex justify-between font-serif text-lg pt-2 border-t border-sand">
                <span>Total</span>
                <span className="text-gold">{fmt(total)}</span>
              </div>
              <Button
                className="w-full bg-deep hover:bg-deep/90 text-white rounded-none h-12 font-sans tracking-wider"
                onClick={() => {
                  setCartOpen(false);
                  setView("checkout");
                  window.scrollTo({ top: 0 });
                }}
              >
                Checkout →
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

/* ===================== HOME ===================== */
const Home = ({
  products,
  loading,
  goShop,
  goProduct,
  addToCart,
  newsletter,
  setNewsletter,
  submitNewsletter,
  newsletterOk,
}) => {
  const featured = products.slice(0, 4);
  return (
    <div className="fade-in">
      {/* HERO */}
      <section className="relative h-[88vh] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMG}
            alt="Ocean"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-deep/80 via-deep/40 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 w-full">
          <div className="max-w-2xl text-white">
            <Badge className="bg-gold/90 text-white border-0 rounded-none px-3 py-1 mb-6 font-sans tracking-widest text-xs">
              NEW · SUMMER COLLECTION 2025
            </Badge>
            <h1 className="font-serif text-5xl md:text-7xl leading-tight mb-6">
              Carved by the Sea.
              <br />
              <span className="italic text-gold">Worn for a Lifetime.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-lg mb-8 font-sans">
              Authentic dentalium tusk shells, sustainably wild-harvested and
              hand-finished into heirlooms you'll pass down.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => goShop("All")}
                size="lg"
                className="bg-gold hover:bg-gold/90 text-white rounded-none h-14 px-8 tracking-widest text-sm"
              >
                SHOP THE COLLECTION
              </Button>
              <Button
                onClick={() => goShop("Dentalium Shells")}
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-deep rounded-none h-14 px-8 tracking-widest text-sm"
              >
                DENTALIUM →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-deep text-white py-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { i: Truck, t: "Worldwide Shipping", s: "Free over $150" },
            { i: Shield, t: "Lifetime Restring", s: "On all dentalium" },
            { i: Sparkles, t: "Hand-Finished", s: "Each piece unique" },
            { i: Anchor, t: "Wild Harvested", s: "Ethically sourced" },
          ].map((x, i) => (
            <div key={i} className="flex flex-col items-center">
              <x.i className="w-7 h-7 text-gold mb-2" />
              <div className="font-serif text-base">{x.t}</div>
              <div className="text-xs text-white/60 mt-1">{x.s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-20">
        <div className="text-center mb-14">
          <div className="text-gold text-sm tracking-widest mb-3">EXPLORE</div>
          <h2 className="font-serif text-4xl md:text-5xl text-deep">
            Shop by Collection
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Dentalium Shells",
              img: "https://images.unsplash.com/photo-1571378023115-0df759b786aa?crop=entropy&cs=srgb&fm=jpg&q=85",
              desc: "Sacred tusk shells",
            },
            {
              name: "Seashell Jewelry",
              img: "https://images.unsplash.com/photo-1778182553300-7593326ca29d?crop=entropy&cs=srgb&fm=jpg&q=85",
              desc: "Heirloom pieces",
            },
            {
              name: "Coastal Decor",
              img: "https://images.unsplash.com/photo-1765077613984-87e023a96501?crop=entropy&cs=srgb&fm=jpg&q=85",
              desc: "For your sanctuary",
            },
          ].map((c) => (
            <button
              key={c.name}
              onClick={() => goShop(c.name)}
              className="group relative overflow-hidden rounded-sm hover-lift block"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={c.img}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-deep/80 via-deep/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                <div className="text-xs text-gold tracking-widest mb-1">
                  {c.desc}
                </div>
                <h3 className="font-serif text-2xl md:text-3xl">{c.name}</h3>
                <div className="flex items-center gap-2 mt-3 text-sm tracking-wide opacity-0 group-hover:opacity-100 transition">
                  Explore <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-sand/30 py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="text-gold text-sm tracking-widest mb-3">
                FEATURED
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-deep">
                Most Loved
              </h2>
            </div>
            <button
              onClick={() => goShop("All")}
              className="hidden md:flex items-center gap-2 text-deep hover:text-gold font-sans text-sm tracking-widest"
            >
              VIEW ALL <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square shimmer rounded" />
                ))
              : featured.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onSelect={() => goProduct(p)}
                    onAdd={() => addToCart(p)}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-gold text-sm tracking-widest mb-3">
              OUR STORY
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-deep mb-6 leading-tight">
              A Currency older than gold.
            </h2>
            <p className="text-deep/80 text-lg leading-relaxed mb-4 font-sans">
              For thousands of years, dentalium tusk shells were the currency of
              coastal peoples — traded from the Pacific Northwest to the Great
              Plains. Worn as adornment, given in ceremony, kept as wealth.
            </p>
            <p className="text-deep/80 text-lg leading-relaxed mb-8 font-sans">
              We honor that lineage. Every shell is wild-harvested with respect,
              hand-graded for color and curve, and finished in our small studio
              by artisans who treat each strand like a story.
            </p>
            <Button
              onClick={() => goShop("Heirloom Pieces")}
              className="bg-deep hover:bg-deep/90 text-white rounded-none h-12 px-8 tracking-widest text-sm"
            >
              DISCOVER HEIRLOOMS
            </Button>
          </div>
          <div className="relative">
            <img
              src={STORY_IMG}
              alt="Dentalium"
              className="w-full aspect-[4/5] object-cover rounded-sm"
            />
            <div className="absolute -bottom-6 -left-6 bg-gold text-white p-6 hidden md:block">
              <div className="font-serif text-3xl">10K+</div>
              <div className="text-xs tracking-widest mt-1">
                YEARS OF TRADITION
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-deep text-white py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <div className="text-gold text-sm tracking-widest mb-3">
              FROM OUR FAMILY
            </div>
            <h2 className="font-serif text-4xl md:text-5xl">
              Worn. Loved. Treasured.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                n: "Maya R.",
                q: "My dentalium strand has become my signature. People stop me on the street to ask about it. The craftsmanship is breathtaking.",
                l: "Brooklyn, NY",
              },
              {
                n: "Aiyana K.",
                q: "I bought the Heritage Trade Necklace for my mother. She cried. It carries the weight of our ancestors and feels like home.",
                l: "Seattle, WA",
              },
              {
                n: "Sienna P.",
                q: "The Goldleaf earrings live in my ears. Light as a feather, gorgeous on, and I get compliments every single day.",
                l: "Malibu, CA",
              },
            ].map((t, i) => (
              <div key={i} className="border border-white/10 p-8">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="font-serif text-lg italic leading-relaxed mb-6">
                  "{t.q}"
                </p>
                <div className="text-sm tracking-wide">{t.n}</div>
                <div className="text-xs text-white/50 mt-1">{t.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-sand py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <Sparkles className="w-8 h-8 text-gold mx-auto mb-4" />
          <h2 className="font-serif text-4xl text-deep mb-4">
            Join the Tideline
          </h2>
          <p className="text-deep/70 mb-8 font-sans">
            Get 10% off your first piece, plus first access to new collections
            and ceremonies.
          </p>
          {newsletterOk ? (
            <div className="text-deep flex items-center justify-center gap-2 font-serif text-lg">
              <Check className="w-5 h-5 text-gold" /> Welcome aboard. Check your
              inbox.
            </div>
          ) : (
            <form
              onSubmit={submitNewsletter}
              className="flex gap-2 max-w-md mx-auto"
            >
              <Input
                value={newsletter}
                onChange={(e) => setNewsletter(e.target.value)}
                type="email"
                placeholder="your@email.com"
                required
                className="rounded-none h-12 bg-cream border-deep/20 focus:border-gold"
              />
              <Button
                type="submit"
                className="bg-deep hover:bg-deep/90 text-white rounded-none h-12 px-6 tracking-widest text-xs"
              >
                SUBSCRIBE
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

/* ===================== PRODUCT CARD ===================== */
const ProductCard = ({ product, onSelect, onAdd }) => (
  <div className="group relative">
    <button onClick={onSelect} className="block w-full text-left">
      <div className="relative aspect-square overflow-hidden bg-sand/30 mb-4">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {product.badge && (
          <Badge className="absolute top-3 left-3 bg-gold text-white border-0 rounded-none text-[10px] tracking-widest px-2 py-1">
            {product.badge.toUpperCase()}
          </Badge>
        )}
        {product.compareAt && (
          <Badge className="absolute top-3 right-3 bg-deep text-white border-0 rounded-none text-[10px] tracking-widest px-2 py-1">
            SALE
          </Badge>
        )}
      </div>
      <div className="text-xs text-gold tracking-widest mb-1">
        {product.category}
      </div>
      <h3 className="font-serif text-lg text-deep mb-1">{product.name}</h3>
      <div className="flex items-center gap-2">
        <span className="text-deep">{fmt(product.price)}</span>
        {product.compareAt && (
          <span className="text-sm text-muted-foreground line-through">
            {fmt(product.compareAt)}
          </span>
        )}
      </div>
    </button>
    <Button
      onClick={onAdd}
      className="w-full mt-3 bg-deep hover:bg-gold text-white rounded-none h-10 text-xs tracking-widest opacity-0 group-hover:opacity-100 transition"
    >
      ADD TO BAG
    </Button>
  </div>
);

/* ===================== SHOP ===================== */
const Shop = ({
  products,
  categories,
  activeCat,
  setActiveCat,
  search,
  setSearch,
  loading,
  goProduct,
  addToCart,
}) => (
  <div className="fade-in max-w-7xl mx-auto px-4 lg:px-8 py-12">
    <div className="text-center mb-10">
      <div className="text-gold text-sm tracking-widest mb-3">
        THE COLLECTION
      </div>
      <h1 className="font-serif text-4xl md:text-5xl text-deep">
        {activeCat === "All" ? "Shop All" : activeCat}
      </h1>
    </div>
    <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCat(c)}
            className={`px-4 py-2 text-xs tracking-widest border transition ${activeCat === c ? "bg-deep text-white border-deep" : "border-deep/20 text-deep hover:border-deep"}`}
          >
            {c.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search shells..."
          className="pl-9 rounded-none h-10 border-deep/20 focus:border-gold bg-cream"
        />
      </div>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
      {loading ? (
        Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square shimmer rounded" />
        ))
      ) : products.length === 0 ? (
        <div className="col-span-full text-center py-20 font-serif text-xl text-deep/50">
          No pieces match your search.
        </div>
      ) : (
        products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onSelect={() => goProduct(p)}
            onAdd={() => addToCart(p)}
          />
        ))
      )}
    </div>
  </div>
);

/* ===================== PRODUCT PAGE ===================== */
const ProductPage = ({ product, addToCart, goShop, products, goProduct }) => {
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  return (
    <div className="fade-in max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <button
        onClick={() => goShop("All")}
        className="text-sm text-deep/60 hover:text-gold mb-8 flex items-center gap-1 font-sans tracking-wide"
      >
        ← Back to shop
      </button>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <div className="aspect-square bg-sand/30 mb-4 overflow-hidden">
            <img
              src={product.images?.[imgIdx] || product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`w-20 h-20 overflow-hidden border-2 ${imgIdx === i ? "border-gold" : "border-transparent"}`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <div className="text-gold text-xs tracking-widest mb-3">
            {product.category}
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-deep mb-4">
            {product.name}
          </h1>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(product.rating || 5) ? "fill-gold text-gold" : "text-sand"}`}
                />
              ))}
            </div>
            <span className="text-sm text-deep/60">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-serif text-3xl text-deep">
              {fmt(product.price)}
            </span>
            {product.compareAt && (
              <span className="text-lg text-muted-foreground line-through">
                {fmt(product.compareAt)}
              </span>
            )}
          </div>
          <p className="text-deep/80 leading-relaxed mb-8 font-sans">
            {product.description}
          </p>
          {product.details?.length > 0 && (
            <div className="border-t border-sand pt-6 mb-8">
              <div className="font-serif text-deep mb-3">The Details</div>
              <ul className="space-y-2 text-sm text-deep/70">
                {product.details.map((d, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-gold">·</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center border border-deep/20">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-12 hover:bg-sand"
              >
                <Minus className="w-4 h-4 mx-auto" />
              </button>
              <span className="w-12 text-center">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-10 h-12 hover:bg-sand"
              >
                <Plus className="w-4 h-4 mx-auto" />
              </button>
            </div>
            <Button
              onClick={() => addToCart(product, qty)}
              className="flex-1 bg-deep hover:bg-gold text-white rounded-none h-12 tracking-widest text-sm"
            >
              ADD TO BAG · {fmt(product.price * qty)}
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-deep/60 mt-4">
            <Truck className="w-4 h-4" /> Free shipping on orders over $150 ·
            Ships in 2-3 days
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-24">
          <h2 className="font-serif text-3xl text-deep mb-8 text-center">
            You might also love
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={() => goProduct(p)}
                onAdd={() => addToCart(p)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ===================== CHECKOUT ===================== */
const Checkout = ({ cart, subtotal, shipping, total, sessionId, onPlaced }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    country: "USA",
    card: "4242 4242 4242 4242",
    exp: "12/27",
    cvc: "123",
  });
  const [placing, setPlacing] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setPlacing(true);
    const r = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: {
          name: form.name,
          email: form.email,
          address: form.address,
          city: form.city,
          zip: form.zip,
          country: form.country,
        },
        items: cart.items,
        subtotal,
        shipping,
        total,
        sessionId,
      }),
    });
    const d = await r.json();
    setPlacing(false);
    if (d.order) onPlaced(d.order);
  };
  if ((cart.items || []).length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-32 text-center">
        <h1 className="font-serif text-3xl text-deep">Your bag is empty.</h1>
      </div>
    );
  }
  return (
    <div className="fade-in max-w-6xl mx-auto px-4 lg:px-8 py-12">
      <h1 className="font-serif text-4xl text-deep mb-10 text-center">
        Checkout
      </h1>
      <form onSubmit={submit} className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div>
            <h2 className="font-serif text-xl text-deep mb-4">Contact</h2>
            <Input
              required
              placeholder="Full name"
              className="rounded-none mb-3 bg-cream border-deep/20"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              required
              type="email"
              placeholder="Email"
              className="rounded-none bg-cream border-deep/20"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <h2 className="font-serif text-xl text-deep mb-4">
              Shipping Address
            </h2>
            <Input
              required
              placeholder="Street address"
              className="rounded-none mb-3 bg-cream border-deep/20"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Input
                required
                placeholder="City"
                className="rounded-none bg-cream border-deep/20"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <Input
                required
                placeholder="ZIP"
                className="rounded-none bg-cream border-deep/20"
                value={form.zip}
                onChange={(e) => setForm({ ...form, zip: e.target.value })}
              />
            </div>
            <Input
              required
              placeholder="Country"
              className="rounded-none bg-cream border-deep/20"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />
          </div>
          <div>
            <h2 className="font-serif text-xl text-deep mb-4">
              Payment{" "}
              <span className="text-xs text-deep/50 font-sans">
                (Demo · use test card)
              </span>
            </h2>
            <Input
              required
              placeholder="Card number"
              className="rounded-none mb-3 bg-cream border-deep/20"
              value={form.card}
              onChange={(e) => setForm({ ...form, card: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                required
                placeholder="MM/YY"
                className="rounded-none bg-cream border-deep/20"
                value={form.exp}
                onChange={(e) => setForm({ ...form, exp: e.target.value })}
              />
              <Input
                required
                placeholder="CVC"
                className="rounded-none bg-cream border-deep/20"
                value={form.cvc}
                onChange={(e) => setForm({ ...form, cvc: e.target.value })}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="bg-sand/30 p-6 sticky top-28">
            <h2 className="font-serif text-xl text-deep mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {cart.items.map((i) => (
                <div key={i.productId} className="flex gap-3 text-sm">
                  <img
                    src={i.image}
                    alt=""
                    className="w-16 h-16 object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-serif text-deep">{i.name}</div>
                    <div className="text-deep/60 text-xs">Qty {i.qty}</div>
                  </div>
                  <div className="text-deep">{fmt(i.price * i.qty)}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-deep/10 pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : fmt(shipping)}</span>
              </div>
              <div className="flex justify-between font-serif text-xl pt-2 border-t border-deep/10">
                <span>Total</span>
                <span className="text-gold">{fmt(total)}</span>
              </div>
            </div>
            <Button
              type="submit"
              disabled={placing}
              className="w-full mt-6 bg-deep hover:bg-deep/90 text-white rounded-none h-12 tracking-widest text-sm"
            >
              {placing ? "PLACING ORDER..." : `PLACE ORDER · ${fmt(total)}`}
            </Button>
            <div className="text-xs text-deep/50 mt-3 text-center">
              Secure checkout · Demo mode
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

/* ===================== CONFIRMATION ===================== */
const Confirmation = ({ order, goHome }) => (
  <div className="fade-in max-w-2xl mx-auto px-4 py-20 text-center">
    <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-6">
      <Check className="w-8 h-8 text-white" />
    </div>
    <h1 className="font-serif text-4xl text-deep mb-4">
      Thank you, {order.customer?.name?.split(" ")[0] || "friend"}.
    </h1>
    <p className="text-deep/70 mb-2">
      Your order{" "}
      <span className="text-gold font-bold">#{order.orderNumber}</span> has been
      received.
    </p>
    <p className="text-deep/70 mb-8">
      A confirmation has been sent to {order.customer?.email}.
    </p>
    <div className="bg-sand/30 p-6 text-left mb-8">
      <h3 className="font-serif text-xl mb-4 text-deep">Order Details</h3>
      {order.items?.map((i) => (
        <div
          key={i.productId}
          className="flex justify-between py-2 border-b border-deep/10 text-sm"
        >
          <span>
            {i.name} × {i.qty}
          </span>
          <span>{fmt(i.price * i.qty)}</span>
        </div>
      ))}
      <div className="flex justify-between pt-3 font-serif text-lg">
        <span>Total</span>
        <span className="text-gold">{fmt(order.total)}</span>
      </div>
    </div>
    <Button
      onClick={goHome}
      className="bg-deep hover:bg-deep/90 text-white rounded-none h-12 px-8 tracking-widest text-sm"
    >
      CONTINUE EXPLORING
    </Button>
  </div>
);

/* ===================== ADMIN ===================== */
const Admin = ({ onCreated, products }) => {
  const [form, setForm] = useState({
    name: "",
    category: "Seashell Jewelry",
    price: "",
    compareAt: "",
    stock: "10",
    short: "",
    description: "",
    images: "",
    details: "",
  });
  const [msg, setMsg] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    const body = {
      ...form,
      price: Number(form.price),
      compareAt: form.compareAt ? Number(form.compareAt) : null,
      stock: Number(form.stock),
      images: form.images
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      details: form.details
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    const r = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (r.ok) {
      setMsg("✓ Product created");
      setForm({
        name: "",
        category: "Seashell Jewelry",
        price: "",
        compareAt: "",
        stock: "10",
        short: "",
        description: "",
        images: "",
        details: "",
      });
      onCreated();
    }
  };
  const del = async (id) => {
    if (!confirm("Delete?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    onCreated();
  };
  return (
    <div className="fade-in max-w-5xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl text-deep mb-2">Admin · Products</h1>
      <p className="text-deep/60 mb-8 font-sans">Manage your collection</p>
      <Tabs defaultValue="add">
        <TabsList className="rounded-none bg-sand/50">
          <TabsTrigger value="add" className="rounded-none">
            Add Product
          </TabsTrigger>
          <TabsTrigger value="list" className="rounded-none">
            All Products ({products.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="add">
          <form
            onSubmit={submit}
            className="bg-cream p-6 border border-sand grid md:grid-cols-2 gap-4 mt-4"
          >
            <Input
              required
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-none"
            />
            <Input
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="rounded-none"
            />
            <Input
              required
              placeholder="Price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="rounded-none"
            />
            <Input
              placeholder="Compare-at price"
              type="number"
              step="0.01"
              value={form.compareAt}
              onChange={(e) => setForm({ ...form, compareAt: e.target.value })}
              className="rounded-none"
            />
            <Input
              placeholder="Stock"
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="rounded-none"
            />
            <Input
              placeholder="Short tagline"
              value={form.short}
              onChange={(e) => setForm({ ...form, short: e.target.value })}
              className="rounded-none md:col-span-2"
            />
            <Textarea
              placeholder="Long description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="rounded-none md:col-span-2 min-h-24"
            />
            <Textarea
              placeholder="Image URLs (one per line)"
              value={form.images}
              onChange={(e) => setForm({ ...form, images: e.target.value })}
              className="rounded-none md:col-span-2 min-h-20"
            />
            <Textarea
              placeholder="Details bullets (one per line)"
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              className="rounded-none md:col-span-2 min-h-20"
            />
            <Button
              type="submit"
              className="bg-deep text-white rounded-none h-12 md:col-span-2 tracking-widest text-sm"
            >
              CREATE PRODUCT
            </Button>
            {msg && <div className="md:col-span-2 text-gold">{msg}</div>}
          </form>
        </TabsContent>
        <TabsContent value="list">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="border border-sand p-3 bg-cream flex gap-3"
              >
                <img
                  src={p.images?.[0]}
                  alt=""
                  className="w-20 h-20 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-serif text-deep truncate">{p.name}</div>
                  <div className="text-xs text-deep/60">{p.category}</div>
                  <div className="text-gold mt-1">{fmt(p.price)}</div>
                </div>
                <button
                  onClick={() => del(p.id)}
                  className="text-red-500 hover:bg-red-50 p-2 self-start"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
/* ===================== CONTACT ===================== */
const Contact = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async (e) => {
   e.preventDefault();

   try {
     const res = await fetch(
      "http://dentalium.local/wp-json/custom/v1/contact",
       {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify(formData),
       },
     );

     const data = await res.json();

     console.log(data);

     alert("Message sent successfully!");

     setFormData({
       name: "",
       email: "",
       subject: "",
       message: "",
     });
   } catch (error) {
     console.log(error);

     alert("Something went wrong");
   }
 }; 

  return (
    <div className="fade-in max-w-4xl mx-auto px-4 py-20">

      <div className="text-center mb-12">

        <div className="text-gold text-sm tracking-widest mb-3">
          CONTACT
        </div>

        <h1 className="font-serif text-5xl text-deep mb-4">
          Get in Touch
        </h1>

        <p className="text-deep/70 font-sans">
          Questions about shells, jewelry, or custom orders?
        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6"
      >

        <Input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="rounded-none h-12 border-deep/20"
          required
        />

        <Input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          className="rounded-none h-12 border-deep/20"
          required
        />

        <Input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          className="rounded-none h-12 border-deep/20 md:col-span-2"
        />

        <Textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          className="rounded-none border-deep/20 md:col-span-2 min-h-40"
          required
        />

        <Button
          type="submit"
          className="bg-deep hover:bg-gold text-white rounded-none h-12 tracking-widest text-sm md:col-span-2"
        >
          SEND MESSAGE
        </Button>

      </form>

    </div>
  );
};

/* ===================== FOOTER ===================== */
const Footer = ({ goShop }) => (
  <footer className="bg-deep text-white pt-16 pb-8 mt-0">
    <div className="max-w-7xl mx-auto px-4 lg:px-8 grid md:grid-cols-4 gap-10">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Anchor className="w-6 h-6 text-gold" />
          <div className="font-serif text-xl">
            Dentalium <span className="italic text-gold">Shells</span>
          </div>
        </div>
        <p className="text-white/60 text-sm leading-relaxed">
          Heirloom shell jewelry, sustainably sourced and lovingly made for
          those who treasure stories.
        </p>
      </div>
      <div>
        <div className="font-serif text-gold mb-4">Shop</div>
        <ul className="space-y-2 text-sm text-white/70">
          <li>
            <button onClick={() => goShop("All")} className="hover:text-gold">
              All Products
            </button>
          </li>
          <li>
            <button
              onClick={() => goShop("Dentalium Shells")}
              className="hover:text-gold"
            >
              Dentalium
            </button>
          </li>
          <li>
            <button
              onClick={() => goShop("Seashell Jewelry")}
              className="hover:text-gold"
            >
              Jewelry
            </button>
          </li>
          <li>
            <button
              onClick={() => goShop("Coastal Decor")}
              className="hover:text-gold"
            >
              Decor
            </button>
          </li>
        </ul>
      </div>
      <div>
        <div className="font-serif text-gold mb-4">Care</div>
        <ul className="space-y-2 text-sm text-white/70">
          <li>Shipping & Returns</li>
          <li>Lifetime Restring</li>
          <li>Sourcing</li>
          <li>Contact</li>
        </ul>
      </div>
      <div>
        <div className="font-serif text-gold mb-4">Stay in Touch</div>
        <p className="text-sm text-white/60 mb-3">@dentaliumshells</p>
        <p className="text-sm text-white/60">hello@dentaliumshells.com</p>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between text-xs text-white/40">
      <div>© 2025 Dentalium Shells · Hand-crafted with reverence.</div>
      <div className="flex gap-4 mt-2 md:mt-0">
        Privacy · Terms · Accessibility
      </div>
    </div>
  </footer>
);

export default App;
