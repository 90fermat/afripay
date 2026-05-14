"use server"

import { fetchApi } from "@/lib/api";

export async function rollKeyAction(environment: string) {
  return await fetchApi("/dashboard/api-keys/roll", {
    method: "POST",
    body: JSON.stringify({ environment })
  });
}
