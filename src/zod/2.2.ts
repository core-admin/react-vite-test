/**
 * 强制转换为布尔值
 */

import { z } from 'zod';

z.coerce.boolean().parse('tuna'); // => true
z.coerce.boolean().parse('true'); // => true
z.coerce.boolean().parse('false'); // => true
z.coerce.boolean().parse(1); // => true
z.coerce.boolean().parse([]); // => true

z.coerce.boolean().parse(0); // => false
z.coerce.boolean().parse(undefined); // => false
z.coerce.boolean().parse(null); // => false

// 将值传入 Boolean(value) 函数，仅此而已。任何真值都将解析为 true，任何假值都将解析为 false
