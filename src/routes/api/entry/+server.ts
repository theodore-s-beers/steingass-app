import { type Entry } from '$lib/utils';

export async function GET({ platform, url }) {
	const id = url.searchParams.get('id');
	if (!id) {
		return new Response('Entry ID not provided', { status: 400 });
	}

	const parsed = parseInt(id);
	if (parsed < 1 || parsed > 69_888) {
		return new Response('Invalid entry ID', { status: 400 });
	}

	const sql = 'SELECT * FROM entries WHERE id = ?';
	const stmt = platform!.env.DB.prepare(sql).bind(parsed);

	const result = await stmt.first<Entry>();
	if (!result) {
		return new Response('No entry found for this ID', { status: 404 });
	}

	return new Response(JSON.stringify(result));
}
