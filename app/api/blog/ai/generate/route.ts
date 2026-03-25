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
  const length = payload.length || 'medium'

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
    'You are an SEO-focused blog writer for ABA Therapy Utah.',
    'Generate a single blog post from the given title.',
    'Return ONLY valid JSON (no markdown, no code fences).',
    'contentHtml MUST be HTML (not markdown) using only these tags: p, h2, h3, ul, ol, li, blockquote, strong, em, a, br.',
    'Do NOT include <h1> (the page title is rendered outside content).',
    'Do NOT include <script>, <style>, or any JS/event handlers.',
    'The first element in contentHtml MUST be a <p> tag containing the key introductory paragraph.',
    'Include sections with h2/h3, plus: "Key Takeaways" and a "Next Steps" section with internal links to /directory, /cost-estimator, and /quiz.',
    'Optionally include a short FAQ section toward the end of the article.'
  ].join('\n')

  const userPrompt = [
    `Title: ${title}`,
    `Audience: ${audience}`,
    `Desired length: ${length} (short/medium/long)`,
    payload.category ? `Preferred category hint: ${payload.category}` : `Preferred category hint: (infer from title)`,
    '',
    'Return JSON with exactly these keys:',
    '- excerpt: a plain-text meta description, 150-170 characters, no HTML',
    '- category: one short category label (e.g., Education, Guide, Insurance, Finance, Research, Stories)',
    '- slug: kebab-case URL slug (you may use the suggested base slug if appropriate)',
    '- contentHtml: HTML string as described above'
  ].join('\n')

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      temperature: 0.7,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userPrompt },
      ],
      // Encourage JSON-only output; still validate/parse server-side.
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    return NextResponse.json(
      { error: 'OpenRouter request failed', details: text.slice(0, 500) },
      { status: 500 }
    )
  }

  const data = await response.json()
  const modelText =
    data?.choices?.[0]?.message?.content ||
    data?.choices?.[0]?.text ||
    ''

  let generated: {
    excerpt?: string
    category?: string
    slug?: string
    contentHtml?: string
  }

  try {
    generated = extractJsonFromModelText(modelText)
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to parse AI output as JSON', details: String(err) },
      { status: 500 }
    )
  }

  const excerpt = typeof generated?.excerpt === 'string' ? generated.excerpt.trim() : ''
  const category = typeof generated?.category === 'string' ? generated.category.trim() : undefined
  const contentHtmlRaw = typeof generated?.contentHtml === 'string' ? generated.contentHtml : ''
  const contentHtml = sanitizeHtml(contentHtmlRaw)

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
  })
}

