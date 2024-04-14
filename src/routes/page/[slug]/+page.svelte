<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { type Entry } from '$lib/utils';
	import { marked } from 'marked';

	$: pageNumber = $page.params.slug;
	$: padded = pageNumber.padStart(4, '0');
	$: prev = Number(pageNumber) - 1;
	$: next = Number(pageNumber) + 1;
	$: title = `Steingass – p. ${pageNumber}`;

	let loading = true;
	let entries: Entry[] = [];
	$: count = entries.length;

	async function fetchPage(pageNumber: string): Promise<Entry[]> {
		try {
			const res = await fetch('/api/page?' + new URLSearchParams({ 'page-number': pageNumber }));
			if (!res.ok) {
				throw new Error(`Failed query: ${res.status}`);
			}

			const data: Entry[] = await res.json();
			return data;
		} catch (err) {
			console.error(err);
			return [];
		}
	}

	afterNavigate(async () => {
		loading = true;
		const data = await fetchPage(pageNumber);
		entries = data;
		loading = false;
	});
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="mb-4 flex justify-between">
	<a href={String(prev)} class="text-blue-700 hover:underline">Prev. p.</a>
	<a href="/" class="text-blue-700 hover:underline">Home</a>
	<a href={String(next)} class="text-blue-700 hover:underline">Next p.</a>
</div>

<h1 class="mb-5 text-4xl">{title}</h1>

{#if loading}
	<p>Loading…</p>
{:else}
	<p>
		<a href={`/page-img/${padded}.jpg`} target="_blank" class="text-blue-700 hover:underline"
			>Page image</a
		>
	</p>
	<p><span class="font-semibold">Entries:</span> {count}</p>
{/if}

<hr class="my-4 border border-dashed border-gray-400" />

{#each entries as entry}
	<div
		class="my-4 grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 rounded-md border-2 border-dashed border-blue-700/50 p-4"
	>
		<div class="font-semibold">ID</div>
		<div><a href={'/entry/' + entry.id} class="text-blue-700 hover:underline">{entry.id}</a></div>

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

{#if entries.length > 0}
	<hr class="my-4 border border-dashed border-gray-400" />

	<div class="flex justify-between">
		<a href={String(prev)} class="text-blue-700 hover:underline">Prev. p.</a>
		<a href="/" class="text-blue-700 hover:underline">Home</a>
		<a href={String(next)} class="text-blue-700 hover:underline">Next p.</a>
	</div>
{/if}
