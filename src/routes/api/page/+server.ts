import { type Entry } from '$lib/utils';

export async function GET({ platform, url }) {
	const pageNumber = url.searchParams.get('page-number');
	if (!pageNumber) {
		return new Response('Page number not provided', { status: 400 });
	}

	const parsed = parseInt(pageNumber);
	if (parsed < 1 || parsed > 1_539) {
		return new Response('Invalid page number', { status: 400 });
	}

	const sql = 'SELECT * FROM entries WHERE page = ?';
	const stmt = platform!.env.DB.prepare(sql).bind(parsed);

	const { results } = await stmt.all<Entry>();
	if (results.length === 0) {
		return new Response('No entries found for this page number', { status: 404 });
	}

	return new Response(JSON.stringify(results));
}
