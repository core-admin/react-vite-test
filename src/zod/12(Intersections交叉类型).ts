import { z } from 'zod';

/**
 * Intersections
 *
 * 交叉类型对于创建 "logical AND"类型很有用。这对于两个对象类型的相交很有用。
 */

const Person = z.object({
  name: z.string(),
});

const Employee = z.object({
  role: z.string(),
});

const EmployedPerson = z.intersection(Person, Employee);
/*
  {
      name: string;
  } & {
      role: string;
  }
*/
type EmployedPerson = z.infer<typeof EmployedPerson>;

// 等同于：
const EmployedPerson2 = Person.and(Employee);

/*
  type EmployedPerson2 = {
      name: string;
  } & {
      role: string;
  }
*/
type EmployedPerson2 = z.infer<typeof EmployedPerson2>;

// -------------------------------------------------------------------------------------------------------

const a = z.union([z.number(), z.string()]);
const b = z.union([z.number(), z.boolean()]);
const c = z.intersection(a, b);

type C = z.infer<typeof c>; // type C = number

type A = number | string;
type B = number | boolean;
type C1 = A & B; // type C1 = number

// 推导过程：
// 1. A 的可能值：number, string
// 2. B 的可能值：number, boolean
// 3. A & B 意味着必须同时满足 A 和 B
// 4. 找出同时存在于 A 和 B 中的类型：
//    - number ✅ (在 A 和 B 中都有)
//    - string ❌ (只在 A 中有)
//    - boolean ❌ (只在 B 中有)
// 所以最终结果只有 number

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;

type Json = Literal | { [key: string]: Json } | Json[];
