import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Projects" },
  { href: "/projects/new", label: "New project" },
  { href: "/settings", label: "Settings" },
];

export function Sidebar() {
  return (
    <aside className="w-full border-b border-slate-200 bg-white md:min-h-[calc(100vh-4rem)] md:w-64 md:border-b-0 md:border-r">
      <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 md:flex-col md:px-6 md:py-6">
        {links.map((link) => (
          <Link
            className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-mint hover:text-ink"
            href={link.href}
            key={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
