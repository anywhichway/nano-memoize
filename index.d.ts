type Func = (...args: any[]) => any

declare module "nano-memoize" {
	interface BasicHelpers<T extends Func>
	{
		clear(): void;
		values(): ReturnType<T>[]
	}

	interface KeysHelpers<K>{
		keys(): K[]
	}

	export function nanomemoize<T extends Func, K = Parameters<T>>(
		fn: T,
		options?: {
			/**
			 * Only use the provided maxArgs for cache look-up, useful for ignoring final callback arguments
			 */
			maxArgs?: number;
			/**
			 * Number of milliseconds to cache a result, set to `Infinity` to never create timers or expire
			 */
			maxAge?: number;
			/**
			 * The serializer/key generator to use for single argument functions (optional, not recommended)
			 * must be able to serialize objects and functions, by default a WeakMap is used internally without serializing
			 */
			serializer?: (...args: Parameters<T>) => K;
			/**
			 * the equals function to use for multi-argument functions (optional, try to avoid) e.g. deepEquals for objects
			 */
			equals?: (...args: any[]) => boolean;
			/**
			 * Forces the use of multi-argument paradigm, auto set if function has a spread argument or uses `arguments` in its body.
			 */
			vargs?: boolean;
		}
	): T & BasicHelpers<T> & KeysHelpers<K>;

	export default nanomemoize;
}
