export function flattenQuestions(exam) {
	if (!exam) return []

	const out = []
	const sections = Array.isArray(exam.sections) ? exam.sections : []

	const walk = (nodes, path = []) => {
		;(nodes || []).forEach((node, idx) => {
			const currentPath = [...path, node?.title || `Section ${idx + 1}`]
			if (Array.isArray(node?.questions)) {
				node.questions.forEach((q, qi) => {
					out.push({
						...q,
						sectionPath: currentPath,
						index: out.length,
						number: out.length + 1,
						localNumber: qi + 1,
					})
				})
			}
			if (Array.isArray(node?.sections)) walk(node.sections, currentPath)
		})
	}

	walk(sections)

	if (!out.length && Array.isArray(exam.questions)) {
		exam.questions.forEach((q, qi) => {
			out.push({
				...q,
				sectionPath: [],
				index: out.length,
				number: out.length + 1,
				localNumber: qi + 1,
			})
		})
	}

	return out
}