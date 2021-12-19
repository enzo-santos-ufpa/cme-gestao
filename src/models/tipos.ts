// Returns R if T is a function, otherwise returns Fallback
type IsFunction<T, R, Fallback = T> = T extends (...args: any[]) => any ? R : Fallback

// Returns R if T is an object, otherwise returns Fallback
type IsObject<T, R, Fallback = T> = IsFunction<T, Fallback, (T extends (Date | number | string | boolean | Array<any>) ? Fallback : R)>

// "a.b.c" => "b.c"
type Tail<S> = S extends `${string}.${infer T}` ? Tail<T> : S;

// typeof Object.values(T)
type Value<T> = T[keyof T]

// {a: {b: 1, c: 2}} => {"a.b": {b: 1, c: 2}, "a.c": {b: 1, c: 2}}
type FlattenStepOne<T> = {
    [K in keyof T as K extends string ? (IsObject<T[K], `${K}.${keyof Required<T>[K] & string}`, K>) : K]:
    IsObject<T[K], { [key in keyof Required<T>[K]]: Required<T>[K][key] }>
};

// {"a.b": {b: 1, c: 2}, "a.c": {b: 1, c: 2}} => {"a.b": {b: 1}, "a.c": {c: 2}}
type FlattenStepTwo<T> = { [K in keyof T]: IsObject<Required<T>[K], Value<{ [M in keyof Required<T>[K] as M extends Tail<K> ? M : never]: Required<T>[K][M] }>> };

// {a: {b: 1, c: {d: 1}}} => {"a.b": 1, "a.c": {d: 1}}
type FlattenOneLevel<T> = FlattenStepTwo<FlattenStepOne<T>>

// {a: {b: 1, c: {d: 1}}} => {"a.b": 1, "a.b.c.d": 1}
export type Flatten<T> = T extends FlattenOneLevel<T> ? T : Flatten<FlattenOneLevel<T>>

export type ModeloBD<T> = T & { id: number };

export type FlatEncoded<T> = { [k in keyof Flatten<T>]: string };

export abstract class FlatEncoder<T> {
    abstract encode(value: T): FlatEncoded<T>;

    abstract decode(value: FlatEncoded<T>): T;
}

export abstract class FlatEncoderDecorator<T, R> extends FlatEncoder<R> {
    protected readonly encoder: FlatEncoder<T>;

    constructor(encoder: FlatEncoder<T>) {
        super();
        this.encoder = encoder;
    }
}
