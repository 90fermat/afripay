"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { loginAction } from "../actions"
import { useActionState } from "react"

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <main className="font-sans flex min-h-screen flex-col items-center justify-center p-4 bg-[#030712] text-zinc-50 relative overflow-hidden">
      
      {/* Immersive Glowing Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-indigo-600/30 blur-[140px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] bg-blue-900/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[20vw] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="z-10 w-full max-w-sm mt-[-5vh]">
        <div className="text-center mb-8 space-y-3">
          <Link href="/" className="inline-flex items-center justify-center p-2 bg-white/5 rounded-2xl border border-white/10 shadow-2xl mb-2 backdrop-blur-xl">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-400 shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            AfriDevPay
          </h1>
          <p className="text-sm font-medium text-zinc-400 tracking-wide uppercase">Merchant Gateway</p>
        </div>

        <Card className="border border-white/10 bg-black/40 backdrop-blur-3xl shadow-2xl overflow-hidden rounded-2xl">
          {/* Subtle top highlight */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
          
          <CardHeader className="space-y-2 pt-8 pb-6">
            <CardTitle className="text-2xl font-semibold tracking-tight text-center text-white">Welcome back</CardTitle>
            <CardDescription className="text-center text-zinc-400 text-sm">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <form action={formAction}>
            <CardContent className="space-y-5 px-8">
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Email Address</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  defaultValue="developer@example.com"
                  placeholder="developer@example.com" 
                  className="h-11 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:border-indigo-500/50 rounded-xl transition-all" 
                />
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Password</Label>
                  <Link href="#" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                    Forgot?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  name="password"
                  type="password" 
                  defaultValue="password"
                  placeholder="••••••••"
                  className="h-11 bg-white/5 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:border-indigo-500/50 rounded-xl transition-all font-mono" 
                />
              </div>

              {state?.error && (
                <div className="text-sm font-medium text-rose-500 bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg">
                  {state.error}
                </div>
              )}
            </CardContent>
            <CardFooter className="pb-8 pt-2 px-8">
              <Button disabled={isPending} type="submit" className="w-full h-11 bg-white hover:bg-zinc-200 text-black font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                {isPending ? "Signing In..." : "Sign In to Dashboard"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <p className="text-center mt-8 text-sm text-zinc-500">
          Don't have an account? <Link href="#" className="text-white font-medium hover:underline">Apply for access</Link>
        </p>
      </div>
    </main>
  )
}
