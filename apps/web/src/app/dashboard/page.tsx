import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, ArrowUpRight, ArrowDownRight, Users, CreditCard, Wallet, Banknote } from "lucide-react"

export default function DashboardOverview() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">Overview</h1>
          <p className="text-zinc-400 font-medium">Welcome back, your platform is performing well today.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-300 bg-white/5 border border-white/10 px-4 py-2 rounded-lg backdrop-blur-md">
          <Activity className="w-4 h-4 text-indigo-400" />
          System Status: <span className="text-emerald-400 ml-1">100% Operational</span>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <Card className="bg-gradient-to-b from-white/5 to-white/[0.02] border-white/10 shadow-xl backdrop-blur-xl hover:bg-white/[0.08] transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-zinc-400 tracking-wider uppercase">Total Volume</CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Banknote className="h-4 w-4 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white tracking-tight mt-1">$124,563.00</div>
            <p className="text-xs font-semibold text-emerald-400 flex items-center mt-2 bg-emerald-400/10 w-fit px-2 py-1 rounded-md">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +24.5% vs last month
            </p>
          </CardContent>
        </Card>
        
        {/* Card 2 */}
        <Card className="bg-gradient-to-b from-white/5 to-white/[0.02] border-white/10 shadow-xl backdrop-blur-xl hover:bg-white/[0.08] transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-zinc-400 tracking-wider uppercase">Successful Transactions</CardTitle>
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <CreditCard className="h-4 w-4 text-indigo-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white tracking-tight mt-1">8,459</div>
            <p className="text-xs font-semibold text-indigo-400 flex items-center mt-2 bg-indigo-400/10 w-fit px-2 py-1 rounded-md">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +12.3% vs last month
            </p>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="bg-gradient-to-b from-white/5 to-white/[0.02] border-white/10 shadow-xl backdrop-blur-xl hover:bg-white/[0.08] transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-zinc-400 tracking-wider uppercase">Failed Payments</CardTitle>
            <div className="p-2 bg-red-500/10 rounded-lg">
              <ArrowDownRight className="h-4 w-4 text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white tracking-tight mt-1">24</div>
            <p className="text-xs font-semibold text-emerald-400 flex items-center mt-2 bg-emerald-400/10 w-fit px-2 py-1 rounded-md">
              <ArrowDownRight className="h-3 w-3 mr-1" /> -1.2% vs last month
            </p>
          </CardContent>
        </Card>

        {/* Card 4 */}
        <Card className="bg-gradient-to-b from-white/5 to-white/[0.02] border-white/10 shadow-xl backdrop-blur-xl hover:bg-white/[0.08] transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-zinc-400 tracking-wider uppercase">Active Customers</CardTitle>
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Users className="h-4 w-4 text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white tracking-tight mt-1">1,204</div>
            <p className="text-xs font-semibold text-amber-400 flex items-center mt-2 bg-amber-400/10 w-fit px-2 py-1 rounded-md">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +150 this week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-gradient-to-br from-white/[0.05] to-transparent border-white/10 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white">Transaction Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl bg-black/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Activity className="h-10 w-10 text-indigo-500/50 mb-3" />
              <p className="text-sm font-medium text-zinc-500">Interactive chart will render here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 bg-gradient-to-br from-white/[0.05] to-transparent border-white/10 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white">Security & API Keys</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="group flex items-center justify-between p-4 bg-black/40 hover:bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-emerald-500/10 rounded-lg">
                  <Wallet className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">Production Secret Key</p>
                  <p className="text-xs font-medium text-zinc-500">Last used: 2 mins ago</p>
                </div>
              </div>
              <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            </div>
            
            <div className="group flex items-center justify-between p-4 bg-black/40 hover:bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-amber-500/10 rounded-lg">
                  <Wallet className="h-5 w-5 text-amber-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">Test Secret Key</p>
                  <p className="text-xs font-medium text-zinc-500">Last used: 1 hour ago</p>
                </div>
              </div>
              <div className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
