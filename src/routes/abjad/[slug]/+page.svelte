<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { type AbjadEntry } from '$lib/utils';

	$: abjadValue = $page.params.slug;
	$: prev = Number(abjadValue) - 1;
	$: next = Number(abjadValue) + 1;
	$: title = `Steingass – Abjad value ${abjadValue}`;

	let loading = true;
	let entries: AbjadEntry[] = [];
	$: count = entries.length;

	async function fetchAbjad(value: string): Promise<AbjadEntry[]> {
		try {
			const res = await fetch('/api/abjad?' + new URLSearchParams({ value }));
			if (!res.ok) {
				throw new Error(`Failed query: ${res.status}`);
			}

			const data: AbjadEntry[] = await res.json();
			return data;
		} catch (err) {
			console.error(err);
			return [];
		}
	}

	afterNavigate(async () => {
		loading = true;
		const data = await fetchAbjad(abjadValue);
		entries = data;
		loading = false;
	});
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="mb-4 flex justify-between">
	<a href={String(prev)} class="text-blue-700 hover:underline">Prev. val.</a>
	<a href="/" class="text-blue-700 hover:underline">Home</a>
	<a href={String(next)} class="text-blue-700 hover:underline">Next val.</a>
</div>

<h1 class="mb-5 text-4xl">{title}</h1>

{#if loading}
	<p>Loading…</p>
{:else}
	<p><span class="font-semibold">Entries:</span> {count}</p>
{/if}

<hr class="my-4 border border-dashed border-gray-400" />

<ul class="list-inside list-disc space-y-2">
	{#each entries as entry}
		<li>
			<a href={'/entry/' + entry.id} class="text-blue-700 hover:underline">{entry.id}</a>:
			<span class="font-mix">{entry.headword_persian}</span>
		</li>
	{/each}
</ul>

{#if entries.length > 20}
	<hr class="my-4 border border-dashed border-gray-400" />

	<div class="flex justify-between">
		<a href={String(prev)} class="text-blue-700 hover:underline">Prev. val.</a>
		<a href="/" class="text-blue-700 hover:underline">Home</a>
		<a href={String(next)} class="text-blue-700 hover:underline">Next val.</a>
	</div>
{/if}
