import { z } from 'zod';

/**
 * Records
 *
 * Record 模式用于验证诸如{ [k: string]: number }这样的类型。
 */

// 如果你想根据某种模式验证一个对象的 value ，但不关心 keys，使用`Record'。

const NumberCache = z.record(z.number());

type NumberCache = z.infer<typeof NumberCache>;
// => { [k: string]: number }

// 这对于按 ID 存储或缓存项目特别有用。

const userSchema = z.object({ name: z.string() });
const userStoreSchema = z.record(userSchema);

type UserStore = z.infer<typeof userStoreSchema>;
// => type UserStore = { [ x: string ]: { name: string } }

const userStore: UserStore = {};

userStore['77d2586b-9e8e-4ecf-8b21-ea7e0530eadd'] = {
  name: 'Carlotta',
}; // passes

userStore['77d2586b-9e8e-4ecf-8b21-ea7e0530eadd'] = {
  whatever: 'Ice cream sundae',
}; // TypeError
