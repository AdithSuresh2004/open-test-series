export async function getJSON(path, { query, headers = {}, timeout = 10000, signal } = {}) {
	const url = query ? `${path}${path.includes('?') ? '&' : '?'}${new URLSearchParams(query)}` : path

	const controller = new AbortController()
	const timeoutId = timeout ? setTimeout(() => controller.abort(new Error('Request timed out')), timeout) : null
	const finalSignal = signal ?? controller.signal

	let res
	try {
		res = await fetch(url, {
			headers: { Accept: 'application/json', ...headers },
			signal: finalSignal,
		})
	} catch (err) {
		if (timeoutId) clearTimeout(timeoutId)
		throw new Error(`Network error for ${url}: ${err.message}`)
	}

	if (timeoutId) clearTimeout(timeoutId)

	let data
	const text = await res.text().catch(() => '')
	if (text) {
		try {
			data = JSON.parse(text)
		} catch {
			// non-JSON fallback
			data = text
		}
	}

	if (!res.ok) {
		const err = new Error(`HTTP ${res.status} ${res.statusText} for ${url}`)
		err.status = res.status
		err.data = data
		throw err
	}

	return typeof data === 'string' ? { raw: data } : data
}
