<script lang="ts">
	import { MAX_ENTRY_ID } from "#lib/constants.ts";
	import EntryCard from "#lib/EntryCard.svelte";
	import { afterNavigate } from "$app/navigation";
	import { page } from "$app/state";
	import { type Entry } from "#lib/utils.ts";
	import { resolve } from "$app/paths";

	let id = $derived(page.params.slug ?? "");
	let prev = $derived(Number(id) - 1);
	let next = $derived(Number(id) + 1);
	let title = $derived(`Steingass – Entry ${id}`);

	let loading = $state(true);
	let navigationRequest = 0;
	let entry: Entry | null = $state(null);

	async function fetchEntry(id: string): Promise<Entry | null> {
		try {
			const res = await fetch("/api/entry?" + new URLSearchParams({ id }));
			if (!res.ok) {
				throw new Error(`Failed query: ${res.status}`);
			}

			const data: Entry = await res.json();
			return data;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	afterNavigate(async () => {
		const request = ++navigationRequest;
		loading = true;
		const data = await fetchEntry(id);
		if (request === navigationRequest) {
			entry = data;
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:url" content={`https://steingass.theobeers.com/entry/${id}`} />
	<meta name="twitter:title" content={title} />
</svelte:head>

<div class="mb-3 grid grid-cols-3">
	{#if prev >= 1}
		<a href={prev.toString()} class="col-start-1 justify-self-start text-blue-700 hover:underline"
			>Prev. entry</a
		>
	{/if}
	<a href={resolve("/")} class="col-start-2 justify-self-center text-blue-700 hover:underline"
		>Home</a
	>
	{#if next <= MAX_ENTRY_ID}
		<a href={next.toString()} class="col-start-3 justify-self-end text-blue-700 hover:underline"
			>Next entry</a
		>
	{/if}
</div>

<h1 class="mb-5 text-4xl">{title}</h1>

{#if loading}
	<p>Loading…</p>
{:else if entry}
	<EntryCard {entry} showId={false} />
{:else}
	<p>Failed to load entry</p>
{/if}
