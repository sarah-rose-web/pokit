/**
 * Cloudflare Pages Function — /api/fx-proxy
 * Proxies exchange rate lookups. The API key stays server-side.
 *
 * GET /api/fx-proxy?from=USD&to=PHP
 * Returns: { rate: number, from: string, to: string, timestamp: number }
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export async function onRequestGet(context) {
  const { request, env } = context

  if (!env.EXCHANGE_RATE_API_KEY) {
    return json({ error: 'Exchange rate proxy not configured.' }, 500)
  }

  const url    = new URL(request.url)
  const from   = (url.searchParams.get('from') ?? 'USD').toUpperCase()
  const to     = (url.searchParams.get('to')   ?? 'PHP').toUpperCase()

  if (from === to) {
    return json({ rate: 1, from, to, timestamp: Date.now() })
  }

  // Using exchangerate-api.com v6 — swap endpoint if you change providers
  const apiUrl = `https://v6.exchangerate-api.com/v6/${env.EXCHANGE_RATE_API_KEY}/pair/${from}/${to}`

  try {
    const res  = await fetch(apiUrl, { cf: { cacheTtl: 3600 } })  // Cache at CF edge for 1hr
    const data = await res.json()

    if (!res.ok || data.result !== 'success') {
      console.error('FX error:', data)
      return json({ error: data?.['error-type'] ?? 'Exchange rate lookup failed.' }, res.status)
    }

    return json({
      rate:      data.conversion_rate,
      from,
      to,
      timestamp: Date.now(),
    })
  } catch (err) {
    console.error('FX proxy error:', err)
    return json({ error: 'Failed to reach exchange rate service.' }, 502)
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
