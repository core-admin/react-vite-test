import { z } from 'zod';

// 创建一个字符串的模式
const mySchema = z.string();

// "安全"解析(如果验证失败不抛出错误)
const result = mySchema.safeParse('tuna'); // => { success: true; data: "tuna" }
console.log(JSON.stringify(result, null, 2));

const result2 = mySchema.safeParse(12); // => { success: false; error: ZodError }
console.log(JSON.stringify(result2, null, 2));

/*

{
  "success": true,
  "data": "tuna"
}
{
  "success": false,
  "error": {
    "issues": [
      {
        "code": "invalid_type",
        "expected": "string",
        "received": "number",
        "path": [],
        "message": "Expected string, received number"
      }
    ],
    "name": "ZodError"
  }
}

*/
