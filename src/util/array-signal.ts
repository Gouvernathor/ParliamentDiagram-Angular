import { CreateSignalOptions, signal, Signal } from '@angular/core';

type MutableMethodsNotReturningThis = "pop"|"push"|"shift"|"splice"|"unshift";
export interface ArraySignal<T>
        extends Signal<readonly T[]>, Pick<T[], MutableMethodsNotReturningThis> {
    copyWithin(target: number, start: number, end?: number): void; // this;
    fill(value: T, start?: number, end?: number): void; // this;
    reverse(): void; // this;
    sort(compareFn?: (a: T, b: T) => number): void; // this;

    asReadonly(): Signal<readonly T[]>;
}

export interface CreateArraySignalOptions<T> extends Omit<CreateSignalOptions<T[]>, "equal"> {
    equal(a: T, b: T): boolean;
}

export function arraySignal<T>(
    initialValue: T[] = [],
    { equal, ...options }: CreateArraySignalOptions<T> = { equal: Object.is },
): ArraySignal<T> {
    const sig = signal(initialValue, { equal: () => false, ...options });

    function copyWithin(target: number, start: number, end?: number): void {
        const arr = sig();
        arr.copyWithin(target, start, end);
        sig.set(arr);
    }

    function fill(value: T, start?: number, end?: number): void {
        const arr = sig();
        arr.fill(value, start, end);
        sig.set(arr);
    }

    function pop(): T | undefined {
        const arr = sig();
        if (arr.length) {
            const res = arr.pop();
            sig.set(arr);
            return res;
        }
        return undefined;
    }

    function push(...items: T[]): number {
        const arr = sig();
        if (items.length) {
            arr.push(...items);
            sig.set(arr);
        }
        return arr.length;
    }

    function reverse(): void {
        const arr = sig();
        if (arr.length > 1) {
            arr.reverse();
            sig.set(arr);
        }
    }

    function shift(): T | undefined {
        const arr = sig();
        if (arr.length) {
            const res = arr.shift();
            sig.set(arr);
            return res;
        }
        return undefined;
    }

    function sort(compareFn?: (a: T, b: T) => number): void {
        const arr = sig();
        if (arr.length > 1) {
            arr.sort(compareFn);
            sig.set(arr);
        }
    }

    function splice(start: number, deleteCount?: number, ...items: T[]): T[] {
        const arr = sig();
        if (deleteCount !== undefined && deleteCount > 0 || items.length) {
            const res = arr.splice(start, deleteCount!, ...items);
            sig.set(arr);
            return res;
        }
        return [];
    }

    function unshift(...items: T[]): number {
        const arr = sig();
        if (items.length) {
            arr.unshift(...items);
            sig.set(arr);
        }
        return arr.length;
    }

    function asReadonly(): Signal<readonly T[]> {
        return sig.asReadonly();
    }

    return Object.assign(sig.asReadonly(), {
        copyWithin, fill, pop, push, reverse, shift, sort, splice, unshift,
        asReadonly,
    });
}
