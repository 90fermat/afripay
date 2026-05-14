import Link from "next/link"
import { Zap, Shield, RefreshCw, BarChart3, Smartphone, Code2, Globe, ArrowRight, CheckCircle2, ChevronRight } from "lucide-react"

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
)

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
)

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#030712] text-zinc-50 relative overflow-hidden">
      
      {/* ═══════════════ BACKGROUND EFFECTS ═══════════════ */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[60vw] h-[40vw] bg-indigo-600/15 blur-[180px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[50vw] h-[50vw] bg-blue-900/10 blur-[160px] rounded-full mix-blend-screen" />
        <div className="absolute top-1/2 left-0 w-[40vw] h-[30vw] bg-emerald-500/8 blur-[140px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* ═══════════════ NAVIGATION ═══════════════ */}
      <nav className="relative z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="AfriDevPay" className="w-8 h-8 rounded-lg shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-shadow object-cover" />
            <span className="text-lg font-bold tracking-tight">AfriDevPay</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            <Link href="/docs" className="hover:text-white transition-colors">Documentation</Link>
            <Link href="/docs/api-reference" className="hover:text-white transition-colors">API Reference</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
            <a href="https://github.com/90fermat/afripay" target="_blank" className="hover:text-white transition-colors flex items-center gap-1.5">
              <GithubIcon /> GitHub
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link href="/login" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-lg hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95">
              Get API Keys
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="relative z-10 pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-medium text-indigo-300 mb-8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Now supporting MTN MoMo, Orange Money & more
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
              The Stripe for
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400">
              African Mobile Money
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            One unified API to accept payments via MTN MoMo, Orange Money, and more. 
            Built by African developers, for African developers. Production-ready in 5 minutes.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/login" className="group flex items-center gap-2 bg-white text-black font-semibold px-8 py-3.5 rounded-xl hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
              Start Building for Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/docs" className="flex items-center gap-2 text-zinc-400 font-medium px-8 py-3.5 rounded-xl border border-white/10 hover:bg-white/5 hover:text-white transition-all">
              <Code2 className="w-4 h-4" />
              Read the Docs
            </Link>
          </div>

          {/* Code Preview */}
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-blue-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                {/* Terminal header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-3 text-xs text-zinc-500 font-mono">payment.js — 3 lines to accept payments</span>
                </div>
                
                <pre className="p-6 text-left text-sm font-mono leading-relaxed overflow-x-auto">
                  <code>
                    <span className="text-zinc-500">{"// Accept a payment in 3 lines of code"}</span>{"\n"}
                    <span className="text-blue-400">{"const"}</span>{" "}
                    <span className="text-zinc-200">{"payment"}</span>{" "}
                    <span className="text-zinc-500">{"="}</span>{" "}
                    <span className="text-blue-400">{"await"}</span>{" "}
                    <span className="text-emerald-400">{"afripay"}</span>
                    <span className="text-zinc-500">{"."}</span>
                    <span className="text-yellow-300">{"payments"}</span>
                    <span className="text-zinc-500">{"."}</span>
                    <span className="text-indigo-400">{"create"}</span>
                    <span className="text-zinc-400">{"({"}</span>{"\n"}
                    {"  "}
                    <span className="text-emerald-300">{"amount"}</span>
                    <span className="text-zinc-500">{":"}</span>{" "}
                    <span className="text-amber-300">{"5000"}</span>
                    <span className="text-zinc-500">{","}</span>{" "}
                    <span className="text-zinc-600">{"// 5,000 XAF"}</span>{"\n"}
                    {"  "}
                    <span className="text-emerald-300">{"currency"}</span>
                    <span className="text-zinc-500">{":"}</span>{" "}
                    <span className="text-amber-200">{'"XAF"'}</span>
                    <span className="text-zinc-500">{","}</span>{"\n"}
                    {"  "}
                    <span className="text-emerald-300">{"provider"}</span>
                    <span className="text-zinc-500">{":"}</span>{" "}
                    <span className="text-amber-200">{'"MTN_MOMO"'}</span>
                    <span className="text-zinc-500">{","}</span>{"\n"}
                    {"  "}
                    <span className="text-emerald-300">{"customerPhone"}</span>
                    <span className="text-zinc-500">{":"}</span>{" "}
                    <span className="text-amber-200">{'"237670000000"'}</span>{"\n"}
                    <span className="text-zinc-400">{"});"}</span>
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ TRUSTED BY / STATS ═══════════════ */}
      <section className="relative z-10 border-y border-white/5 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "99.9%", label: "Uptime SLA" },
              { value: "< 200ms", label: "API Latency" },
              { value: "5 min", label: "Integration Time" },
              { value: "6+", label: "Countries Supported" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">{stat.value}</div>
                <div className="text-sm text-zinc-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES GRID ═══════════════ */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Everything you need to accept{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-emerald-400">mobile money</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              A complete payment infrastructure that handles the complexity of African mobile money, so you can focus on building your product.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Smartphone, title: "Multi-Provider Support", description: "MTN MoMo, Orange Money, and more — all through one unified API. No need to integrate each provider separately.", color: "from-yellow-500 to-orange-500" },
              { icon: Zap, title: "Hosted Checkout", description: "Beautiful, conversion-optimized checkout pages hosted by us. Just create a session and redirect your customers.", color: "from-indigo-500 to-blue-500" },
              { icon: RefreshCw, title: "Webhook Retry Engine", description: "Exponential backoff retries with 5 attempts over 4+ hours. Every delivery is logged for full transparency.", color: "from-emerald-500 to-teal-500" },
              { icon: Shield, title: "HMAC Signatures", description: "Every webhook is signed with your secret key. Verify authenticity with a single line of code.", color: "from-rose-500 to-pink-500" },
              { icon: BarChart3, title: "Merchant Dashboard", description: "Real-time transaction monitoring, API key management, and webhook delivery logs — all in a premium dark-mode UI.", color: "from-purple-500 to-violet-500" },
              { icon: Globe, title: "Sandbox Mode", description: "Test your entire integration with sandbox API keys. No real money, instant responses, production-identical behavior.", color: "from-cyan-500 to-blue-500" },
            ].map((feature) => (
              <div key={feature.title} className="group relative bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300">
                <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${feature.color} mb-4 shadow-lg`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="relative z-10 py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Go live in <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-emerald-400">three steps</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Get your API keys", description: "Sign up, create a merchant account, and grab your sandbox + live API keys from the dashboard.", icon: Code2 },
              { step: "02", title: "Integrate the API", description: "Use our SDK or make direct REST calls to initiate payments. Our hosted checkout handles the UI.", icon: Zap },
              { step: "03", title: "Go live & get paid", description: "Switch from sandbox to live keys and start accepting real mobile money payments across Africa.", icon: CheckCircle2 },
            ].map((item, i) => (
              <div key={item.step} className="relative text-center group">
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[1px] bg-gradient-to-r from-white/10 to-transparent" />
                )}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-6 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all">
                  <item.icon className="w-7 h-7 text-indigo-400" />
                </div>
                <div className="text-xs font-bold text-indigo-400 tracking-widest mb-2">STEP {item.step}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PRICING ═══════════════ */}
      <section id="pricing" className="relative z-10 py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-zinc-400">No hidden fees. No monthly minimums. Pay only for what you process.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Sandbox */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all">
              <div className="text-sm font-medium text-zinc-400 mb-2">Sandbox</div>
              <div className="text-4xl font-bold text-white mb-1">Free</div>
              <div className="text-sm text-zinc-500 mb-8">Forever</div>
              <ul className="space-y-3 text-sm text-zinc-400 mb-8">
                {["Unlimited test transactions", "All providers", "Webhook testing", "Full API access"].map((f) => (
                  <li key={f} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />{f}</li>
                ))}
              </ul>
              <Link href="/login" className="block text-center py-2.5 rounded-xl border border-white/10 text-sm font-medium text-zinc-300 hover:bg-white/5 transition-all">
                Start Testing
              </Link>
            </div>

            {/* Growth — featured */}
            <div className="relative bg-gradient-to-b from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-2xl p-8 shadow-[0_0_60px_rgba(99,102,241,0.1)]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-indigo-500 rounded-full text-xs font-semibold text-white">Most Popular</div>
              <div className="text-sm font-medium text-indigo-300 mb-2">Growth</div>
              <div className="text-4xl font-bold text-white mb-1">1.5%</div>
              <div className="text-sm text-zinc-500 mb-8">Per transaction</div>
              <ul className="space-y-3 text-sm text-zinc-300 mb-8">
                {["Everything in Sandbox", "Live transactions", "Hosted checkout pages", "Webhook retry engine", "Priority support"].map((f) => (
                  <li key={f} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />{f}</li>
                ))}
              </ul>
              <Link href="/login" className="block text-center py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95">
                Get Started
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all">
              <div className="text-sm font-medium text-zinc-400 mb-2">Enterprise</div>
              <div className="text-4xl font-bold text-white mb-1">Custom</div>
              <div className="text-sm text-zinc-500 mb-8">Volume discounts</div>
              <ul className="space-y-3 text-sm text-zinc-400 mb-8">
                {["Everything in Growth", "Dedicated account manager", "Custom SLA", "On-premise deployment", "White-label checkout"].map((f) => (
                  <li key={f} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />{f}</li>
                ))}
              </ul>
              <Link href="mailto:enterprise@afripay.dev" className="block text-center py-2.5 rounded-xl border border-white/10 text-sm font-medium text-zinc-300 hover:bg-white/5 transition-all">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA SECTION ═══════════════ */}
      <section className="relative z-10 py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Ready to accept payments across Africa?
          </h2>
          <p className="text-zinc-400 mb-10 text-lg">
            Join developers who are building the future of African fintech with AfriDevPay.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="group flex items-center gap-2 bg-white text-black font-semibold px-8 py-3.5 rounded-xl hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95">
              Create Free Account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="https://github.com/90fermat/afripay" target="_blank" className="flex items-center gap-2 text-zinc-400 font-medium px-8 py-3.5 rounded-xl border border-white/10 hover:bg-white/5 hover:text-white transition-all">
              <GithubIcon />
              Star on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.png" alt="AfriDevPay" className="w-6 h-6 rounded-md object-cover" />
                <span className="font-bold text-sm">AfriDevPay</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                The unified payment API for African mobile money. Open source and community-driven.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/docs/api-reference" className="hover:text-white transition-colors">API Reference</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-4">Developers</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><a href="https://github.com/90fermat/afripay" target="_blank" className="hover:text-white transition-colors">GitHub</a></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">Getting Started</Link></li>
                <li><Link href="/docs/webhooks" className="hover:text-white transition-colors">Webhooks</Link></li>
                <li><Link href="/docs/checkout" className="hover:text-white transition-colors">Hosted Checkout</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="mailto:support@afripay.dev" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-white/5">
            <p className="text-xs text-zinc-600">&copy; 2026 AfriDevPay. Open source under the MIT License.</p>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <a href="https://github.com/90fermat/afripay" target="_blank" className="text-zinc-600 hover:text-white transition-colors"><GithubIcon /></a>
              <a href="#" className="text-zinc-600 hover:text-white transition-colors"><TwitterIcon /></a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
