import { InputSignal } from "@angular/core";
import { ResolveFn } from "@angular/router";

export type Writeable<T> = {
    -readonly [P in keyof T]: T[P];
};

type InputsOfComponent<T> = {
    [P in keyof T as T[P] extends InputSignal<any> ? P : never]:
        T[P] extends InputSignal<infer TT> ? TT : never;
};
export type Resolvers<T> = {
    [P in keyof InputsOfComponent<T>]: ResolveFn<InputsOfComponent<T>[P]>;
};
