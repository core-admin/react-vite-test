import { z } from 'zod';

const name = z.string({
  // 如果对应的字段的值为空，则返回错误信息，为空指的是传入的是 undefined，如果传入的是 null，则属于类型错误
  required_error: 'Name 是必填的',
  // 如果对应的字段的值不是字符串，则返回错误信息
  invalid_type_error: 'Name 必须是字符串',
});

const res1 = name.safeParse(''); // { success: true, data: '' }

// error.issues >>> [{code: 'invalid_type', expected: 'string', received: 'null', path: Array(0), message: 'Name 必须是字符串'}]
// success: false
const res2 = name.safeParse(null);

// ------------------------------

const name2 = z
  .string({
    // 如果对应的字段的值为空，则返回错误信息，如：undefined, null
    required_error: 'Name 是必填的',
    // 如果对应的字段的值不是字符串，则返回错误信息
    invalid_type_error: 'Name 必须是字符串',
  })
  .nonempty('Name 不能为空');

// {code: 'invalid_type', expected: 'string', received: 'null', path: Array(0), message: 'Name 必须是字符串'}
const res3 = name2.safeParse(null);

// {code: 'invalid_type', expected: 'string', received: 'undefined', path: Array(0), message: 'Name 是必填的'}
const res4 = name2.safeParse(undefined);

// { code: "too_small", minimum: 1, type: "string", inclusive: true, exact: false, message: "Name 不能为空", path: [] }
const res5 = name2.safeParse('');
console.log(res5);
