import { z } from 'zod';

const stringArray = z.array(z.string());

// 相当于
const stringArray2 = z.string().array();

// 要小心使用.array()方法。它返回一个新的ZodArray实例。这意味着你调用方法的 顺序 很重要。比如说:

z.string().optional().array(); // (string | undefined)[]
z.string().array().optional(); // string[] | undefined
