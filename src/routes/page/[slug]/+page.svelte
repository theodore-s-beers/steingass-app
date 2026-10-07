<script lang="ts">
	import { MAX_PAGE_NUMBER } from "#lib/constants.ts";
	import EntryCard from "#lib/EntryCard.svelte";
	import type { AssetPath } from "$app/types";
	import { afterNavigate } from "$app/navigation";
	import { page } from "$app/state";
	import { type Entry } from "#lib/utils.ts";
	import { asset, resolve } from "$app/paths";

	let pageNumber = $derived(page.params.slug ?? "");
	let padded = $derived(pageNumber.padStart(4, "0"));
	let prev = $derived(Number(pageNumber) - 1);
	let next = $derived(Number(pageNumber) + 1);
	let title = $derived(`Steingass – Page ${pageNumber}`);

	let loading = $state(true);
	let navigationRequest = 0;
	let entries: Entry[] = $state([]);
	let count = $derived(entries.length);

	async function fetchPage(pageNumber: string): Promise<Entry[]> {
		try {
			const res = await fetch("/api/page?" + new URLSearchParams({ "page-number": pageNumber }));
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
		const request = ++navigationRequest;
		loading = true;
		const data = await fetchPage(pageNumber);
		if (request === navigationRequest) {
			entries = data;
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:url" content={`https://steingass.theobeers.com/page/${pageNumber}`} />
	<meta name="twitter:title" content={title} />
</svelte:head>

<div class="mb-3 grid grid-cols-3">
	{#if prev >= 1}
		<a href={prev.toString()} class="col-start-1 justify-self-start text-blue-700 hover:underline"
			>Prev. p.</a
		>
	{/if}
	<a href={resolve("/")} class="col-start-2 justify-self-center text-blue-700 hover:underline"
		>Home</a
	>
	{#if next <= MAX_PAGE_NUMBER}
		<a href={next.toString()} class="col-start-3 justify-self-end text-blue-700 hover:underline"
			>Next p.</a
		>
	{/if}
</div>

<h1 class="mb-5 text-4xl">{title}</h1>

{#if loading}
	<p>Loading…</p>
{:else}
	<p>
		<a
			href={asset(`page-img/${padded}.jpg` as AssetPath)}
			target="_blank"
			class="text-blue-700 hover:underline"
		>
			Page image
		</a>
	</p>
	<p><span class="font-semibold">Entries:</span> {count}</p>
{/if}

<hr class="my-4 border border-dashed border-gray-400" />

{#each entries as entry (entry.id)}
	<EntryCard {entry} showPage={false} />
{/each}

{#if entries.length > 0}
	<hr class="my-4 border border-dashed border-gray-400" />

	<div class="grid grid-cols-3">
		{#if prev >= 1}
			<a href={prev.toString()} class="col-start-1 justify-self-start text-blue-700 hover:underline"
				>Prev. p.</a
			>
		{/if}
		<a href={resolve("/")} class="col-start-2 justify-self-center text-blue-700 hover:underline"
			>Home</a
		>
		{#if next <= MAX_PAGE_NUMBER}
			<a href={next.toString()} class="col-start-3 justify-self-end text-blue-700 hover:underline"
				>Next p.</a
			>
		{/if}
	</div>
{/if}
