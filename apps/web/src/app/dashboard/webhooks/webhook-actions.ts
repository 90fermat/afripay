"use server"

import { fetchApi } from "@/lib/api";

export async function updateWebhookAction(url: string, secret: string) {
  await fetchApi("/dashboard/webhook", {
    method: "PUT",
    body: JSON.stringify({ webhookUrl: url, webhookSecret: secret })
  });
}

export async function getWebhookLogs(page: number = 0, size: number = 20) {
  return await fetchApi(`/dashboard/webhook/logs?page=${page}&size=${size}`, {
    method: "GET",
  });
}

