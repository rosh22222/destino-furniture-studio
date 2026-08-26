"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { createPublicSupabaseClient } from "@/lib/supabase";
import { cleanText } from "@/lib/utils";

export type LeadFormState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

const rateLimit = new Map<string, { count: number; resetAt: number }>();

const leadSchema = z.object({
  intent: z.enum(["general", "quote", "project", "location"]),
  name: z.string().min(2, "Enter your name"),
  phone: z.string().min(7, "Enter a valid phone number").max(20),
  email: z
    .string()
    .optional()
    .refine((value) => !value || z.string().email().safeParse(value).success, {
      message: "Enter a valid email address",
    }),
  company: z.string().optional(),
  location: z.string().optional(),
  message: z.string().min(10, "Add a short message").max(2000),
  sourcePath: z.string().min(1),
  products: z.array(z.string()).default([]),
  project: z.string().optional(),
});

function checkRateLimit(key: string) {
  const now = Date.now();
  const current = rateLimit.get(key);

  if (!current || current.resetAt <= now) {
    rateLimit.set(key, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return true;
  }

  if (current.count >= 5) {
    return false;
  }

  current.count += 1;
  return true;
}

async function notifyLead(payload: z.infer<typeof leadSchema>) {
  if (!process.env.ENQUIRY_WEBHOOK_URL) {
    return;
  }

  try {
    await fetch(process.env.ENQUIRY_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Notification failure should not block a valid enquiry from being stored.
  }
}

export async function submitLead(
  _previousState: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "local";

  if (!checkRateLimit(ip)) {
    return {
      ok: false,
      message: "Too many submissions. Please wait a few minutes and try again.",
    };
  }

  const parsed = leadSchema.safeParse({
    intent: cleanText(formData.get("intent")) || "general",
    name: cleanText(formData.get("name")),
    phone: cleanText(formData.get("phone")),
    email: cleanText(formData.get("email")),
    company: cleanText(formData.get("company")),
    location: cleanText(formData.get("location")),
    message: cleanText(formData.get("message")),
    sourcePath: cleanText(formData.get("sourcePath")) || "/",
    products: formData
      .getAll("products")
      .map((item) => cleanText(item))
      .filter(Boolean),
    project: cleanText(formData.get("project")),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = createPublicSupabaseClient();

  if (supabase) {
    const table =
      parsed.data.intent === "quote" ? "quotation_requests" : "website_enquiries";

    const { error } = await supabase.from(table).insert({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      company: parsed.data.company || null,
      location: parsed.data.location || null,
      message: parsed.data.message,
      source_path: parsed.data.sourcePath,
      products: parsed.data.products,
      project: parsed.data.project || null,
      status: "new",
      metadata: {
        intent: parsed.data.intent,
        ip,
        userAgent: requestHeaders.get("user-agent"),
      },
    });

    if (error) {
      return {
        ok: false,
        message:
          "We could not store the enquiry right now. Please call or WhatsApp Destino directly.",
      };
    }
  }

  await notifyLead(parsed.data);

  return {
    ok: true,
    message:
      "Thank you. Your enquiry has been received and the Destino team can follow up with a quotation.",
  };
}

