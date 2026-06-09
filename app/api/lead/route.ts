import { NextResponse } from "next/server";
import { computeScoring } from "@/lib/scoring";
import type { Answers, LeadPayload } from "@/lib/types";

export const runtime = "nodejs";

interface IncomingBody extends Partial<LeadPayload> {
  answers?: Answers;
}

export async function POST(req: Request) {
  let body: IncomingBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, phone, email, consent, answers } = body;

  if (!name || !phone || !consent || !answers) {
    return NextResponse.json(
      { stored: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  const scoring = computeScoring(answers);

  // Promesse critique : si verdict défavorable, on ne stocke RIEN, on ne transmet RIEN.
  if (scoring.verdict === "defavorable") {
    return NextResponse.json({
      stored: false,
      reason: "verdict_defavorable",
    });
  }

  const payload = {
    source: "vyncent-ledoux-app",
    receivedAt: new Date().toISOString(),
    lead: { name, phone, email },
    scoring: { score: scoring.score, verdict: scoring.verdict },
    answers,
  };

  const webhookUrl = process.env.CRM_WEBHOOK_URL;
  const webhookSecret = process.env.CRM_WEBHOOK_SECRET;

  if (webhookUrl) {
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (webhookSecret) headers["X-Webhook-Secret"] = webhookSecret;
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.error("[lead] Webhook returned", res.status);
      }
    } catch (err) {
      console.error("[lead] Webhook failed", err);
    }
  } else {
    console.log("[lead] Stored (no webhook configured):", JSON.stringify(payload));
  }

  return NextResponse.json({ stored: true, verdict: scoring.verdict });
}
