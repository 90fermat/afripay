import { Code2, Terminal } from "lucide-react"

export const metadata = {
  title: "SDKs & Libraries | AfriDevPay Docs",
}

export default function SDKsDocs() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20">
          <Code2 className="w-4 h-4" />
          <span>Libraries</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white">SDKs & Libraries</h1>
        <p className="text-lg text-zinc-400 leading-relaxed">
          The AfriDevPay API is built on REST, but we offer official client libraries to make integrating into your application as easy as possible.
        </p>
      </div>

      <div className="prose prose-invert max-w-none">
        <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">Official Libraries</h2>
        <p className="text-zinc-400">
          We currently maintain official libraries for Node.js / TypeScript. Support for Python, PHP, and Java is on our roadmap.
        </p>

        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <div className="rounded-xl border border-white/10 bg-black/40 p-6 flex flex-col hover:border-indigo-500/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-white text-lg">Node.js</div>
              <div className="px-2 py-1 bg-white/10 text-xs font-mono text-zinc-300 rounded">v1.0.0</div>
            </div>
            <p className="text-sm text-zinc-400 flex-1">
              Fully typed TypeScript SDK for Node.js environments. Includes built-in webhook signature verification.
            </p>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-indigo-400 text-sm font-medium">
              <Terminal className="w-4 h-4" /> npm install @afripay/sdk
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6 flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs font-semibold">Coming Soon</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-white text-lg">Python</div>
              <div className="px-2 py-1 bg-white/10 text-xs font-mono text-zinc-300 rounded">pip</div>
            </div>
            <p className="text-sm text-zinc-400 flex-1">
              Official Python library for integrating AfriDevPay into Django, Flask, or FastAPI applications.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mt-10 mb-4">Node.js Quickstart</h3>
        
        <div className="my-6 rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0a]">
          <div className="flex items-center px-4 py-2 bg-white/5 border-b border-white/10">
            <span className="text-xs font-mono text-zinc-400">TypeScript</span>
          </div>
          <pre className="p-4 text-sm font-mono text-zinc-300 overflow-x-auto">
{`import { AfriPay } from '@afripay/sdk';

// Initialize the client
const afripay = new AfriPay('sk_test_yourSecretKey123');

// Create a payment
async function processPayment() {
  const result = await afripay.payments.request({
    amount: 500,
    currency: 'XAF',
    phoneNumber: '+237612345678',
    provider: 'MTN_MOBILE_MONEY',
    description: 'Order #1234'
  });
  
  console.log(result.transactionId);
}`}
          </pre>
        </div>
      </div>
    </div>
  )
}
