import { AlertTriangle } from "lucide-react"

export const metadata = {
  title: "Errors | AfriDevPay Docs",
}

export default function ErrorsDocs() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-sm font-medium border border-rose-500/20">
          <AlertTriangle className="w-4 h-4" />
          <span>Error Handling</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white">Errors</h1>
        <p className="text-lg text-zinc-400 leading-relaxed">
          AfriDevPay uses conventional HTTP response codes to indicate the success or failure of an API request.
        </p>
      </div>

      <div className="prose prose-invert max-w-none">
        <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">HTTP Status Codes</h2>
        <p className="text-zinc-400">
          In general: Codes in the <code className="bg-white/10 px-1 rounded text-emerald-400">2xx</code> range indicate success. 
          Codes in the <code className="bg-white/10 px-1 rounded text-amber-400">4xx</code> range indicate an error that failed given the information provided (e.g., a required parameter was omitted, a charge failed, etc.). 
          Codes in the <code className="bg-white/10 px-1 rounded text-rose-400">5xx</code> range indicate an error with AfriDevPay's servers.
        </p>

        <div className="my-6 rounded-xl overflow-hidden border border-white/10">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-white/5 text-zinc-300">
              <tr>
                <th className="px-4 py-3 font-semibold w-24">Status</th>
                <th className="px-4 py-3 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-black/40">
              <tr>
                <td className="px-4 py-3 text-emerald-400 font-mono">200 - OK</td>
                <td className="px-4 py-3">Everything worked as expected.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-emerald-400 font-mono">201 - Created</td>
                <td className="px-4 py-3">The resource was created successfully.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-amber-400 font-mono">400 - Bad Request</td>
                <td className="px-4 py-3">The request was unacceptable, often due to missing a required parameter.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-amber-400 font-mono">401 - Unauthorized</td>
                <td className="px-4 py-3">No valid API key provided.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-amber-400 font-mono">404 - Not Found</td>
                <td className="px-4 py-3">The requested resource doesn't exist.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-rose-400 font-mono">500, 502, 503</td>
                <td className="px-4 py-3">Something went wrong on AfriDevPay's end. (These are rare.)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">Error Response Format</h3>
        <p className="text-zinc-400">
          When an API error occurs, we return a JSON response containing an error object to help you debug what went wrong.
        </p>

        <div className="my-6 rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0a]">
          <div className="flex items-center px-4 py-2 bg-white/5 border-b border-white/10">
            <span className="text-xs font-mono text-rose-400">400 Bad Request</span>
          </div>
          <pre className="p-4 text-sm font-mono text-zinc-300 overflow-x-auto">
{`{
  "error": {
    "code": "parameter_missing",
    "message": "The 'amount' parameter is required.",
    "param": "amount"
  }
}`}
          </pre>
        </div>
      </div>
    </div>
  )
}
