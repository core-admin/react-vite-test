/**
 * 原始类型的强制转换
 *
 * Zod 现在提供了一种更方便的方法来强制转换原始类型
 */

import { z } from 'zod';

const schema = z.coerce.string();

schema.parse('tuna'); // => "tuna"

schema.parse(12); // => "12"

schema.parse(true); // => "true"

schema.parse(null); // => "true"

schema.parse(undefined); // => "undefined"

// ---------------------------- 引用类型测试 底层通过 String() 函数转换 ----------------------------

schema.parse(Symbol('foo')); // => "Symbol(foo)"

schema.parse(new Date()); // => ""Fri Jan 17 2025 15:48:59 GMT+0800 (China Standard Time)""

schema.parse(new Set([1, 2, 3])); // => "[object Set]"

schema.parse(new Map([['foo', 'bar']])); // => "["foo","bar",]"

schema.parse([]); // => ""

schema.parse({}); // => "[object Object]"
