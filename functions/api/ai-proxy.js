/**
 * Cloudflare Pages Function — /api/ai-proxy
 * Proxies requests to Groq. The GROQ_API_KEY never leaves the server.
 *
 * Expected request body:
 * {
 *   messages: [{ role: 'user'|'assistant'|'system', content: string }]
 *   systemPrompt?: string
 *   maxTokens?: number
 * }
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const DEFAULT_MODEL = 'llama3-8b-8192'
const DEFAULT_MAX_TOKENS = 1000

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export async function onRequestPost(context) {
  const { request, env } = context

  // Validate API key is configured
  if (!env.GROQ_API_KEY) {
    return json({ error: 'AI proxy not configured.' }, 500)
  }

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400)
  }

  const { messages, systemPrompt, maxTokens } = body

  if (!Array.isArray(messages) || messages.length === 0) {
    return json({ error: '`messages` array is required.' }, 400)
  }

  const payload = {
    model:      DEFAULT_MODEL,
    max_tokens: maxTokens ?? DEFAULT_MAX_TOKENS,
    messages:   systemPrompt
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : messages,
  }

  try {
    const groqRes = await fetch(GROQ_API_URL, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${env.GROQ_API_KEY}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await groqRes.json()

    if (!groqRes.ok) {
      console.error('Groq error:', data)
      return json({ error: data?.error?.message ?? 'AI request failed.' }, groqRes.status)
    }

    return json({ content: data.choices?.[0]?.message?.content ?? '' }, 200)
  } catch (err) {
    console.error('Proxy fetch error:', err)
    return json({ error: 'Failed to reach AI service.' }, 502)
  }
}

/**
 * @param {unknown} data
 * @param {number} status
 */
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
}
