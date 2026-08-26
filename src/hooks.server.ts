import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	if (!event.url.pathname.startsWith("/api/")) {
		return resolve(event);
	}

	if (event.request.method === "OPTIONS") {
		const headers = new Headers({
			"Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Max-Age": "86400",
		});
		const requestedHeaders = event.request.headers.get("Access-Control-Request-Headers");

		if (requestedHeaders) {
			headers.set("Access-Control-Allow-Headers", requestedHeaders);
			headers.set("Vary", "Access-Control-Request-Headers");
		}

		return new Response(null, { status: 204, headers });
	}

	const response = await resolve(event);
	response.headers.set("Access-Control-Allow-Origin", "*");

	return response;
};
