import React from 'react'
import { useLocation, useParams, Link } from 'react-router-dom'

export default function AttemptPage() {
	const { state } = useLocation()
	const { attemptId } = useParams()
	const exam = state?.exam
	const questions = state?.questions || []

	if (!exam) {
		return (
			<div>
				<p>Attempt data missing.</p>
				<Link to="/">Go Home</Link>
			</div>
		)
	}

	return (
		<div>
			<h1>Attempt: {exam.title || exam.name}</h1>
			<p>Attempt ID: {attemptId}</p>
			<ol className="list">
				{questions.map((q) => (
					<li key={q.number}>
						{q.number}. {q.text || q.question || 'Untitled question'}
					</li>
				))}
			</ol>
		</div>
	)
}
