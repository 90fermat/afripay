import Link from "next/link"
import { ChevronRight } from "lucide-react"

const sidebarLinks = [
  { title: "Getting Started", href: "/docs", active: true },
  { title: "Authentication", href: "/docs/authentication" },
  { title: "API Reference", href: "/docs/api-reference" },
  { title: "Hosted Checkout", href: "/docs/checkout" },
  { title: "Webhooks", href: "/docs/webhooks" },
  { title: "SDKs & Libraries", href: "/docs/sdks" },
  { title: "Error Handling", href: "/docs/errors" },
]

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#030712] text-zinc-50">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#030712]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-emerald-400" />
            <span className="font-bold text-sm">AfriDevPay</span>
            <span className="text-zinc-600 text-sm">/</span>
            <span className="text-zinc-400 text-sm font-medium">Docs</span>
          </Link>
          <div className="flex items-center gap-4">
            <a href="https://github.com/90fermat/afripay" target="_blank" className="text-xs text-zinc-500 hover:text-white transition-colors">
              GitHub
            </a>
            <Link href="/login" className="text-xs font-medium bg-white text-black px-3 py-1.5 rounded-lg hover:bg-zinc-200 transition-all">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 shrink-0 border-r border-white/5 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-8 px-6">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Documentation</div>
          <ul className="space-y-1">
            {sidebarLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <ChevronRight className="w-3 h-3 text-zinc-600" />
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 py-10 px-6 md:px-12 max-w-4xl">
          {children}
        </main>
      </div>
    </div>
  )
}
