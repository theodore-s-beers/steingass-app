import { env } from "cloudflare:workers";
import { MAX_ENTRY_ID } from "#lib/constants.ts";
import { type Entry } from "#lib/utils.ts";
import type { RequestEvent } from "./$types";

export async function GET({ url }: RequestEvent) {
	const id = url.searchParams.get("id");
	if (!id) {
		return new Response("Entry ID not provided", { status: 400 });
	}

	const parsed = Number(id);
	if (!Number.isInteger(parsed) || parsed < 1 || parsed > MAX_ENTRY_ID) {
		return new Response("Invalid entry ID", { status: 400 });
	}

	const sql = "SELECT * FROM entries WHERE id = ?";
	const stmt = env.DB.prepare(sql).bind(parsed);

	const result = await stmt.first<Entry>();
	if (!result) {
		return new Response("No entry found for this ID", { status: 404 });
	}

	return Response.json(result);
}
