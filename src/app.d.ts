// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			caches: CacheStorage & { default: Cache };
			cf: CfProperties;
			ctx: ExecutionContext;
			env: { DB: D1Database };
		}
	}
}

export {};
