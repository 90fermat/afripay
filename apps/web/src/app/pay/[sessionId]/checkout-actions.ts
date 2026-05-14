"use server"

import { fetchApi } from "@/lib/api";

export async function getCheckoutSession(sessionId: string) {
  try {
    const response = await fetchApi(`/checkout/session/${sessionId}`, {
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch checkout session:", error);
    return null;
  }
}

export async function submitCheckoutSession(sessionId: string, provider: string, phoneNumber: string) {
  return await fetchApi(`/checkout/session/${sessionId}/submit`, {
    method: "POST",
    body: JSON.stringify({ provider, phoneNumber }),
  });
}
