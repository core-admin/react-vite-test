/**
 * nonempty
 *
 * 如果你想确保一个数组至少包含一个元素，使用 .nonempty().
 */

import { z } from 'zod';

const nonEmptyStrings = z.string().array().nonempty();

// 现在推断的类型是 [string, ...string[]]

nonEmptyStrings.parse([]); // throws: "Array cannot be empty"
nonEmptyStrings.parse(['Ariana Grande']); // passes

type _NonEmptyStrings = z.infer<typeof nonEmptyStrings>;

/**
 * .min/.max/.length
 */

z.string().array().min(5); // 必须包含5个或更多元素
z.string().array().max(5); // 必须包含5个或更少元素
z.string().array().length(5); // 必须正好包含5个元素

// 与.nonempty()不同，这些方法不会改变推断的类型（参看 6.ts）
