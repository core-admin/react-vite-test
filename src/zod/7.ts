import { z } from 'zod';

/**
 * Unions
 *
 * Zod 包括一个内置的z.union方法，用于合成 "OR" 类型。
 */

const stringOrNumber = z.union([z.string(), z.number()]);

stringOrNumber.parse('foo'); // 通过
stringOrNumber.parse(14); // 通过

/**
 * Discriminated unions
 *
 * 判别联合模式是指联合类型有一个特定键，根据该键值命中对应的对象模式。
 */

type MyUnion = { status: 'success'; data: string } | { status: 'failed'; error: Error };

const myUnion = z.discriminatedUnion('status', [
  z.object({ status: z.literal('success'), data: z.string() }),
  z.object({ status: z.literal('failed'), error: z.instanceof(Error) }),
]);

myUnion.parse({ status: 'success', data: 'yippie ki yay' });

// 可以使用 .options 属性获取选项列表。
myUnion.options; // [ZodObject<...>, ZodObject<...>]

type _MyUnion = z.infer<typeof myUnion>;

// 要合并两个或更多判别联合模式，请展开所有模式中的 .options。

// @ts-ignore
const A = z.discriminatedUnion('status', [
  /* options */
]);

// @ts-ignore
const B = z.discriminatedUnion('status', [
  /* options */
]);

const AB = z.discriminatedUnion('status', [...A.options, ...B.options]);

/**
 * Optionals
 *
 * 你可以用z.optional()使任何模式成为可选:
 */

const schema = z.optional(z.string());

schema.parse(undefined); // => returns undefined
type A = z.infer<typeof schema>; // string | undefined

// 你可以用.optional()方法使一个现有的模式成为可选的:

const user = z.object({
  username: z.string().optional(),
});
type C = z.infer<typeof user>; // { username?: string | undefined };

/**
 * Nullables
 *
 * 你可以用z.nullable()使任何模式成为null:
 */

const nullableString = z.nullable(z.string());
nullableString.parse('asdf'); // => "asdf"
nullableString.parse(null); // => null

// 你可以用nullable方法使一个现有的模式变成 nullable:
const E = z.string().nullable(); // equivalent to D
type E = z.infer<typeof E>; // string | null

/**
 * unwrap
 *
 * unwrap() 方法用于获取被 optional() 或 nullable() 包装前的原始 schema。
 */

// const stringSchema = z.string();
// const optionalString = stringSchema.optional();
// optionalString.unwrap() === stringSchema; // true
// type _StringSchema = z.infer<typeof stringSchema>; // string

const stringSchema = z.string();

// optional() 后的类型是 string | undefined
const optionalString = stringSchema.optional();
// nullable() 后的类型是 string | null
const nullableString2 = stringSchema.nullable();

// unwrap() 会返回原始的 string schema
optionalString.unwrap() === stringSchema; // true
nullableString2.unwrap() === stringSchema; // true
