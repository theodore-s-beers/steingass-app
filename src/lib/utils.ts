export interface Entry {
	id: number;
	page: number;
	lang: string;
	headword_full: string;
	headword_persian: string;
	abjad: number;
	headword_latin: string;
	definitions: string;
}

export async function fetchHints(term: string): Promise<string[]> {
	try {
		const res = await fetch('/api/hints?' + new URLSearchParams({ term }));
		if (!res.ok) {
			throw new Error(`Failed query: ${res.status}`);
		}

		const data: string[] = await res.json();
		return data;
	} catch (err) {
		console.error(err);
	}

	return [];
}

export function normalize(input: string): string {
	const reK = /\u0643/gu;
	const perK = '\u06A9';

	const reY = /[\u0649\u064A]/gu;
	const perY = '\u06CC';

	const reApos = /\u0027/gu;
	const rQuo = '\u2019';

	return input.replaceAll(reK, perK).replaceAll(reY, perY).replaceAll(reApos, rQuo);
}
