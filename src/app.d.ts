// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface Platform {
			caches: CacheStorage & { default: Cache };
			cf: CfProperties;
			ctx: ExecutionContext;
			env: { DB: D1Database };
		}
	}
}

export {};
