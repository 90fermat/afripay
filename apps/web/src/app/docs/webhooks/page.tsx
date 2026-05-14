export default function WebhooksDocsPage() {
  return (
    <article className="prose-invert max-w-none">
      <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Webhooks</h1>
      <p className="text-lg text-zinc-400 mb-10 border-b border-white/5 pb-8">
        Receive real-time notifications when payment events occur.
      </p>

      {/* Overview */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4">How Webhooks Work</h2>
        <p className="text-zinc-400 mb-4">
          When a payment status changes (e.g., from <code className="bg-white/5 px-1 rounded text-sm">PENDING</code> to <code className="bg-white/5 px-1 rounded text-sm">SUCCESS</code>), 
          AfriDevPay sends an HTTP POST request to your configured webhook URL with the event payload.
        </p>
        <div className="bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden mb-4">
          <div className="flex items-center px-4 py-2 border-b border-white/5">
            <span className="text-xs text-zinc-500 font-mono">Webhook payload example</span>
          </div>
          <pre className="p-4 text-sm font-mono text-zinc-300 overflow-x-auto leading-relaxed">{`{
  "eventId": "evt_abc123...",
  "type": "payment.status_updated",
  "data": {
    "transactionId": "txn_xyz789...",
    "status": "SUCCESS",
    "amount": 5000,
    "currency": "XAF",
    "provider": "MTN_MOMO",
    "providerTransactionId": "mtn_ref_456"
  },
  "timestamp": "2026-05-14T19:00:00Z"
}`}</pre>
        </div>
      </section>

      {/* Setup */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4">Setting Up Webhooks</h2>
        <ol className="space-y-4 text-zinc-400">
          <li className="flex gap-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold shrink-0 mt-0.5">1</span>
            <span>Go to <strong className="text-white">Dashboard → Webhooks</strong> and enter your endpoint URL (must be HTTPS).</span>
          </li>
          <li className="flex gap-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold shrink-0 mt-0.5">2</span>
            <span>Copy the <strong className="text-white">webhook signing secret</strong> — you&apos;ll use this to verify incoming requests.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold shrink-0 mt-0.5">3</span>
            <span>Return a <strong className="text-white">2xx status code</strong> within 30 seconds to acknowledge receipt.</span>
          </li>
        </ol>
      </section>

      {/* Signature Verification */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4">Verifying Signatures</h2>
        <p className="text-zinc-400 mb-4">
          Every webhook includes an <code className="bg-white/5 px-1 rounded text-sm">X-AfriPay-Signature</code> header containing an HMAC-SHA256 signature of the request body, signed with your webhook secret.
        </p>
        <div className="bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden mb-4">
          <div className="flex items-center px-4 py-2 border-b border-white/5">
            <span className="text-xs text-zinc-500 font-mono">verify-webhook.js</span>
          </div>
          <pre className="p-4 text-sm font-mono text-zinc-300 overflow-x-auto leading-relaxed">{`const crypto = require('crypto');

function verifyWebhookSignature(body, signature, secret) {
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(body))
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSig)
  );
}`}</pre>
        </div>
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
          <p className="text-sm text-rose-300 m-0">
            <strong>Security:</strong> Always verify webhook signatures before processing events. 
            Never trust the payload without verification — it could be a spoofed request.
          </p>
        </div>
      </section>

      {/* Retry Policy */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4">Retry Policy</h2>
        <p className="text-zinc-400 mb-4">
          If your endpoint returns a non-2xx status or times out, AfriDevPay retries with exponential backoff:
        </p>
        <div className="border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Attempt</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Delay After Failure</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              <tr className="border-b border-white/5"><td className="px-4 py-3">1st retry</td><td className="px-4 py-3 text-yellow-400">2 minutes</td></tr>
              <tr className="border-b border-white/5"><td className="px-4 py-3">2nd retry</td><td className="px-4 py-3 text-yellow-400">10 minutes</td></tr>
              <tr className="border-b border-white/5"><td className="px-4 py-3">3rd retry</td><td className="px-4 py-3 text-amber-400">50 minutes</td></tr>
              <tr className="border-b border-white/5"><td className="px-4 py-3">4th retry</td><td className="px-4 py-3 text-rose-400">~4 hours</td></tr>
              <tr><td className="px-4 py-3">After 5 failures</td><td className="px-4 py-3 text-rose-500 font-medium">Permanently marked FAILED</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-zinc-500 mt-3">
          View all delivery attempts and their HTTP responses in the <strong className="text-zinc-400">Dashboard → Webhooks → Recent Deliveries</strong> section.
        </p>
      </section>
    </article>
  )
}
