import { MAX_PAGE_NUMBER } from "#lib/constants.ts";
import { type Entry } from "#lib/utils.ts";
import type { RequestEvent } from "./$types";

export async function GET({ platform, url }: RequestEvent) {
	const pageNumber = url.searchParams.get("page-number");
	if (!pageNumber) {
		return new Response("Page number not provided", { status: 400 });
	}

	const parsed = Number(pageNumber);
	if (!Number.isInteger(parsed) || parsed < 1 || parsed > MAX_PAGE_NUMBER) {
		return new Response("Invalid page number", { status: 400 });
	}

	const sql = "SELECT * FROM entries WHERE page = ?";
	const stmt = platform!.env.DB.prepare(sql).bind(parsed);

	const { results } = await stmt.all<Entry>();
	if (results.length === 0) {
		return new Response("No entries found for this page number", { status: 404 });
	}

	return Response.json(results);
}
