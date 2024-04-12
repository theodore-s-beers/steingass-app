import { type Entry, toPlain } from '$lib/utils';

export async function GET({ platform, url }) {
	const valueParam = url.searchParams.get('value');
	const plainText = url.searchParams.get('plain-text');

	if (!valueParam) {
		return new Response('Abjad value not provided', { status: 400 });
	}

	const value = parseInt(valueParam);
	if (value < 1 || value > 3_500) {
		return new Response('Abjad value out of scope', { status: 400 });
	}

	const sql = 'SELECT * FROM entries WHERE abjad = ?';
	const stmt = platform!.env.DB.prepare(sql).bind(value);
	const { results } = await stmt.all<Entry>();

	if (results.length === 0) {
		return new Response('No results found', { status: 404 });
	}

	if (plainText === 'true') {
		return new Response(toPlain(results));
	}

	return new Response(JSON.stringify(results));
}
