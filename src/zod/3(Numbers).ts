import { z } from 'zod';

const age = z.number({
  required_error: 'Age is required',
  invalid_type_error: 'Age must be a number',
});

// Zod 包括一些特定的数字验证。

// 大于 5
z.number().gt(5);

// 大于等于 5 (等同于 .min(5))
z.number().gte(5);

// 小于 5
z.number().lt(5);

// 小于等于 5 (等同于 .max(5))
z.number().lte(5);

// 必须是整数
z.number().int();

// 必须是正数 (> 0)
z.number().positive();

// 必须是非负数 (>= 0)
z.number().nonnegative();

// 必须是负数 (< 0)
z.number().negative();

// 必须是非正数 (<= 0)
z.number().nonpositive();

// 必须是 5 的倍数 (等同于 .step(5))
z.number().multipleOf(5);

// 必须是有限数，不能是 Infinity 或 -Infinity
z.number().finite();

// 必须是安全整数，介于 -(2^53-1) 到 2^53-1 之间
z.number().safe();

// 你可以选择传入第二个参数来提供一个自定义的错误信息。
z.number().max(5, { message: 'Number must be safe' });
