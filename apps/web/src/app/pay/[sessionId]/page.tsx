import { getCheckoutSession } from "./checkout-actions";
import CheckoutForm from "./checkout-form";
import { notFound } from "next.navigation";

export default async function CheckoutPage({ params }: { params: { sessionId: string } }) {
  const session = await getCheckoutSession(params.sessionId);

  if (!session) {
    notFound();
  }

  if (session.status !== "PENDING") {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl text-center shadow-2xl">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${session.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
            {session.status === 'COMPLETED' ? (
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Payment {session.status === 'COMPLETED' ? 'Successful' : 'Cancelled'}
          </h1>
          <p className="text-neutral-400 mb-8">
            This checkout session has already been {session.status.toLowerCase()}.
          </p>
          <a href={session.returnUrl} className="block w-full bg-white text-black font-semibold py-3 px-4 rounded-xl hover:bg-neutral-200 transition-colors">
            Return to Merchant
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] flex items-center justify-center p-4">
      <CheckoutForm session={session} />
    </div>
  );
}
