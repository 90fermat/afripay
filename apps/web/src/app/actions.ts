"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function loginAction(formData: FormData) {
  const email = formData.get("email")?.toString() || "developer@example.com";
  const password = formData.get("password")?.toString() || "password";
  let isSuccess = false;

  try {
    const res = await fetch("http://localhost:8080/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      if (data.token) {
        cookies().set("auth_token", data.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7 // 1 week
        });
        isSuccess = true;
      }
    }
  } catch (err) {
    console.error("Login failed:", err);
    return { error: "Server connection failed. Is the API running?" };
  }

  if (isSuccess) {
    redirect("/dashboard");
  }
  
  return { error: "Failed to authenticate" };
}
