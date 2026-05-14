import { Key } from "lucide-react"

export const metadata = {
  title: "Authentication | AfriDevPay Docs",
}

export default function AuthenticationDocs() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium border border-emerald-500/20">
          <Key className="w-4 h-4" />
          <span>Security</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white">Authentication</h1>
        <p className="text-lg text-zinc-400 leading-relaxed">
          Authenticate your API requests to AfriDevPay using API keys. We provide separate keys for testing and production environments.
        </p>
      </div>

      <div className="prose prose-invert max-w-none">
        <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">Overview</h2>
        <p className="text-zinc-400">
          The AfriDevPay API uses API keys to authenticate requests. You can view and manage your API keys in the <a href="/dashboard/api-keys" className="text-indigo-400 hover:text-indigo-300">Dashboard</a>.
        </p>

        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 my-6">
          <p className="text-rose-400 text-sm font-medium m-0">
            <strong>Keep your keys safe:</strong> Your API keys carry many privileges, so be sure to keep them secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth.
          </p>
        </div>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">Making Authenticated Requests</h3>
        <p className="text-zinc-400">
          Authentication to the API is performed via HTTP Bearer Auth. Provide your API key as the bearer token value in the <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm text-indigo-300">Authorization</code> header.
        </p>

        <div className="my-6 rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0a]">
          <div className="flex items-center px-4 py-2 bg-white/5 border-b border-white/10">
            <span className="text-xs font-mono text-zinc-400">cURL Example</span>
          </div>
          <pre className="p-4 text-sm font-mono text-zinc-300 overflow-x-auto">
{`curl https://api.afripay.dev/api/v1/payments \\
  -H "Authorization: Bearer sk_live_yourSecretKey123" \\
  -H "Content-Type: application/json"`}
          </pre>
        </div>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">Test vs. Live Modes</h3>
        <p className="text-zinc-400 mb-4">
          Almost every request you make will use either your test or live API keys. 
        </p>
        <ul className="space-y-2 text-zinc-400 list-disc pl-5">
          <li><strong>Test Mode (<code className="text-amber-400">sk_test_...</code>)</strong>: Requests made with your test keys do not hit the real banking networks and cost nothing. Use them to build and verify your integration.</li>
          <li><strong>Live Mode (<code className="text-emerald-400">sk_live_...</code>)</strong>: Requests made with your live keys execute actual mobile money transactions.</li>
        </ul>
      </div>
    </div>
  )
}
