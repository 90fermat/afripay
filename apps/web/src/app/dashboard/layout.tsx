"use client"
import { Key, LayoutDashboard, Settings, CreditCard, Activity, Code2, Webhook } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transactions", href: "/dashboard/transactions", icon: CreditCard },
    { name: "API Keys", href: "/dashboard/api-keys", icon: Key },
    { name: "Webhooks", href: "/dashboard/webhooks", icon: Webhook },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#030712] text-zinc-50 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#050B14]/80 backdrop-blur-xl flex flex-col z-20">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <img src="/logo.png" alt="AfriDevPay" className="w-7 h-7 rounded-md object-cover shadow-[0_0_15px_rgba(99,102,241,0.4)]" />
            <span className="text-xl font-bold tracking-tight text-white">AfriDevPay</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-3 space-y-1 mt-6">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-3">Menu</div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive 
                  ? "bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20" 
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5 border border-transparent"
                }`}
              >
                <item.icon className={`h-4 w-4 ${isActive ? "text-indigo-400" : "text-zinc-500"}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 m-3 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-600 to-emerald-600 border-2 border-zinc-900 shadow-lg" />
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Developer Workspace</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <p className="text-xs text-zinc-400 font-medium tracking-wide">LIVE MODE</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Ambient background glow */}
        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[20%] w-[30vw] h-[30vw] bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
        
        <div className="p-8 max-w-7xl mx-auto z-10 relative">
          {children}
        </div>
      </main>
    </div>
  )
}
