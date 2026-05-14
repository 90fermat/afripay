export const dynamic = 'force-dynamic';

import { fetchApi } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import WebhookForm from "./webhook-form"
import { getWebhookLogs } from "./webhook-actions"
import WebhookLogsTable from "./webhook-logs-table"

export default async function WebhooksPage() {
  let webhookConfig = { webhookUrl: "", webhookSecret: "" };
  let logsData = { content: [], page: 0, size: 20, totalElements: 0, totalPages: 0 };

  try {
    webhookConfig = await fetchApi("/dashboard/webhook");
  } catch (e) {
    console.error("Failed to fetch webhook config", e);
  }

  try {
    logsData = await getWebhookLogs(0, 20);
  } catch (e) {
    console.error("Failed to fetch webhook logs", e);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Webhooks</h1>
        <p className="text-zinc-400">Configure where we should send event notifications.</p>
      </div>

      <Card className="border-white/10 bg-black/40 backdrop-blur-3xl">
        <CardHeader>
          <CardTitle className="text-white">Endpoint Details</CardTitle>
          <CardDescription className="text-zinc-400">
            Listen for events on your AfriDevPay account so your integration can automatically trigger reactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WebhookForm 
            initialUrl={webhookConfig.webhookUrl} 
            initialSecret={webhookConfig.webhookSecret} 
          />
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/40 backdrop-blur-3xl">
        <CardHeader>
          <CardTitle className="text-white">Recent Deliveries</CardTitle>
          <CardDescription className="text-zinc-400">
            View the status and payload of recent webhook delivery attempts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WebhookLogsTable initialData={logsData} />
        </CardContent>
      </Card>
      
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <h3 className="text-blue-400 font-semibold mb-2">Security Best Practices</h3>
        <ul className="list-disc list-inside text-sm text-blue-300/80 space-y-1">
          <li>Always verify the <code className="bg-blue-500/20 px-1 rounded">X-AfriPay-Signature</code> header.</li>
          <li>Use HTTPS endpoints to prevent man-in-the-middle attacks.</li>
          <li>Acknowledge events immediately with a 2xx status code.</li>
        </ul>
      </div>
    </div>
  )
}

