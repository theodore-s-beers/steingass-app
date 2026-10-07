<script lang="ts">
	import { MAX_ABJAD_VALUE } from "#lib/constants.ts";
	import { afterNavigate } from "$app/navigation";
	import { page } from "$app/state";
	import { type AbjadEntry } from "#lib/utils.ts";
	import { resolve } from "$app/paths";

	let abjadValue = $derived(page.params.slug ?? "");
	let prev = $derived(Number(abjadValue) - 1);
	let next = $derived(Number(abjadValue) + 1);
	let title = $derived(`Steingass – Abjad value ${abjadValue}`);

	let loading = $state(true);
	let navigationRequest = 0;
	let entries: AbjadEntry[] = $state([]);
	let count = $derived(entries.length);

	async function fetchAbjad(value: string): Promise<AbjadEntry[]> {
		try {
			const res = await fetch("/api/abjad?" + new URLSearchParams({ value }));
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
		const request = ++navigationRequest;
		loading = true;
		entries = [];
		const data = await fetchAbjad(abjadValue);
		if (request === navigationRequest) {
			entries = data;
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:url" content={`https://steingass.theobeers.com/abjad/${abjadValue}`} />
	<meta name="twitter:title" content={title} />
</svelte:head>

<div class="mb-3 grid grid-cols-3">
	{#if prev >= 1}
		<a href={prev.toString()} class="col-start-1 justify-self-start text-blue-700 hover:underline"
			>Prev. val.</a
		>
	{/if}
	<a href={resolve("/")} class="col-start-2 justify-self-center text-blue-700 hover:underline"
		>Home</a
	>
	{#if next <= MAX_ABJAD_VALUE}
		<a href={next.toString()} class="col-start-3 justify-self-end text-blue-700 hover:underline"
			>Next val.</a
		>
	{/if}
</div>

<h1 class="mb-5 text-4xl">{title}</h1>

{#if loading}
	<p>Loading…</p>
{:else}
	<p><span class="font-semibold">Entries:</span> {count}</p>
{/if}

<hr class="my-4 border border-dashed border-gray-400" />

<ul class="list-inside list-disc space-y-2">
	{#each entries as entry (entry.id)}
		<li>
			<a
				href={resolve("/entry/[slug]", { slug: entry.id.toString() })}
				class="text-blue-700 hover:underline"
			>
				{entry.id}
			</a>:
			<span class="font-mix">{entry.headword_persian}</span>
		</li>
	{/each}
</ul>

{#if entries.length > 20}
	<hr class="my-4 border border-dashed border-gray-400" />

	<div class="grid grid-cols-3">
		{#if prev >= 1}
			<a href={prev.toString()} class="col-start-1 justify-self-start text-blue-700 hover:underline"
				>Prev. val.</a
			>
		{/if}
		<a href={resolve("/")} class="col-start-2 justify-self-center text-blue-700 hover:underline"
			>Home</a
		>
		{#if next <= MAX_ABJAD_VALUE}
			<a href={next.toString()} class="col-start-3 justify-self-end text-blue-700 hover:underline"
				>Next val.</a
			>
		{/if}
	</div>
{/if}
