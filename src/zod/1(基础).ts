import { z } from 'zod';

// 创建一个字符串的模式
const mySchema = z.string();

// 解析
mySchema.parse('tuna'); // => "tuna"
mySchema.parse(12); // => throws ZodError
