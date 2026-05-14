import { fetchApi } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Key, Eye, ShieldAlert, Check } from "lucide-react"
import RollKeyButton from "./roll-key-button"

export default async function ApiKeysPage() {
  let apiKeys = [];
  try {
    apiKeys = await fetchApi("/dashboard/api-keys");
  } catch (e) {
    console.error("Failed to fetch API keys", e);
  }

  const liveKey = apiKeys.find((k: any) => k.environment === "LIVE");
  const testKey = apiKeys.find((k: any) => k.environment === "TEST");

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">API Keys</h1>
        <p className="text-zinc-400">Manage your keys for authenticating requests to AfriDevPay.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Test Mode Keys */}
        <Card className="border-white/10 bg-black/40 backdrop-blur-3xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-zinc-500" />
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Key className="h-5 w-5 text-zinc-400" /> Test Mode
              </CardTitle>
              <Badge variant="outline" className="bg-zinc-500/10 text-zinc-300 border-zinc-500/20">TEST</Badge>
            </div>
            <CardDescription className="text-zinc-400">
              Use these keys to authenticate API requests in your test environment. No real money is moved.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Secret Key</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm font-mono text-zinc-300">
                  {testKey ? testKey.keyPrefix + "••••••••" : "No active test key"}
                </code>
              </div>
              <p className="text-xs text-zinc-500">
                Created: {testKey ? new Date(testKey.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div className="pt-4 border-t border-white/10">
              <RollKeyButton environment="TEST" hasKey={!!testKey} />
            </div>
          </CardContent>
        </Card>

        {/* Live Mode Keys */}
        <Card className="border-white/10 bg-black/40 backdrop-blur-3xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500" />
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Key className="h-5 w-5 text-emerald-400" /> Live Mode
              </CardTitle>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">LIVE</Badge>
            </div>
            <CardDescription className="text-zinc-400">
              Use these keys to authenticate API requests in production. Real transactions will be processed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Secret Key</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm font-mono text-emerald-400/80">
                  {liveKey ? liveKey.keyPrefix + "••••••••" : "No active live key"}
                </code>
              </div>
              <p className="text-xs text-zinc-500">
                Created: {liveKey ? new Date(liveKey.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div className="pt-4 border-t border-white/10">
               <RollKeyButton environment="LIVE" hasKey={!!liveKey} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex gap-3">
        <ShieldAlert className="h-5 w-5 text-rose-500 shrink-0" />
        <div>
          <h3 className="text-rose-400 font-semibold mb-1 text-sm">Keep your keys safe</h3>
          <p className="text-sm text-rose-300/80">
            Never share your API keys or commit them to version control. If a key is compromised, roll it immediately to generate a new one and invalidate the old one.
          </p>
        </div>
      </div>
    </div>
  )
}
