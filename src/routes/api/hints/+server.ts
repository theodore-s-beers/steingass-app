interface HeadwordEntry {
	headword_persian: string;
}

export async function GET({ platform, url }) {
	const term = url.searchParams.get("term");
	if (!term) {
		return new Response("No search term provided", { status: 400 });
	}

	const termPrefix = `${term}*`;
	const sql = "SELECT headword_persian FROM ft_per WHERE ft_per MATCH ? LIMIT 20";
	const stmt = platform!.env.DB.prepare(sql).bind(termPrefix);

	const { results } = await stmt.all<HeadwordEntry>();
	if (results.length === 0) {
		return new Response("No results found", { status: 404 });
	}

	const flattened = results.map((row) => row.headword_persian);
	const unique = [...new Set(flattened)];

	return new Response(JSON.stringify(unique));
}
