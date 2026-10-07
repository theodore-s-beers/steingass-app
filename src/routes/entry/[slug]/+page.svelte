<script lang="ts">
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
		loading = true;
		const data = await fetchEntry(id);
		entry = data;
		loading = false;
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:url" content={`https://steingass.theobeers.com/entry/${id}`} />
	<meta name="twitter:title" content={title} />
</svelte:head>

<div class="mb-3 flex justify-between">
	<a href={prev.toString()} class="text-blue-700 hover:underline">Prev. entry</a>
	<a href={resolve("/")} class="text-blue-700 hover:underline">Home</a>
	<a href={next.toString()} class="text-blue-700 hover:underline">Next entry</a>
</div>

<h1 class="mb-5 text-4xl">{title}</h1>

{#if loading}
	<p>Loading…</p>
{:else if entry}
	<EntryCard {entry} showId={false} />
{:else}
	<p>Failed to load entry</p>
{/if}
