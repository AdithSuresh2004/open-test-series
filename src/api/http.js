export async function getJSON(path) {
	// centralize fetch with simple error handling
	const res = await fetch(path, { headers: { Accept: 'application/json' } })
	if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`)
	return res.json()
}
