<script lang="ts">
	const title = 'Steingass Persian-English Dictionary – About';
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:url" content={`https://steingass.theobeers.com/about`} />
	<meta name="twitter:title" content={title} />
</svelte:head>

<div class="mb-4 flex justify-center">
	<a href="/" class="text-blue-700 hover:underline">Home</a>
</div>

<h1 class="mb-5 text-4xl">{title}</h1>

<p>
	Steingass, Francis Joseph. <em
		>A Comprehensive Persian-English Dictionary, including the Arabic words and phrases to be met
		with in Persian literature</em
	>. London: Routledge & K. Paul, 1892.
</p>
