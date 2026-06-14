import { NextResponse } from "next/server";
import { computeScoring } from "@/lib/scoring";
import { REGIONS } from "@/lib/regions";
import type { Answers, LeadPayload } from "@/lib/types";

export const runtime = "nodejs";

interface IncomingBody extends Partial<LeadPayload> {
  answers?: Answers;
}

function splitName(full: string): { firstName: string; lastName: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
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

  const { firstName, lastName } = splitName(name);
  const regionName = REGIONS.find((r) => r.id === answers.region)?.name ?? "";
  const appreciationPct = Math.round(scoring.metrics.appreciation * 1000) / 10;
  const annualizedPct = Math.round(scoring.metrics.annualizedReturn * 1000) / 10;
  const gain = (answers.estimatedValue ?? 0) - (answers.purchasePrice ?? 0);

  // Payload aplati pour faciliter le mapping dans le workflow GHL,
  // tout en gardant les données originales nestées en complément.
  const payload = {
    source: "vyncent-ledoux-app",
    receivedAt: new Date().toISOString(),

    // Contact (mapping direct vers les champs standards GHL)
    firstName,
    lastName,
    fullName: name,
    phone,
    email: email ?? "",

    // Scoring
    score: scoring.score,
    verdict: scoring.verdict,
    appreciationPct,
    annualizedReturnPct: annualizedPct,
    gainEstime: gain,

    // Détails propriété (champs personnalisés GHL faciles à mapper)
    propertyType: answers.propertyType ?? "",
    yearsOwned: answers.yearsOwned ?? 0,
    purchasePrice: answers.purchasePrice ?? 0,
    estimatedValue: answers.estimatedValue ?? 0,
    mortgageStatus: answers.mortgageStatus ?? "",
    region: regionName,
    regionId: answers.region ?? "",
    financialProfile: answers.financialProfile ?? "",
    hasChildren: answers.hasChildren ?? false,
    childrenStatus: answers.childrenStatus ?? "",
    noChildrenPlan: answers.noChildrenPlan ?? "",

    // Données brutes originales pour référence complète
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
