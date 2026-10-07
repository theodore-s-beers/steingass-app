<script lang="ts">
	import { asset, resolve } from "$app/paths";
	import type { AssetPath } from "$app/types";
	import type { Entry } from "#lib/utils.ts";
	import { marked } from "marked";

	let {
		entry,
		showId = true,
		showPage = true,
	}: {
		entry: Entry;
		showId?: boolean;
		showPage?: boolean;
	} = $props();
</script>

<div
	class="my-4 grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1.5 rounded-md border-2 border-dashed border-blue-700/50 p-4"
>
	{#if showId}
		<div class="font-semibold">ID</div>
		<div>
			<a
				href={resolve("/entry/[slug]", { slug: entry.id.toString() })}
				class="text-blue-700 hover:underline"
			>
				{entry.id}
			</a>
		</div>
	{/if}

	{#if showPage}
		<div class="font-semibold">Page</div>
		<div>
			<a
				href={resolve("/page/[slug]", { slug: entry.page.toString() })}
				class="text-blue-700 hover:underline"
			>
				{entry.page}
			</a>
			(<a
				href={asset(`page-img/${entry.page.toString().padStart(4, "0")}.jpg` as AssetPath)}
				target="_blank"
				class="text-blue-700 hover:underline"
			>
				Page image
			</a>)
		</div>
	{/if}

	<div class="font-semibold">Etym.</div>
	<div>{entry.lang}</div>

	<div class="font-semibold">HW (full)</div>
	<div class="font-mix">{@html marked.parseInline(entry.headword_full)}</div>

	<div class="font-semibold">HW (Per.)</div>
	<div class="font-mix">{entry.headword_persian}</div>

	<div class="font-semibold">Abjad</div>
	<div>
		<a
			href={resolve("/abjad/[slug]", { slug: entry.abjad.toString() })}
			class="text-blue-700 hover:underline"
		>
			{entry.abjad}
		</a>
	</div>

	<div class="font-semibold">HW (Lat.)</div>
	<div class="font-mix">{@html marked.parseInline(entry.headword_latin)}</div>

	<div class="font-semibold">Defs.</div>
	<div class="font-mix">{@html marked.parseInline(entry.definitions)}</div>
</div>
