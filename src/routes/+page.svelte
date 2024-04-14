<script lang="ts">
	import { type Entry, fetchHints, normalize } from '$lib/utils';
	import { marked } from 'marked';
	import { onMount } from 'svelte';

	const title = 'Steingass Persian-English Dictionary';

	let field = 'headword_persian';
	let matchType = 'exact';
	let term = '';

	$: if (matchType === 'exact' && field !== 'headword_persian') matchType = 'token';

	let loading = false;
	let results: Entry[] = [];

	let hints: string[] = [];
	$: if (field !== 'headword_persian' || matchType !== 'exact') hints = [];

	let debounce: number;

	function handleInput() {
		clearTimeout(debounce);

		if (field !== 'headword_persian' || matchType !== 'exact') {
			return;
		}

		debounce = window.setTimeout(async () => {
			term = normalize(term);
			const newHints = await fetchHints(term);
			hints = newHints;
		}, 400);
	}

	async function query() {
		loading = true;
		results = [];

		term = normalize(term);

		localStorage.setItem('steingassFieldV1', field);
		localStorage.setItem('steingassVerbV1', matchType);
		localStorage.setItem('steingassTermV1', term);

		try {
			const res = await fetch(
				'/api/entries?' + new URLSearchParams({ field, 'match-type': matchType, term })
			);
			if (!res.ok) {
				throw new Error(`Failed query: ${res.status}`);
			}

			const data: Entry[] = await res.json();
			results = data;
		} catch (err) {
			console.error(err);
		} finally {
			loading = false;
		}
	}

	function clear() {
		term = '';
		localStorage.removeItem('steingassTermV1');
		results = [];
		hints = [];
		loading = false;
	}

	onMount(() => {
		field = localStorage.getItem('steingassFieldV1') || field;
		matchType = localStorage.getItem('steingassVerbV1') || matchType;
		term = localStorage.getItem('steingassTermV1') || term;

		if (term) query();
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta
		name="description"
		content="Improved digitized version of Francis Joseph Steingass’ “Comprehensive Persian-English Dictionary”"
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://steingass.theobeers.com/" />
	<meta property="og:image" content="https://steingass.theobeers.com/og.jpg" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
</svelte:head>

<h1 class="mb-5 text-4xl">{title}</h1>

<hr class="my-4 border border-dashed border-gray-400" />

<div class="mb-4 flex items-center">
	<label for="field" class="mr-3 font-semibold">Field:</label>
	<select id="field" class="rounded border p-2" bind:value={field}>
		<option value="headword_persian">Headword (Persian)</option>
		<option value="headword_full">Headword (full)</option>
		<option value="definitions">Definition(s)</option>
		<option value="any">Any</option>
	</select>
</div>

<div class="mb-4 flex items-center">
	<label for="match-type" class="mr-3 font-semibold">Match type:</label>
	<select id="match-type" class="rounded border p-2" bind:value={matchType}>
		{#if field === 'headword_persian'}
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
		class="w-48 rounded border px-2.5 py-2 font-mix leading-relaxed"
		autocomplete="off"
		autocapitalize="none"
		autocorrect="off"
		spellcheck="false"
		bind:value={term}
		on:input={handleInput}
		on:keydown={(e) => {
			if (e.key === 'Enter') {
				e.currentTarget.blur();
				query();
			}
		}}
	/>
	{#if field === 'headword_persian' && matchType === 'exact'}
		<datalist id="suggestions">
			{#each hints as hint}
				<option value={hint} />
			{/each}
		</datalist>
	{/if}
</div>

<div class="flex">
	<button on:click={query} class="mr-4 rounded bg-blue-700 px-6 py-2 text-white">Query</button>
	<button on:click={clear} class="rounded bg-green-700 px-6 py-2 text-white">Clear</button>
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
			<a
				href={'/api/entries?' +
					new URLSearchParams({ field, 'match-type': matchType, term, 'plain-text': 'true' })}
				target="_blank"
				class="text-blue-700 hover:underline">API link for this query</a
			>
		</p>
	{/if}
{/if}

{#each results as entry}
	<div
		class="my-4 grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 rounded-md border-2 border-dashed border-blue-700/50 p-4"
	>
		<div class="font-semibold">ID</div>
		<div><a href={'/entry/' + entry.id} class="text-blue-700 hover:underline">{entry.id}</a></div>

		<div class="font-semibold">Page</div>
		<div>
			<a href={'/page/' + entry.page} class="text-blue-700 hover:underline">{entry.page}</a>
			(<a
				href={`/page-img/${entry.page.toString().padStart(4, '0')}.jpg`}
				target="_blank"
				class="text-blue-700 hover:underline">Page image</a
			>)
		</div>

		<div class="font-semibold">Etym.</div>
		<div>{entry.lang}</div>

		<div class="font-semibold">HW (full)</div>
		<div class="font-mix">{@html marked.parseInline(entry.headword_full)}</div>

		<div class="font-semibold">HW (Per.)</div>
		<div class="font-mix">{entry.headword_persian}</div>

		<div class="font-semibold">Abjad</div>
		<div>
			<a href={`/abjad/${entry.abjad}`} class="text-blue-700 hover:underline">{entry.abjad}</a>
		</div>

		<div class="font-semibold">HW (Lat.)</div>
		<div class="font-mix">{@html marked.parseInline(entry.headword_latin)}</div>

		<div class="font-semibold">Defs.</div>
		<div class="font-mix">{@html marked.parseInline(entry.definitions)}</div>
	</div>
{/each}
