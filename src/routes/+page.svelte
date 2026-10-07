<script lang="ts">
	import EntryCard from "#lib/EntryCard.svelte";
	import { type Entry, fetchHints, normalize } from "#lib/utils.ts";
	import { onMount } from "svelte";
	import { resolve } from "$app/paths";

	const title = "Steingass Persian-English Dictionary";

	let field = $state("headword_persian");
	let matchType = $state("exact");
	let term = $state("");

	let loading = $state(false);
	let results: Entry[] = $state([]);
	let apiLink = $state("");

	let hints: string[] = $state([]);
	let queryRequest = 0;
	let hintsRequest = 0;
	let debounce: number;

	function reconcile() {
		if (field !== "headword_persian" && matchType === "exact") {
			matchType = "token";
		}

		if (field !== "headword_persian" || matchType !== "exact") {
			hintsRequest++;
			clearTimeout(debounce);
			hints = [];
		}
	}

	function handleInput() {
		const request = ++hintsRequest;
		clearTimeout(debounce);
		hints = [];

		if (!term || field !== "headword_persian" || matchType !== "exact") {
			return;
		}

		debounce = window.setTimeout(async () => {
			term = normalize(term);
			const newHints = await fetchHints(term);
			if (request === hintsRequest) {
				hints = newHints;
			}
		}, 400);
	}

	async function query() {
		const request = ++queryRequest;
		loading = true;
		results = [];
		apiLink = "";

		term = normalize(term);
		const queryUrl =
			"/api/entries?" + new URLSearchParams({ field, "match-type": matchType, term });

		try {
			localStorage.setItem("steingassFieldV1", field);
			localStorage.setItem("steingassVerbV1", matchType);
			localStorage.setItem("steingassTermV1", term);
		} catch {
			// Saving prefs is best-effort
		}

		try {
			const res = await fetch(queryUrl);
			if (!res.ok) {
				throw new Error(`Failed query: ${res.status}`);
			}

			const data: Entry[] = await res.json();
			if (request === queryRequest) {
				results = data;
				apiLink = queryUrl + "&plain-text=true";
			}
		} catch (err) {
			console.error(err);
		} finally {
			if (request === queryRequest) {
				loading = false;
			}
		}
	}

	function clear() {
		queryRequest++;
		hintsRequest++;
		clearTimeout(debounce);
		term = "";
		results = [];
		apiLink = "";
		hints = [];
		loading = false;

		try {
			localStorage.removeItem("steingassTermV1");
		} catch {
			// Current search is cleared even if the saved term can't be removed
		}
	}

	onMount(() => {
		try {
			field = localStorage.getItem("steingassFieldV1") || field;
			matchType = localStorage.getItem("steingassVerbV1") || matchType;
			term = localStorage.getItem("steingassTermV1") || term;
		} catch {
			// Keep current values when saved prefs are unavailable
		}

		if (term) query();
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:url" content="https://steingass.theobeers.com/" />
	<meta name="twitter:title" content={title} />
</svelte:head>

<div class="mb-3 flex justify-end">
	<a href={resolve("/about")} class="text-blue-700 hover:underline">About</a>
</div>

<h1 class="mb-5 text-4xl">{title}</h1>

<hr class="my-4 border border-dashed border-gray-400" />

<div class="mb-4 flex items-center">
	<label for="field" class="mr-3 font-semibold">Field:</label>
	<select
		id="field"
		class="rounded border border-gray-500 p-2"
		bind:value={field}
		onchange={reconcile}
	>
		<option value="headword_persian">Headword (Persian)</option>
		<option value="headword_full">Headword (full)</option>
		<option value="definitions">Definition(s)</option>
		<option value="any">Any</option>
	</select>
</div>

<div class="mb-4 flex items-center">
	<label for="match-type" class="mr-3 font-semibold">Match type:</label>
	<select
		id="match-type"
		class="rounded border border-gray-500 p-2"
		bind:value={matchType}
		onchange={reconcile}
	>
		{#if field === "headword_persian"}
			<option value="exact">Exact (with suggestions)</option>
		{/if}
		<option value="token">Contains full word</option>
		<option value="prefix">Contains word prefix</option>
	</select>
</div>

<div class="mb-4 flex items-center">
	<label for="term" class="mr-3 font-semibold">Term:</label>
	<input
		type="text"
		id="term"
		list="suggestions"
		class="w-48 rounded border border-gray-500 px-2.5 py-2 font-mix leading-relaxed"
		autocomplete="off"
		autocapitalize="none"
		autocorrect="off"
		spellcheck="false"
		bind:value={term}
		oninput={handleInput}
		onkeydown={(e) => {
			if (e.key === "Enter") {
				e.currentTarget.blur();
				query();
			}
		}}
	/>
	{#if field === "headword_persian" && matchType === "exact"}
		<datalist id="suggestions">
			{#each hints as hint, i (i)}
				<option value={hint}></option>
			{/each}
		</datalist>
	{/if}
</div>

<div class="flex">
	<button onclick={query} class="mr-4 cursor-pointer rounded bg-blue-700 px-6 py-2 text-white">
		Query
	</button>
	<button onclick={clear} class="cursor-pointer rounded bg-green-700 px-6 py-2 text-white">
		Clear
	</button>
</div>

<hr class="my-4 border border-dashed border-gray-400" />

{#if loading}
	<p>Loading…</p>
{:else}
	<p><span class="font-semibold">Results:</span> {results.length}</p>

	{#if results.length === 50}
		<p><em>Limited to 50</em></p>
	{/if}

	{#if results.length > 0}
		<p>
			<a href={apiLink} target="_blank" class="text-blue-700 hover:underline">
				API link for this query
			</a>
		</p>
	{/if}
{/if}

{#each results as entry (entry.id)}
	<EntryCard {entry} />
{/each}
