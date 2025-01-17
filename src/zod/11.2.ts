import { z } from 'zod';

/**
 * 常量枚举
 *
 * .nativeEnum()函数也适用于as const对象
 */

const Fruits = {
  Apple: 'apple',
  Banana: 'banana',
  Cantaloupe: 3,
} as const;

const FruitEnum = z.nativeEnum(Fruits);
type FruitEnum = z.infer<typeof FruitEnum>; // "apple" | "banana" | 3

FruitEnum.parse('apple'); // passes
FruitEnum.parse('banana'); // passes
FruitEnum.parse(3); // passes
FruitEnum.parse('Cantaloupe'); // fails
