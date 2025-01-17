// ---------------------------- .catchall 方法 | 你可以将一个 "catchall "模式传递给一个对象模式。所有未知的 keys 都将根据它进行验证 ----------------------------

import { z } from 'zod';

const person = z
  .object({
    name: z.string(),
  })
  .catchall(z.number()); // 多余的属性，统一使用 z.number() 进行验证

person.parse({
  name: 'bob dylan',
  validExtraKey: 61, // 运行良好
});

person.parse({
  name: 'bob dylan',
  validExtraKey: false, // 未能成功
});
// => throws ZodError

// 使用.catchall()可以避免.passthrough()，.strip()，或.strict()。现在所有的键都被视为 "已知(known)"。
