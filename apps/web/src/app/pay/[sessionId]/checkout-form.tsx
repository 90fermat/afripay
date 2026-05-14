"use client"

import { useState } from "react";
import { submitCheckoutSession } from "./checkout-actions";
import { Loader2, Phone, CreditCard, ShieldCheck } from "lucide-react";

export default function CheckoutForm({ session }: { session: any }) {
  const [provider, setProvider] = useState<string>("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const majorUnits = (session.amountMinorUnits / 100).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider) {
      setError("Please select a payment provider.");
      return;
    }
    if (!phone || phone.length < 8) {
      setError("Please enter a valid mobile money number.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const result = await submitCheckoutSession(session.id, provider, phone);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        // Automatically redirect after 3 seconds
        setTimeout(() => {
          window.location.href = session.returnUrl;
        }, 3000);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md w-full bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl text-center shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-500/10 animate-pulse" />
        <div className="relative z-10">
          <div className="w-24 h-24 mx-auto bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Payment Processing</h2>
          <p className="text-neutral-300 mb-6">
            Please check your phone and approve the USSD prompt.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-neutral-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Redirecting to merchant...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full bg-neutral-900/50 border border-white/10 backdrop-blur-2xl rounded-[2rem] shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
      
      <div className="p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-neutral-400 text-sm font-medium mb-1">Total to pay</p>
            <div className="flex items-baseline space-x-1">
              <span className="text-4xl font-bold text-white tracking-tight">{majorUnits}</span>
              <span className="text-xl font-medium text-neutral-400">{session.currencyCode}</span>
            </div>
          </div>
          <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center border border-white/10">
            <CreditCard className="w-5 h-5 text-neutral-300" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-medium text-neutral-300">Select Provider</p>
            <div className="grid grid-cols-2 gap-3">
              <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center transition-all ${provider === 'MTN_MOMO' ? 'border-yellow-400 bg-yellow-400/10 text-white' : 'border-white/10 hover:border-white/30 text-neutral-400'}`}>
                <input type="radio" name="provider" value="MTN_MOMO" className="hidden" onChange={(e) => setProvider(e.target.value)} />
                <div className="w-10 h-10 bg-yellow-400 rounded-full mb-2 flex items-center justify-center text-black font-bold text-xs">MTN</div>
                <span className="text-sm font-medium">MTN MoMo</span>
              </label>
              
              <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center transition-all ${provider === 'ORANGE_MONEY' ? 'border-orange-500 bg-orange-500/10 text-white' : 'border-white/10 hover:border-white/30 text-neutral-400'}`}>
                <input type="radio" name="provider" value="ORANGE_MONEY" className="hidden" onChange={(e) => setProvider(e.target.value)} />
                <div className="w-10 h-10 bg-orange-500 rounded-full mb-2 flex items-center justify-center text-white font-bold text-xs">OM</div>
                <span className="text-sm font-medium">Orange</span>
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-neutral-300">Mobile Money Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-neutral-500" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className="block w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="e.g. 237690000000"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !provider || !phone}
            className="w-full bg-white text-black font-semibold py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-neutral-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Pay Now"
            )}
          </button>
        </form>
      </div>

      <div className="bg-neutral-900/80 p-4 border-t border-white/5 flex items-center justify-center text-xs text-neutral-500 space-x-1">
        <ShieldCheck className="w-4 h-4" />
        <span>Secured by AfriPay</span>
      </div>
    </div>
  );
}
