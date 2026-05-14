import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function DocsPage() {
  return (
    <article className="prose-invert max-w-none">
      <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Getting Started</h1>
      <p className="text-lg text-zinc-400 mb-10 border-b border-white/5 pb-8">
        Accept mobile money payments across Africa in under 5 minutes.
      </p>

      {/* Step 1 */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 text-sm font-bold border border-indigo-500/20">1</span>
          <h2 className="text-xl font-bold text-white m-0">Create a Merchant Account</h2>
        </div>
        <p className="text-zinc-400 mb-4">
          Sign up at <Link href="/login" className="text-indigo-400 hover:underline">AfriDevPay Dashboard</Link> to create your merchant account. 
          You&apos;ll receive sandbox API keys immediately.
        </p>
      </section>

      {/* Step 2 */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 text-sm font-bold border border-indigo-500/20">2</span>
          <h2 className="text-xl font-bold text-white m-0">Install the SDK</h2>
        </div>
        <div className="bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden mb-4">
          <div className="flex items-center px-4 py-2 border-b border-white/5">
            <span className="text-xs text-zinc-500 font-mono">Terminal</span>
          </div>
          <pre className="p-4 text-sm font-mono text-emerald-300 overflow-x-auto">
            npm install @afripay/sdk
          </pre>
        </div>
        <p className="text-zinc-400">
          Or use direct REST calls — our API is fully documented in the{" "}
          <Link href="/docs/api-reference" className="text-indigo-400 hover:underline">API Reference</Link>.
        </p>
      </section>

      {/* Step 3 */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 text-sm font-bold border border-indigo-500/20">3</span>
          <h2 className="text-xl font-bold text-white m-0">Make Your First Payment</h2>
        </div>
        <div className="bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden mb-4">
          <div className="flex items-center px-4 py-2 border-b border-white/5">
            <span className="text-xs text-zinc-500 font-mono">payment.js</span>
          </div>
          <pre className="p-4 text-sm font-mono overflow-x-auto leading-relaxed">
            <code className="text-zinc-300">{`import AfriPay from '@afripay/sdk';

const afripay = new AfriPay('sk_test_your_key_here');

const payment = await afripay.payments.create({
  amount: 5000,
  currency: 'XAF',
  provider: 'MTN_MOMO',
  customerPhone: '237670000000',
});

console.log(payment.id);     // "txn_abc123..."
console.log(payment.status); // "PENDING"`}</code>
          </pre>
        </div>
      </section>

      {/* Step 4 */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 text-sm font-bold border border-indigo-500/20">4</span>
          <h2 className="text-xl font-bold text-white m-0">Handle Webhooks</h2>
        </div>
        <p className="text-zinc-400 mb-4">
          Set up a webhook URL in your <Link href="/dashboard/webhooks" className="text-indigo-400 hover:underline">Dashboard</Link> to receive real-time payment notifications.
        </p>
        <div className="bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden mb-4">
          <div className="flex items-center px-4 py-2 border-b border-white/5">
            <span className="text-xs text-zinc-500 font-mono">webhook-handler.js</span>
          </div>
          <pre className="p-4 text-sm font-mono overflow-x-auto leading-relaxed">
            <code className="text-zinc-300">{`app.post('/webhooks/afripay', (req, res) => {
  const signature = req.headers['x-afripay-signature'];
  const isValid = afripay.webhooks.verify(
    req.body, signature, 'whsec_your_secret'
  );

  if (!isValid) return res.status(401).send('Invalid signature');

  const event = req.body;
  if (event.status === 'SUCCESS') {
    // Fulfill the order
  }

  res.status(200).send('OK');
});`}</code>
          </pre>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-sm text-emerald-300 m-0">
            <strong>Tip:</strong> AfriDevPay retries failed webhook deliveries with exponential backoff — up to 5 attempts over 4+ hours. 
            View delivery logs in your dashboard.
          </p>
        </div>
      </section>

      {/* Next Steps */}
      <section className="border-t border-white/5 pt-8">
        <h2 className="text-xl font-bold text-white mb-6">Next Steps</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: "API Reference", desc: "Full endpoint documentation", href: "/docs/api-reference" },
            { title: "Hosted Checkout", desc: "Generate payment links", href: "/docs/checkout" },
            { title: "Webhooks", desc: "Set up real-time notifications", href: "/docs/webhooks" },
            { title: "Authentication", desc: "API key management", href: "/docs/authentication" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="group flex items-center justify-between p-4 rounded-xl border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all">
              <div>
                <div className="font-semibold text-white text-sm">{item.title}</div>
                <div className="text-xs text-zinc-500">{item.desc}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </section>
    </article>
  )
}
