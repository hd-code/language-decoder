/*! type-guards v0.1.2 | MIT | https://github.com/hd-code/web-snippets */
/**
 * @file
 * This file contains several type guards that can be used for excessive type
 * checking in Typescript or Javascript.
 */
/** TypeGuard to check if a value is `undefined`. */
export declare function isUndefined(value: unknown): value is undefined;
/** TypeGuard to check if a value is `null`. */
export declare function isNull(value: unknown): value is null;
/** TypeGuard to check if a value is a `boolean`. */
export declare function isBool(value: unknown): value is boolean;
/** TypeGuard to check if a value is a `number` with no decimals. */
export declare function isInteger(value: unknown): value is number;
/** TypeGuard to check if a value is a `number`. */
export declare function isNumber(value: unknown): value is number;
/** TypeGuard to check if a value is a `string`. */
export declare function isString(value: unknown): value is string;
/**
 * TypeGuard to check if a value is an `array`.
 *
 * Optional: You can pass a typeGuard as a second argument. This will perform a
 * type check on each element of the array. If the type check fails on any
 * element, the function will return false.
 */
export declare function isArray<T>(value: unknown, typeGuard?: (el: unknown) => el is T): value is T[];
/**
 * TypeGuard to check if a value is an object. If the value is `null`, the type
 * guard will reject the value. However, just an empty object (like this: `{}`)
 * is valid. Arrays are also not accepted as valid objects. Use `isArray()`
 * function in that case.
 *
 * If you want to check the object for specific keys, use `hasKey()`.
 */
export declare function isObject<T>(value: unknown): value is T;
/**
 * TypeGuard to check if a passed object contains the specified key.
 *
 * Also, you can check an array or a string if they have an entry at a specific
 * index. Just pass the array as the object parameter and the index as the key
 * to this function.
 *
 * Optional: You can pass a typeGuard as a third argument to this function. If
 * the given key is found, the value associated with that key is then
 * type-checked by the typeGuard.
 */
export declare function hasKey<T>(obj: unknown, key: keyof T, typeGuard?: (el: unknown) => el is T[keyof T]): obj is T;
/**
 * TypeGuard to check if a value is an instance of an enum.
 *
 * This guard is only effectively usable with typescript.
 */
export declare function isEnum<T extends {
    [key: number | string]: number | string;
}>(value: unknown, enumType: T): value is T[keyof T];
