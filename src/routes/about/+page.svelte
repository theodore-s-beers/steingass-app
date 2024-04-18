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

<h1 class="mb-6 text-4xl">{title}</h1>

<hr class="border border-dashed border-gray-400" />
<p class="my-2">
	Steingass, Francis Joseph. <em
		>A Comprehensive Persian-English Dictionary, including the Arabic words and phrases to be met
		with in Persian literature</em
	>. London: Routledge & K. Paul, 1892.
</p>
<hr class="mb-5 border border-dashed border-gray-400" />

<p class="mb-4">
	This is my favorite dictionary to use when reading classical Persian texts, and I think many
	Persianists feel similarly. Steingass included both a solid number of entries (just under 70,000)
	and, often, a great variety of definitions per entry. I usually find what I’m looking for—if not
	more than what I’m looking for.
</p>

<p class="mb-4">
	The utility of Steingass’ Persian-English dictionary as an <em>Arabic-English</em> dictionary is
	also not to be underestimated. If you’re reading, e.g., classical Arabic poetry, you will
	encounter many words that are too old-fashioned to be covered in Hans Wehr’s dictionary, but which
	<em>are</em> included in Steingass’ Persian-focused work. (This is not meant as a criticism of Wehr,
	which is clearly targeted at MSA.) Could you consult Lane, Hava, etc. for archaic Arabic vocabulary?
	Of course, and you should; but in a pinch, Steingass is a surprisingly viable option.
</p>

<p class="mb-4">
	A fairly high-resolution scan of the dictionary can be found
	<a
		href="https://archive.org/details/a-comprehensive-persian-english-dictionary/"
		target="_blank"
		rel="noreferrer"
		class="text-blue-700 hover:underline">at the Internet Archive</a
	>. It wouldn’t be a bad idea to add a copy to your personal digital library.
</p>

<p class="mb-4">
	Steingass has long been available also in an online, <a
		href="https://dsal.uchicago.edu/dictionaries/steingass/"
		target="_blank"
		rel="noreferrer"
		class="text-blue-700 hover:underline">searchable version</a
	>, thanks to the efforts of the Digital Dictionaries of South Asia project at the University of
	Chicago. Unfortunately, there are many, many problems with the encoding of Arabic-script text in
	their database, with the result that searching for words is error-prone and frustrating. (I may
	write about this in detail at some point, if I get a chance.)
</p>

<p class="mb-4">
	Desiring a cleaner digital Steingass for my own use, I downloaded all 69,888 entries from the DDSA
	version, organized them in a SQLite database, and fixed what I could. For the Persian headwords in
	particular, I was able to enforce a significantly smaller character set. This should make it
	easier and more intuitive to find what you need. The SQLite database file itself can be downloaded
	from <a
		href="https://github.com/theodore-s-beers/steingass-scraper"
		target="_blank"
		rel="noreferrer"
		class="text-blue-700 hover:underline">one of my GitHub repositories</a
	>.
</p>

<p class="mb-4">
	With the data in hand, it was only a matter of developing a basic frontend app to interface with
	it. (Well, there are other potentially interesting things that I’ve done with this project—e.g.,
	calculating abjad values—but I don’t have time to get into it now. Maybe later.) This site is
	hosted via Cloudflare Pages; the <a
		href="https://github.com/theodore-s-beers/steingass-app"
		target="_blank"
		rel="noreferrer"
		class="text-blue-700 hover:underline">frontend source code</a
	> is available on GitHub.
</p>

<p class="mb-4">
	I hope you find this new version of Steingass useful! And I must emphasize that the team at
	UChicago still deserves 99% of the credit. The last 1%, however, can make a real difference.
</p>

<p class="mb-2"><em>Theodore Beers, April 2024</em></p>
