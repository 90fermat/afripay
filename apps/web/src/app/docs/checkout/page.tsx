import Link from "next/link"

export default function CheckoutDocsPage() {
  return (
    <article className="prose-invert max-w-none">
      <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Hosted Checkout</h1>
      <p className="text-lg text-zinc-400 mb-10 border-b border-white/5 pb-8">
        Let AfriDevPay handle the payment UI. Create a session, redirect your customer, and get notified when they pay.
      </p>

      {/* Overview */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4">How It Works</h2>
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {[
            { step: "1", title: "Create Session", desc: "POST to /checkout/session with amount and currency." },
            { step: "2", title: "Redirect Customer", desc: "Send them to /pay/{sessionId} — we handle the rest." },
            { step: "3", title: "Get Notified", desc: "Receive a webhook when payment succeeds or fails." },
          ].map((s) => (
            <div key={s.step} className="bg-white/[0.02] border border-white/5 rounded-xl p-5 text-center">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 text-sm font-bold flex items-center justify-center mx-auto mb-3">{s.step}</div>
              <h4 className="font-semibold text-white text-sm mb-1">{s.title}</h4>
              <p className="text-xs text-zinc-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Create Session */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4">Creating a Checkout Session</h2>
        <div className="bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden mb-4">
          <div className="flex items-center px-4 py-2 border-b border-white/5">
            <span className="text-xs text-zinc-500 font-mono">server.js</span>
          </div>
          <pre className="p-4 text-sm font-mono text-zinc-300 overflow-x-auto leading-relaxed">{`// Server-side: Create a checkout session
const response = await fetch('https://api.afripay.dev/api/v1/checkout/session', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk_live_your_key',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    merchantId: 'your-merchant-uuid',
    amountMinorUnits: 10000,   // 10,000 XAF
    currencyCode: 'XAF',
    returnUrl: 'https://yoursite.com/order-complete',
  }),
});

const session = await response.json();

// Redirect customer to the checkout page
// https://pay.afripay.dev/pay/{session.id}`}</pre>
        </div>
      </section>

      {/* Session Lifecycle */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4">Session Lifecycle</h2>
        <div className="border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              <tr className="border-b border-white/5">
                <td className="px-4 py-3"><code className="bg-yellow-500/10 text-yellow-400 px-1.5 rounded text-xs">OPEN</code></td>
                <td className="px-4 py-3 text-zinc-400">Session created, waiting for customer to submit payment details.</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="px-4 py-3"><code className="bg-blue-500/10 text-blue-400 px-1.5 rounded text-xs">PROCESSING</code></td>
                <td className="px-4 py-3 text-zinc-400">Customer submitted, payment is being processed by the provider.</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="px-4 py-3"><code className="bg-emerald-500/10 text-emerald-400 px-1.5 rounded text-xs">COMPLETED</code></td>
                <td className="px-4 py-3 text-zinc-400">Payment succeeded. Customer is redirected to your returnUrl.</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="px-4 py-3"><code className="bg-rose-500/10 text-rose-400 px-1.5 rounded text-xs">FAILED</code></td>
                <td className="px-4 py-3 text-zinc-400">Payment failed or was rejected by the provider.</td>
              </tr>
              <tr>
                <td className="px-4 py-3"><code className="bg-zinc-500/10 text-zinc-400 px-1.5 rounded text-xs">EXPIRED</code></td>
                <td className="px-4 py-3 text-zinc-400">Session expired (30 minute default TTL).</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Customization */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4">Checkout Page Features</h2>
        <ul className="space-y-3 text-sm text-zinc-400">
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-1">✓</span>
            <span><strong className="text-white">Provider Selection</strong> — Customers choose between MTN MoMo, Orange Money, and other available providers.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-1">✓</span>
            <span><strong className="text-white">Phone Validation</strong> — Real-time phone number validation per provider.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-1">✓</span>
            <span><strong className="text-white">Responsive Design</strong> — Premium dark-mode UI that works on all devices.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-1">✓</span>
            <span><strong className="text-white">Auto-redirect</strong> — Customers are automatically redirected to your returnUrl after payment.</span>
          </li>
        </ul>
      </section>

      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
        <p className="text-sm text-emerald-300 m-0">
          <strong>Tip:</strong> Use hosted checkout to maximize conversion rates. 
          It handles provider selection, phone validation, loading states, and error handling — so you don&apos;t have to.
        </p>
      </div>
    </article>
  )
}
