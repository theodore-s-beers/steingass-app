import { env } from "cloudflare:workers";
import { type Entry, toFtsQuery, toPlain } from "#lib/utils.ts";
import type { RequestEvent } from "./$types";

interface IdEntry {
	rowid: number;
}

export async function GET({ url }: RequestEvent) {
	// Get query parameters
	const field = url.searchParams.get("field");
	const matchType = url.searchParams.get("match-type");
	const term = url.searchParams.get("term");
	const plainText = url.searchParams.get("plain-text");

	// If any parameters are missing, return 400
	if (!field || !matchType || !term) {
		return new Response("Incomplete input", { status: 400 });
	}

	const table = parseField(field);
	if (!table) {
		return new Response("Invalid search field", { status: 400 });
	}

	if (!["exact", "token", "prefix"].includes(matchType)) {
		return new Response("Invalid match type", { status: 400 });
	}

	// Handle exact match query
	if (matchType === "exact") {
		if (field !== "headword_persian") {
			return new Response("Invalid combination of options", { status: 400 });
		}

		const sql = "SELECT * FROM entries WHERE headword_persian = ?";
		const stmt = env.DB.prepare(sql).bind(term);
		const { results } = await stmt.all<Entry>();

		if (results.length === 0) {
			return new Response("No results found", { status: 404 });
		}

		if (plainText === "true") {
			return new Response(toPlain(results));
		}

		return Response.json(results);
	}

	// Prepare for FTS query
	const termParsed = toFtsQuery(term, matchType === "prefix");
	if (!termParsed) {
		return new Response("No search term provided", { status: 400 });
	}

	// Limit to 50 already in the first query
	const ftSql = `SELECT ROWID FROM ${table} WHERE ${table} MATCH ? LIMIT 50`;
	const ftStmt = env.DB.prepare(ftSql).bind(termParsed);
	const ftResult = await ftStmt.all<IdEntry>();

	const ids = ftResult.results.map((row) => row.rowid);
	if (ids.length === 0) {
		return new Response("No results found", { status: 404 });
	}

	// Create comma-separated list of question marks for query binding
	// Yeah, this is janky as hell, but it works
	const questionMarks = ids.map(() => "?").join(", ");

	const sql = `SELECT * FROM entries WHERE id IN (${questionMarks})`;
	const stmt = env.DB.prepare(sql).bind(...ids);

	const { results } = await stmt.all<Entry>();
	if (results.length === 0) {
		return new Response("Something went wrong", { status: 500 });
	}

	// Return results in plain text if requested
	if (plainText === "true") {
		return new Response(toPlain(results));
	}

	return Response.json(results);
}

function parseField(field: string): string | undefined {
	if (field === "headword_full") {
		return "ft_hw";
	}

	if (field === "headword_persian") {
		return "ft_per";
	}

	if (field === "definitions") {
		return "ft_def";
	}

	if (field === "any") {
		return "ft_all";
	}
}
