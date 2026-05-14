export const dynamic = 'force-dynamic';

import { fetchApi } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, ArrowRight, ArrowUpRight, Search, FileDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = searchParams.page ? parseInt(searchParams.page) : 0;
  
  let transactionsResult;
  try {
    transactionsResult = await fetchApi(`/dashboard/transactions?page=${page}&size=10`);
  } catch (e) {
    console.error("Failed to fetch transactions", e);
    transactionsResult = { content: [], totalPages: 0, page: 0 };
  }

  const transactions = transactionsResult.content || [];
  const totalPages = transactionsResult.totalPages || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'PENDING': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'FAILED': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'REFUNDED': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Transactions</h1>
          <p className="text-zinc-400">View and manage your payment history.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input 
              placeholder="Search by reference..." 
              className="pl-9 bg-black/40 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500"
            />
          </div>
          <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card className="border-white/10 bg-black/40 backdrop-blur-3xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-zinc-400 font-medium">Ref / ID</TableHead>
                <TableHead className="text-zinc-400 font-medium">Customer</TableHead>
                <TableHead className="text-zinc-400 font-medium">Amount</TableHead>
                <TableHead className="text-zinc-400 font-medium">Provider</TableHead>
                <TableHead className="text-zinc-400 font-medium">Date</TableHead>
                <TableHead className="text-zinc-400 font-medium text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow className="border-white/10 hover:bg-white/5 transition-colors">
                  <TableCell colSpan={6} className="h-32 text-center text-zinc-500">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx: any) => (
                  <TableRow key={tx.id.value} className="border-white/10 hover:bg-white/5 transition-colors">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-zinc-200">{tx.externalRef}</span>
                        <span className="text-xs text-zinc-500 font-mono truncate max-w-[120px]">{tx.id.value}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-300">{tx.phoneNumber}</TableCell>
                    <TableCell className="font-medium text-white">
                      {tx.amount.currencyCode} {(tx.amount.amountMinorUnits / 100).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-zinc-400">{tx.provider}</TableCell>
                    <TableCell className="text-zinc-400 text-sm">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className={getStatusColor(tx.status)}>
                        {tx.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          Showing page <span className="font-medium text-zinc-300">{page + 1}</span> of{" "}
          <span className="font-medium text-zinc-300">{Math.max(1, totalPages)}</span>
        </p>
        <div className="flex gap-2">
          {page > 0 ? (
            <Link href={`/dashboard/transactions?page=${page - 1}`} className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium border border-white/10 bg-black/40 text-white hover:bg-white/10 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Prev
            </Link>
          ) : (
            <Button variant="outline" size="sm" className="border-white/10 bg-black/40 text-white" disabled>
              <ArrowLeft className="h-4 w-4 mr-1" /> Prev
            </Button>
          )}
          {page < totalPages - 1 ? (
            <Link href={`/dashboard/transactions?page=${page + 1}`} className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium border border-white/10 bg-black/40 text-white hover:bg-white/10 transition-colors">
              Next <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Button variant="outline" size="sm" className="border-white/10 bg-black/40 text-white" disabled>
              Next <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
