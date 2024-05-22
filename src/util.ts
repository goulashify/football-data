export type Key<T> = {
    name: string
    get(): T | null
    set(obj: T): void
    clear(): void
}

export function newJsonKey<T>(name: string): Key<T> {
    return {
        name,
        get() {
            let serialized = localStorage.getItem(name);
            if (serialized === null) return null;
            return JSON.parse(serialized) as T;
        },
        /**
         * WARN: Only pass JSON serializable values here!
         * @param obj must be json serializable!
         */
        set(obj: T) {
            localStorage.setItem(name, JSON.stringify(obj));
        },
        clear() {
            localStorage.removeItem(name);
        }
    };
}
