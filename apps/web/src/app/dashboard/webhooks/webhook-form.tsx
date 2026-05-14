"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, Check, Copy, RefreshCw } from "lucide-react"

import { updateWebhookAction } from "./webhook-actions"

export default function WebhookForm({ 
  initialUrl, 
  initialSecret 
}: { 
  initialUrl: string, 
  initialSecret: string 
}) {
  const [url, setUrl] = useState(initialUrl);
  const [secret, setSecret] = useState(initialSecret);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateWebhookAction(url, secret);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRollSecret = () => {
    const newSecret = "whsec_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setSecret(newSecret);
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="url" className="text-sm font-medium text-zinc-300">Endpoint URL</Label>
        <Input 
          id="url"
          type="url" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://your-domain.com/webhooks/afripay" 
          className="h-11 bg-white/5 border-white/10 text-white focus-visible:ring-indigo-500"
        />
        <p className="text-xs text-zinc-500">
          HTTPS endpoints only. We will send POST requests to this URL for all payment events.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="secret" className="text-sm font-medium text-zinc-300">Signing Secret</Label>
          <Button type="button" variant="ghost" size="sm" onClick={handleRollSecret} className="h-8 px-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10">
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Roll Secret
          </Button>
        </div>
        <div className="relative">
          <Input 
            id="secret"
            type="text" 
            value={secret}
            readOnly
            className="h-11 bg-black/50 border-white/10 text-emerald-400 font-mono focus-visible:ring-0 pr-12"
          />
          <Button 
            type="button"
            size="icon"
            variant="ghost" 
            onClick={handleCopy}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-zinc-400 hover:text-white"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs text-zinc-500">
          Use this secret to verify the HMAC signature of webhook payloads.
        </p>
      </div>

      <Button type="submit" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-500 text-white">
        {isSaving ? "Saving..." : "Save Configuration"}
        {!isSaving && <Save className="ml-2 h-4 w-4" />}
      </Button>
    </form>
  )
}
