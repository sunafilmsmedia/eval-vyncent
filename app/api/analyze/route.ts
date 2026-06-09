import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { computeScoring } from "@/lib/scoring";
import { buildFallbackReport } from "@/lib/fallbackReport";
import type { AnalyzeResponse, Answers, Report } from "@/lib/types";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `Tu es un expert en immobilier résidentiel québécois (région de l'Outaouais) qui rédige un rapport personnalisé, honnête et rassurant pour un propriétaire qui se demande si le moment est favorable pour vendre.

Ton ton : chaleureux, professionnel, en français (tutoiement neutre), jamais alarmiste, jamais commercial.

Tu reçois les réponses du formulaire, un score calculé (0-100) et les facteurs détectés. Tu dois produire un rapport JSON STRICTEMENT au format demandé. Ne dévie pas du schéma.

Règles clés :
- Si le verdict est "defavorable", reconnais-le clairement et propose un plan d'attente constructif (ne pousse pas la vente).
- Si "moyen", nuance — propose des optimisations préalables.
- Si "favorable", confirme avec une raison concrète et propose des étapes claires.
- "marketInsight" : une donnée plausible sur le marché immobilier de l'Outaouais (sans inventer de chiffres précis impossibles à vérifier).
- "steps" : exactement 4 étapes courtes et actionnables.
- "stats" : exactement 4 entrées. La 1ère est toujours le score. Utilise les chiffres fournis pour les autres.
- Pas de markdown, pas d'emojis, pas de formules creuses.`;

function extractJson(text: string): unknown {
  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch {
    // fallthrough
  }
  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
  return null;
}

function isValidReport(r: unknown): r is Report {
  if (!r || typeof r !== "object") return false;
  const x = r as Record<string, unknown>;
  return (
    typeof x.headline === "string" &&
    typeof x.summary === "string" &&
    Array.isArray(x.stats) &&
    x.stats.length >= 3 &&
    Array.isArray(x.steps) &&
    x.steps.length >= 3 &&
    typeof x.marketInsight === "string"
  );
}

export async function POST(req: Request) {
  let body: { answers?: Answers };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const answers = body.answers ?? {};
  const scoring = computeScoring(answers);
  const fallback = buildFallbackReport(answers, scoring);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const payload: AnalyzeResponse = {
      scoring,
      report: fallback,
      generatedBy: "fallback",
    };
    return NextResponse.json(payload);
  }

  try {
    const client = new Anthropic({ apiKey });
    const userMessage = {
      answers,
      scoring,
      fallbackHints: {
        headline: fallback.headline,
        marketInsight: fallback.marketInsight,
      },
      requiredSchema: {
        headline: "phrase d'accroche, 1 ligne",
        summary: "résumé, 2-3 phrases",
        stats: [
          { label: "Score d'opportunité", value: `${scoring.score}/100`, detail: "..." },
          { label: "Plus-value estimée", value: "+X%", detail: "..." },
          { label: "Années de possession", value: "X ans", detail: "..." },
          { label: "Rendement annualisé", value: "X%/an", detail: "..." },
        ],
        steps: [{ title: "...", description: "..." }],
        marketInsight: "donnée du marché immobilier pertinente",
      },
    };

    const completion = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Voici les données. Réponds uniquement avec un objet JSON valide qui respecte le schéma.\n\n${JSON.stringify(userMessage, null, 2)}`,
        },
      ],
    });

    const textBlock = completion.content.find((c) => c.type === "text");
    const text = textBlock && textBlock.type === "text" ? textBlock.text : "";
    const parsed = extractJson(text);

    if (isValidReport(parsed)) {
      const payload: AnalyzeResponse = {
        scoring,
        report: parsed,
        generatedBy: "claude",
      };
      return NextResponse.json(payload);
    }
  } catch (err) {
    console.error("[analyze] Claude error", err);
  }

  const payload: AnalyzeResponse = {
    scoring,
    report: fallback,
    generatedBy: "fallback",
  };
  return NextResponse.json(payload);
}
