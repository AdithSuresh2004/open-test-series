let inMemoryAttempts = []

function readLS() {
	try {
		return JSON.parse(localStorage.getItem('attempts') || '[]')
	} catch {
		return null
	}
}

function writeLS(attempts) {
	try {
		localStorage.setItem('attempts', JSON.stringify(attempts))
		return true
	} catch {
		return false
	}
}

export function saveAttempt(attemptData) {
	const ls = typeof Storage !== 'undefined' ? readLS() : null
	if (Array.isArray(ls)) {
		ls.push(attemptData)
		if (writeLS(ls)) return
	}
	inMemoryAttempts.push(attemptData)
}

export function getAttemptsByExam(examId) {
	const ls = typeof Storage !== 'undefined' ? readLS() : null
	const source = Array.isArray(ls) ? ls : inMemoryAttempts
	return source.filter((a) => a.exam_id === examId)
}
