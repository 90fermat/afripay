"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Check, Copy, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { rollKeyAction } from "./api-key-actions"

export default function RollKeyButton({ environment, hasKey }: { environment: string, hasKey: boolean }) {
  const [isRolling, setIsRolling] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)

  const handleRoll = async () => {
    setIsRolling(true)
    try {
      const res = await rollKeyAction(environment)
      if (res.rawKey) {
        setNewKey(res.rawKey)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsRolling(false)
    }
  }

  const handleCopy = () => {
    if (newKey) {
      navigator.clipboard.writeText(newKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClose = () => {
    setOpen(false)
    if (newKey) {
      window.location.reload()
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val && newKey) {
        handleClose()
      } else {
        setOpen(val)
      }
    }}>
      <DialogTrigger>
        <Button 
          variant="outline" 
          className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border-white/10 text-white"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {hasKey ? "Roll Key" : "Generate Key"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-[#050B14] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>{hasKey ? "Roll API Key" : "Generate API Key"}</DialogTitle>
          <DialogDescription className="text-zinc-400">
            {hasKey 
              ? `Are you sure you want to roll your ${environment} key? The existing key will be immediately invalidated.`
              : `Generate a new ${environment} key to start authenticating requests.`
            }
          </DialogDescription>
        </DialogHeader>
        
        {!newKey ? (
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" onClick={() => setOpen(false)} className="hover:bg-white/5">Cancel</Button>
            <Button 
              onClick={handleRoll} 
              disabled={isRolling}
              className={`${environment === 'LIVE' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-zinc-600 hover:bg-zinc-500'} text-white`}
            >
              {isRolling ? "Generating..." : "Confirm"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="text-sm text-rose-200">
                <p className="font-semibold text-rose-400 mb-1">Copy this key now</p>
                <p>For security reasons, you will not be able to see this key again after you close this dialog.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-3 bg-black/50 border border-white/10 rounded-lg text-sm font-mono text-emerald-400 break-all">
                {newKey}
              </code>
              <Button size="icon" variant="outline" className="h-11 w-11 shrink-0 border-white/10 hover:bg-white/10" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-zinc-300" />}
              </Button>
            </div>

            <Button className="w-full bg-white text-black hover:bg-zinc-200" onClick={handleClose}>
              I have copied the key
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
