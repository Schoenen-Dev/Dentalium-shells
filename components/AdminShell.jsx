// =====================================================================
//  NEW FILE:  components/AdminShell.jsx
//
//  Sidebar + header used by every admin page. It also handles the
//  session check, so individual pages no longer repeat that code.
// =====================================================================

"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutGrid,
  PlusCircle,
  Package,
  Receipt,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";
import { verifySession, logout } from "@/lib/adminAuth";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutGrid },
  { href: "/admin/add-product", label: "Add product", icon: PlusCircle },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: Receipt },
  { href: "/admin/users", label: "Messages", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminShell({ title, subtitle, actions, children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [ready, setReady] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    verifySession().then((ok) => {
      if (!ok) router.replace("/admin-login");
      else setReady(true);
    });
  }, [router]);

  const handleLogout = async () => {
    await logout();
    router.replace("/admin-login");
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#FBF7F1] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#b88e4b] border-t-transparent rounded-full animate-spin" />
          <p className="font-sans text-sm text-[#0b2f49]/50">
            Checking your session
          </p>
        </div>
      </div>
    );
  }

  const SidebarLinks = ({ onNavigate }) => (
    <nav className="flex flex-col">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`group relative flex items-center gap-3 px-7 py-3.5 font-sans text-[15px] transition-colors ${
              active
                ? "text-white bg-white/[0.06]"
                : "text-white/55 hover:text-white/90"
            }`}
          >
            <span
              className={`absolute left-0 top-0 bottom-0 w-[2px] transition-colors ${
                active ? "bg-[#b88e4b]" : "bg-transparent"
              }`}
            />
            <Icon className="w-[17px] h-[17px] shrink-0" strokeWidth={1.75} />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#FBF7F1] font-sans">
      {/* ---------------- SIDEBAR (desktop) ---------------- */}

      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-[#0b2f49] flex-col">
        <div className="px-7 py-8">
          <Link href="/admin" className="block">
            <div className="font-serif text-[22px] leading-none text-white">
              Dentalium <span className="text-[#b88e4b] italic">Shells</span>
            </div>
            <div className="mt-2 font-sans text-[11px] tracking-[0.18em] text-white/35">
              STORE ADMIN
            </div>
          </Link>
        </div>

        <div className="h-px bg-white/10 mx-7" />

        <div className="py-6 flex-1">
          <SidebarLinks />
        </div>

        <div className="px-7 pb-7 space-y-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 font-sans text-[13px] text-white/45 hover:text-[#b88e4b] transition-colors"
          >
            View storefront
            <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} />
          </a>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 font-sans text-[13px] text-white/45 hover:text-white transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" strokeWidth={2} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ---------------- MOBILE BAR ---------------- */}

      <div className="lg:hidden sticky top-0 z-40 bg-[#0b2f49] px-5 h-16 flex items-center justify-between">
        <Link href="/admin" className="font-serif text-lg text-white">
          Dentalium <span className="text-[#b88e4b] italic">Shells</span>
        </Link>

        <button
          onClick={() => setNavOpen(!navOpen)}
          className="text-white p-2 -mr-2"
          aria-label="Menu"
        >
          {navOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {navOpen && (
        <div className="lg:hidden bg-[#0b2f49] pb-5">
          <SidebarLinks onNavigate={() => setNavOpen(false)} />

          <div className="px-7 pt-5">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 font-sans text-[13px] text-white/45"
            >
              <LogOut className="w-3.5 h-3.5" strokeWidth={2} />
              Sign out
            </button>
          </div>
        </div>
      )}

      {/* ---------------- CONTENT ---------------- */}

      <main className="lg:pl-64">
        <header className="px-6 lg:px-12 pt-10 lg:pt-14 pb-8">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="font-serif text-[34px] lg:text-[40px] leading-tight text-[#0b2f49]">
                {title}
              </h1>

              {subtitle && (
                <p className="mt-2 font-sans text-[15px] text-[#0b2f49]/50 max-w-xl">
                  {subtitle}
                </p>
              )}
            </div>

            {actions}
          </div>

          <div className="mt-7 h-px bg-[#ebdec8]" />
        </header>

        <div className="px-6 lg:px-12 pb-20">{children}</div>
      </main>
    </div>
  );
}
