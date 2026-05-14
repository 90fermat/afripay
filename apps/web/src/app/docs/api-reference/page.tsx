export default function ApiReferencePage() {
  return (
    <article className="prose-invert max-w-none">
      <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">API Reference</h1>
      <p className="text-lg text-zinc-400 mb-10 border-b border-white/5 pb-8">
        Complete reference for the AfriDevPay REST API. Base URL: <code className="text-sm bg-white/5 px-2 py-0.5 rounded">https://api.afripay.dev/api/v1</code>
      </p>

      {/* Auth info */}
      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-10">
        <p className="text-sm text-indigo-300 m-0">
          <strong>Authentication:</strong> Include your API key in the <code className="bg-indigo-500/20 px-1 rounded">Authorization</code> header as <code className="bg-indigo-500/20 px-1 rounded">Bearer sk_live_...</code> or <code className="bg-indigo-500/20 px-1 rounded">Bearer sk_test_...</code>
        </p>
      </div>

      {/* POST /payments */}
      <section className="mb-12 border border-white/5 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 bg-white/[0.02] border-b border-white/5">
          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded">POST</span>
          <code className="text-sm text-white font-mono">/payments</code>
          <span className="text-xs text-zinc-500 ml-auto">Initiate a payment</span>
        </div>
        <div className="p-6">
          <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Request Body</h4>
          <div className="bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden mb-4">
            <pre className="p-4 text-sm font-mono text-zinc-300 overflow-x-auto">{`{
  "amount": 5000,
  "currency": "XAF",
  "provider": "MTN_MOMO",
  "customerPhone": "237670000000",
  "returnUrl": "https://yoursite.com/thank-you",
  "metadata": { "orderId": "order_123" }
}`}</pre>
          </div>

          <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Response</h4>
          <div className="bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden">
            <pre className="p-4 text-sm font-mono text-zinc-300 overflow-x-auto">{`{
  "id": "txn_abc123...",
  "status": "PENDING",
  "provider": "MTN_MOMO",
  "amount": "5000",
  "currency": "XAF",
  "providerTransactionId": "mtn_xyz789",
  "failureReason": null
}`}</pre>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="text-xs">
              <span className="text-zinc-500">amount</span>
              <span className="text-zinc-600 mx-2">·</span>
              <span className="text-rose-400">required</span>
              <span className="text-zinc-600 mx-2">·</span>
              <span className="text-zinc-400">Amount in the smallest currency unit (e.g. francs for XAF)</span>
            </div>
            <div className="text-xs">
              <span className="text-zinc-500">provider</span>
              <span className="text-zinc-600 mx-2">·</span>
              <span className="text-rose-400">required</span>
              <span className="text-zinc-600 mx-2">·</span>
              <span className="text-zinc-400">MTN_MOMO, ORANGE_MONEY, or SANDBOX</span>
            </div>
          </div>
        </div>
      </section>

      {/* GET /payments/:id */}
      <section className="mb-12 border border-white/5 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 bg-white/[0.02] border-b border-white/5">
          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-bold rounded">GET</span>
          <code className="text-sm text-white font-mono">/payments/:id</code>
          <span className="text-xs text-zinc-500 ml-auto">Verify payment status</span>
        </div>
        <div className="p-6">
          <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Response</h4>
          <div className="bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden">
            <pre className="p-4 text-sm font-mono text-zinc-300 overflow-x-auto">{`{
  "id": "txn_abc123...",
  "status": "SUCCESS",
  "provider": "MTN_MOMO",
  "amount": "5000",
  "currency": "XAF",
  "providerTransactionId": "mtn_xyz789",
  "failureReason": null
}`}</pre>
          </div>
          <p className="text-xs text-zinc-500 mt-3">
            Possible statuses: <code className="bg-white/5 px-1 rounded">PENDING</code>, <code className="bg-white/5 px-1 rounded">SUCCESS</code>, <code className="bg-white/5 px-1 rounded">FAILED</code>, <code className="bg-white/5 px-1 rounded">REFUNDED</code>
          </p>
        </div>
      </section>

      {/* POST /payments/:id/refund */}
      <section className="mb-12 border border-white/5 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 bg-white/[0.02] border-b border-white/5">
          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-bold rounded">POST</span>
          <code className="text-sm text-white font-mono">/payments/:id/refund</code>
          <span className="text-xs text-zinc-500 ml-auto">Refund a payment</span>
        </div>
        <div className="p-6">
          <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Request Body</h4>
          <div className="bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden">
            <pre className="p-4 text-sm font-mono text-zinc-300 overflow-x-auto">{`{
  "reason": "Customer requested refund"
}`}</pre>
          </div>
        </div>
      </section>

      {/* Checkout Endpoints */}
      <h2 className="text-2xl font-bold text-white mt-16 mb-6 pt-8 border-t border-white/5">Checkout API</h2>

      <section className="mb-12 border border-white/5 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 bg-white/[0.02] border-b border-white/5">
          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded">POST</span>
          <code className="text-sm text-white font-mono">/checkout/session</code>
          <span className="text-xs text-zinc-500 ml-auto">Create a checkout session</span>
        </div>
        <div className="p-6">
          <div className="bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden mb-4">
            <pre className="p-4 text-sm font-mono text-zinc-300 overflow-x-auto">{`{
  "merchantId": "your-merchant-id",
  "amountMinorUnits": 5000,
  "currencyCode": "XAF",
  "returnUrl": "https://yoursite.com/thank-you"
}`}</pre>
          </div>
          <p className="text-xs text-zinc-400">
            Returns a session with an <code className="bg-white/5 px-1 rounded">id</code>. Redirect your customer to <code className="bg-white/5 px-1 rounded">/pay/&#123;sessionId&#125;</code> to complete payment.
          </p>
        </div>
      </section>

      {/* cURL Example */}
      <h2 className="text-2xl font-bold text-white mt-16 mb-6 pt-8 border-t border-white/5">cURL Examples</h2>
      <div className="bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden">
        <div className="flex items-center px-4 py-2 border-b border-white/5">
          <span className="text-xs text-zinc-500 font-mono">Terminal</span>
        </div>
        <pre className="p-4 text-sm font-mono text-zinc-300 overflow-x-auto leading-relaxed">{`curl -X POST https://api.afripay.dev/api/v1/payments \\
  -H "Authorization: Bearer sk_test_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 5000,
    "currency": "XAF",
    "provider": "MTN_MOMO",
    "customerPhone": "237670000000"
  }'`}</pre>
      </div>
    </article>
  )
}
