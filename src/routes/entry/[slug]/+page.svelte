<script lang="ts">
	import { afterNavigate } from "$app/navigation";
	import { page } from "$app/stores";
	import { type Entry } from "$lib/utils";
	import { marked } from "marked";

	$: id = $page.params.slug;
	$: prev = Number(id) - 1;
	$: next = Number(id) + 1;
	$: title = `Steingass – Entry ${id}`;

	let loading = true;
	let entry: Entry | null = null;

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
	<a href={String(prev)} class="text-blue-700 hover:underline">Prev. entry</a>
	<a href="/" class="text-blue-700 hover:underline">Home</a>
	<a href={String(next)} class="text-blue-700 hover:underline">Next entry</a>
</div>

<h1 class="mb-5 text-4xl">{title}</h1>

{#if loading}
	<p>Loading…</p>
{:else if entry}
	<div
		class="my-4 grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1.5 rounded-md border-2 border-dashed border-blue-700/50 p-4"
	>
		<div class="font-semibold">Page</div>
		<div>
			<a href={"/page/" + entry.page} class="text-blue-700 hover:underline">{entry.page}</a>
			(<a
				href={`/page-img/${entry.page.toString().padStart(4, "0")}.jpg`}
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
{:else}
	<p>Failed to load entry</p>
{/if}
