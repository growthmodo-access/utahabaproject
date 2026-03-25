import { NextRequest, NextResponse } from 'next/server'
import { getBlogPosts } from '@/lib/blog-data'

type GeneratePayload = {
  title: string
  // Optional guidance hints
  audience?: 'utah-parents' | 'clinicians' | 'general'
  length?: 'short' | 'medium' | 'long'
  category?: string
}

function createSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

function isSafeExcerpt(excerpt: string) {
  // Excerpt should be plain text
  if (!excerpt) return false
  if (/<[a-z][\s\S]*>/i.test(excerpt)) return false
  return true
}

function sanitizeHtml(html: string) {
  let out = html || ''

  // Remove script/style blocks entirely
  out = out.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
  out = out.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')

  // Block inline event handlers
  out = out.replace(/\son\w+="[^"]*"/gi, '')
  out = out.replace(/\son\w+='[^']*'/gi, '')

  // Remove javascript: links
  out = out.replace(/href=['"]\s*javascript:[\s\S]*?['"]/gi, "href='#'")

  // Remove h1 to keep hierarchy consistent (title is rendered outside content)
  out = out.replace(/<\/?h1[^>]*>/gi, '')

  // Allow only a conservative set of tags (strip others, keep their inner text)
  const allowed = new Set(['p', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'strong', 'em', 'a', 'br'])
  out = out.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (full, tagName) => {
    const t = String(tagName).toLowerCase()
    return allowed.has(t) ? full : ''
  })

  return out.trim()
}

function extractJsonFromModelText(text: string) {
  // Model output is instructed to be JSON only, but this makes parsing more robust.
  const trimmed = text.trim()
  if (!trimmed) throw new Error('Empty model response')

  // If wrapped in ```json ... ```
  const fenced = trimmed.match(/```json\s*([\s\S]*?)```/i) || trimmed.match(/```\s*([\s\S]*?)```/i)
  const candidate = fenced ? fenced[1] : trimmed

  return JSON.parse(candidate)
}

function stripHtmlToText(html: string) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function countWords(text: string) {
  if (!text) return 0
  return text.split(/\s+/).filter(Boolean).length
}

const TARGET_MIN_WORDS = 900
const TARGET_MAX_WORDS = 1500
/** Retry if outside this band (slightly wider than target to allow one correction pass) */
const RETRY_BELOW = 850
const RETRY_ABOVE = 1550

export async function POST(request: NextRequest) {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
  const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini'

  if (!OPENROUTER_API_KEY) {
    return NextResponse.json({ error: 'Missing OPENROUTER_API_KEY' }, { status: 500 })
  }

  const payload = (await request.json()) as GeneratePayload
  const title = typeof payload?.title === 'string' ? payload.title.trim() : ''

  if (!title) {
    return NextResponse.json({ error: 'Missing title' }, { status: 400 })
  }

  const audience = payload.audience || 'utah-parents'

  // Fetch existing slugs so we can avoid collisions
  const existingPosts = await getBlogPosts()
  const existingSlugs = new Set(existingPosts.map((p) => p.slug))

  const baseSlug = createSlug(payload.category ? `${payload.category}-${title}` : title) || createSlug(title)

  let uniqueSlug = baseSlug
  let i = 1
  while (existingSlugs.has(uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${i}`
    i += 1
  }

  const system = [
    'You are a senior health-education writer and SEO editor for "ABA Therapy Utah" — a resource for Utah families seeking trustworthy ABA therapy information.',
    'Your writing must be accurate, empathetic, and genuinely helpful (not keyword-stuffed). Prioritize clarity, usefulness, and E-E-A-T (experience, expertise, authoritativeness, trust).',
    'Generate ONE complete blog article from the given title.',
    'Return ONLY valid JSON (no markdown, no code fences).',
    '',
    'WORD COUNT (STRICT): The article body in contentHtml must be between 900 and 1500 words inclusive when measured as plain text (strip HTML tags). Aim for ~1100–1300 words.',
    'If you are short, add substantive sections: practical guidance, Utah-specific context where relevant, common misconceptions, what to ask providers, or how to take next steps — not filler.',
    'If you are long, tighten redundant sentences; do not cut required sections.',
    '',
    'contentHtml MUST be HTML (not markdown) using only these tags: p, h2, h3, ul, ol, li, blockquote, strong, em, a, br.',
    'Do NOT include <h1> (the page title is rendered outside content).',
    'Do NOT include <script>, <style>, or any JS/event handlers.',
    'The first element in contentHtml MUST be a <p> tag with a strong opening paragraph that states who the article helps and what they will learn.',
    '',
    'Structure contentHtml with:',
    '- Multiple <h2> sections (and <h3> subsections where helpful)',
    '- At least one <ul> or <ol> list for scannable takeaways',
    '- A section titled "Key Takeaways" (h2) with concise bullets',
    '- A section titled "Next Steps" (h2) with internal links using descriptive anchor text to: /directory, /cost-estimator, /quiz',
    '- A short FAQ section (h2) with 3–5 practical Q&As (each Q as h3 or bold in a paragraph, answer in following <p>)',
    '',
    'Voice: supportive, plain language, respectful of families. Avoid hype, fear-mongering, or guarantees. Do not claim medical outcomes.',
    'Utah: when relevant, mention Utah context naturally (e.g., navigating providers, insurance considerations) without inventing specific laws or numbers you are unsure of.',
  ].join('\n')

  const buildUserPrompt = (extra?: string) =>
    [
      `Title: ${title}`,
      `Primary audience: ${audience}`,
      payload.category ? `Preferred category hint: ${payload.category}` : 'Preferred category hint: infer from the title',
      '',
      'Requirements:',
      `- Article length: ${TARGET_MIN_WORDS}–${TARGET_MAX_WORDS} words in contentHtml (plain text word count).`,
      '- excerpt: plain-text meta description, 150–170 characters, no HTML, compelling and specific to the title',
      '- category: one label (e.g., Education, Guide, Insurance, Finance, Research, Stories)',
      '- slug: kebab-case, descriptive, no stopwords spam',
      '- contentHtml: full article as specified in system instructions',
      extra || '',
      '',
      'Return JSON with exactly these keys:',
      '- excerpt',
      '- category',
      '- slug',
      '- contentHtml',
    ].join('\n')

  async function callModel(userContent: string) {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        temperature: 0.55,
        max_tokens: 6000,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: userContent },
        ],
        response_format: { type: 'json_object' },
      }),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(text.slice(0, 500) || `HTTP ${res.status}`)
    }
    const data = await res.json()
    const modelText =
      data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.text ||
      ''
    return extractJsonFromModelText(modelText)
  }

  let generated: {
    excerpt?: string
    category?: string
    slug?: string
    contentHtml?: string
  }

  try {
    generated = await callModel(buildUserPrompt())
  } catch (err) {
    return NextResponse.json(
      { error: 'OpenRouter request failed', details: String(err) },
      { status: 500 }
    )
  }

  let excerpt = typeof generated?.excerpt === 'string' ? generated.excerpt.trim() : ''
  let category = typeof generated?.category === 'string' ? generated.category.trim() : undefined
  let contentHtmlRaw = typeof generated?.contentHtml === 'string' ? generated.contentHtml : ''
  let contentHtml = sanitizeHtml(contentHtmlRaw)

  let wc = countWords(stripHtmlToText(contentHtml))

  if (wc < RETRY_BELOW || wc > RETRY_ABOVE) {
    try {
      const correction = [
        `Your previous JSON had approximately ${wc} words in contentHtml (plain text).`,
        `You MUST return revised JSON where contentHtml is between ${TARGET_MIN_WORDS} and ${TARGET_MAX_WORDS} words inclusive.`,
        wc < TARGET_MIN_WORDS
          ? 'Expand with substantive sections: practical steps, Utah-relevant guidance where appropriate, FAQs, and what families should ask providers — avoid padding and repetition.'
          : 'Shorten by removing redundancy while keeping Key Takeaways, Next Steps (with internal links), and FAQ.',
        'Keep excerpt 150–170 characters. Keep slug sensible.',
      ].join('\n')
      generated = await callModel(buildUserPrompt(correction))
      excerpt = typeof generated?.excerpt === 'string' ? generated.excerpt.trim() : excerpt
      category =
        typeof generated?.category === 'string' ? generated.category.trim() : category
      contentHtmlRaw = typeof generated?.contentHtml === 'string' ? generated.contentHtml : ''
      contentHtml = sanitizeHtml(contentHtmlRaw)
      wc = countWords(stripHtmlToText(contentHtml))
    } catch {
      // keep first draft if retry fails
    }
  }

  if (!contentHtml) {
    return NextResponse.json({ error: 'AI did not return contentHtml' }, { status: 500 })
  }

  if (!isSafeExcerpt(excerpt)) {
    return NextResponse.json({ error: 'AI excerpt must be plain text without HTML' }, { status: 500 })
  }

  // Ensure slug matches our collision-free slug suggestion
  // (We still accept AI slug if it's valid, then dedupe.)
  const aiSlug = typeof generated?.slug === 'string' ? createSlug(generated.slug) : ''
  const candidate = aiSlug || uniqueSlug
  let finalSlug = candidate
  let j = 1
  while (existingSlugs.has(finalSlug)) {
    finalSlug = `${candidate}-${j}`
    j += 1
  }

  return NextResponse.json({
    title,
    excerpt,
    category,
    slug: finalSlug,
    contentHtml,
    wordCount: wc,
  })
}

