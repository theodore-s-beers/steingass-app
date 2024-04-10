import { type Entry } from '$lib/utils';

interface IdEntry {
	rowid: number;
}

export async function GET({ platform, url }) {
	// Get query parameters
	const field = url.searchParams.get('field');
	const matchType = url.searchParams.get('match-type');
	const term = url.searchParams.get('term');

	// If any parameters are missing, return 400
	if (!field || !matchType || !term) {
		return new Response('Incomplete input', { status: 400 });
	}

	// Handle exact match query
	if (matchType === 'exact') {
		if (field !== 'headword_persian') {
			return new Response('Invalid combination of options', { status: 400 });
		}

		const sql = 'SELECT * FROM entries WHERE headword_persian = ?';
		const stmt = platform!.env.DB.prepare(sql).bind(term);
		const { results } = await stmt.all<Entry>();

		if (results.length === 0) {
			return new Response('No results found', { status: 404 });
		}

		return new Response(JSON.stringify(results));
	}

	// Prepare for FTS query
	const table = parseField(field);
	const termParsed = matchType === 'prefix' ? `${term}*` : term;

	// Limit to 50 already in the first query
	const ftSql = `SELECT ROWID FROM ${table} WHERE ${table} MATCH ? LIMIT 50`;
	const ftStmt = platform!.env.DB.prepare(ftSql).bind(termParsed);
	const ftResult = await ftStmt.all<IdEntry>();

	const ids = ftResult.results.map((row) => row.rowid);
	if (ids.length === 0) {
		return new Response('No results found', { status: 404 });
	}

	// Create comma-separated list of question marks for query binding
	// Yeah, this is janky as hell, but it works
	const questionMarks = ids.map(() => '?').join(', ');

	const sql = `SELECT * FROM entries WHERE id IN (${questionMarks})`;
	const stmt = platform!.env.DB.prepare(sql).bind(...ids);

	const { results } = await stmt.all<Entry>();
	if (results.length === 0) {
		return new Response('Something went wrong', { status: 500 });
	}

	// Return results in plain text if requested
	if (url.searchParams.get('plain-text') === 'true') {
		return new Response(toPlain(results));
	}

	return new Response(JSON.stringify(results));
}

function parseField(field: string): string {
	if (field === 'headword_full') {
		return 'ft_hw';
	}

	if (field === 'headword_persian') {
		return 'ft_per';
	}

	if (field === 'definitions') {
		return 'ft_def';
	}

	return 'ft_all';
}

function toPlain(input: Entry[]): string {
	let output = '';

	for (let i = 0; i < input.length; i++) {
		for (const [key, value] of Object.entries(input[i])) {
			output += `${key}: ${value}\n`;
		}

		if (i < input.length - 1) {
			output += '\n';
		}
	}

	return output;
}
