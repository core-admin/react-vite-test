/**
 * 字面量（literal）
 */

import { z } from 'zod';

const tuna = z.literal('tuna');
const twelve = z.literal(12);
const twobig = z.literal(2n); // bigint literal
const tru = z.literal(true);

const terrificSymbol = Symbol('terrific');
const terrific = z.literal(terrificSymbol);

/*

zod 中的 literal 用于定义一个固定的、精确的值。它可以匹配一个具体的字符串、数字或布尔值。

简单示例：

```typescript
import { z } from 'zod'

// 定义只能是 'hello' 的字符串
const hello = z.literal('hello')
hello.parse('hello') // ✅ 通过
hello.parse('world') // ❌ 报错

// 定义只能是数字 123
const num = z.literal(123)
num.parse(123) // ✅ 通过
num.parse(456) // ❌ 报错

// 实际应用场景：定义特定的状态
const Status = z.union([
  z.literal('pending'),
  z.literal('success'),
  z.literal('error')
])
type Status = z.infer<typeof Status> // 'pending' | 'success' | 'error'

// 用在对象中
const UserSchema = z.object({
  role: z.literal('admin'), // 只能是 'admin'
  active: z.literal(true)   // 只能是 true
})
```

主要用途：
1. 限制某个字段只能是特定值
2. 结合 `union` 创建联合类型
3. 用于定义常量或枚举值
4. 在 API 接口中指定固定的参数值


*/

const Status = z.union([z.literal('pending'), z.literal('success'), z.literal('error')]);
type Status = z.infer<typeof Status>; // 'pending' | 'success' | 'error'

/**
 * 这种写法是不行的，因为 z.union() 需要传入 ZodType 类型，而字符串数组不是 ZodType 类型。
 * 需要用 z.literal() 包装每个值。正确写法应该是上面的写法，使用 z.literal() 来创建。
 */
const Status2 = z.union(['pending', 'success', 'error']);
type Status2 = z.infer<typeof Status2>; // 'pending' | 'success' | 'error'
