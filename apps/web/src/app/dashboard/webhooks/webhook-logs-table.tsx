"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Eye } from "lucide-react"
import { getWebhookLogs } from "./webhook-actions"

interface WebhookLog {
  id: string
  eventId: string
  payload: string
  status: string
  attempts: number
  lastHttpStatus: number | null
  nextRetryAt: string | null
  createdAt: string
  updatedAt: string
}

interface LogsData {
  content: WebhookLog[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export default function WebhookLogsTable({ initialData }: { initialData: LogsData }) {
  const [data, setData] = useState<LogsData>(initialData)
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null)
  const [loading, setLoading] = useState(false)

  const loadPage = async (page: number) => {
    setLoading(true)
    try {
      const result = await getWebhookLogs(page, data.size)
      setData(result)
    } catch (e) {
      console.error("Failed to load webhook logs", e)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString()
    } catch {
      return dateStr
    }
  }

  const formatPayload = (payload: string) => {
    try {
      return JSON.stringify(JSON.parse(payload), null, 2)
    } catch {
      return payload
    }
  }

  if (data.content.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4">
          <Eye className="w-8 h-8 text-zinc-500" />
        </div>
        <p className="text-zinc-400 text-sm">No webhook deliveries yet.</p>
        <p className="text-zinc-500 text-xs mt-1">Deliveries will appear here once a payment event is triggered.</p>
      </div>
    )
  }

  return (
    <>
      <div className={`transition-opacity ${loading ? 'opacity-50' : 'opacity-100'}`}>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-zinc-400">Event ID</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400">HTTP</TableHead>
              <TableHead className="text-zinc-400">Attempts</TableHead>
              <TableHead className="text-zinc-400">Created</TableHead>
              <TableHead className="text-zinc-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.content.map((log) => (
              <TableRow key={log.id} className="border-white/5 hover:bg-white/5">
                <TableCell className="text-white font-mono text-xs">
                  {log.eventId.substring(0, 12)}...
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      log.status === "SUCCESS"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : log.status === "PENDING"
                        ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                        : "border-rose-500/30 bg-rose-500/10 text-rose-400"
                    }
                  >
                    {log.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-300 font-mono text-sm">
                  {log.lastHttpStatus ?? "—"}
                </TableCell>
                <TableCell className="text-zinc-300 text-sm">
                  {log.attempts}/5
                </TableCell>
                <TableCell className="text-zinc-400 text-sm">
                  {formatDate(log.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => setSelectedLog(log)}
                    className="text-indigo-400 hover:text-indigo-300 transition-colors p-1 rounded-lg hover:bg-white/5"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {data.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
            <p className="text-xs text-zinc-500">
              Showing {data.page * data.size + 1}-{Math.min((data.page + 1) * data.size, data.totalElements)} of {data.totalElements}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => loadPage(data.page - 1)}
                disabled={data.page === 0}
                className="p-2 rounded-lg border border-white/10 text-zinc-400 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => loadPage(data.page + 1)}
                disabled={data.page >= data.totalPages - 1}
                className="p-2 rounded-lg border border-white/10 text-zinc-400 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="bg-neutral-900 border-white/10 max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Webhook Delivery Details</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Event ID</p>
                  <p className="text-sm text-white font-mono">{selectedLog.eventId}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Status</p>
                  <Badge
                    variant="outline"
                    className={
                      selectedLog.status === "SUCCESS"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : selectedLog.status === "PENDING"
                        ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                        : "border-rose-500/30 bg-rose-500/10 text-rose-400"
                    }
                  >
                    {selectedLog.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">HTTP Status</p>
                  <p className="text-sm text-white">{selectedLog.lastHttpStatus ?? "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Attempts</p>
                  <p className="text-sm text-white">{selectedLog.attempts} / 5</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Created</p>
                  <p className="text-sm text-white">{formatDate(selectedLog.createdAt)}</p>
                </div>
                {selectedLog.nextRetryAt && selectedLog.status === "PENDING" && (
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Next Retry</p>
                    <p className="text-sm text-yellow-400">{formatDate(selectedLog.nextRetryAt)}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs text-zinc-500 mb-2">Payload</p>
                <pre className="bg-black/50 border border-white/10 rounded-xl p-4 text-xs text-emerald-300 font-mono overflow-x-auto whitespace-pre-wrap">
                  {formatPayload(selectedLog.payload)}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
