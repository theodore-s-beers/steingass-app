<script lang="ts">
	import "../app.css";

	let { children } = $props();
</script>

<div class="mx-auto max-w-4xl p-4 text-lg">
	{@render children()}
</div>
