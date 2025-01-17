import { z } from 'zod';

/**
 * Native enums
 *
 * Zod 枚举是定义和验证枚举的推荐方法。但是如果你需要对第三方库的枚举进行验证（或者你不想重写你现有的枚举），你可以使用z.nativeEnum()。
 */

enum Fruits {
  Apple,
  Banana,
}

const FruitEnum = z.nativeEnum(Fruits);
type FruitEnum = z.infer<typeof FruitEnum>; // enum Fruits

FruitEnum.parse(Fruits.Apple); // 通过
FruitEnum.parse(Fruits.Banana); // 通过
FruitEnum.parse(0); // 通过
FruitEnum.parse(1); // 通过
FruitEnum.parse(3); // 未通过

// String enums

enum Fruits2 {
  Apple = 'apple',
  Banana = 'banana',
  Cantaloupe = 0, // 你可以混合使用数字和字符串的枚举
}

const FruitEnum2 = z.nativeEnum(Fruits2);
type FruitEnum2 = z.infer<typeof FruitEnum2>; // Fruits2 Fruits

FruitEnum.parse(Fruits2.Apple); // 通过
FruitEnum.parse(Fruits2.Cantaloupe); // 通过
FruitEnum.parse('apple'); // 通过
FruitEnum.parse('banana'); // 通过
FruitEnum.parse(0); // 通过
FruitEnum.parse('Cantaloupe'); // 未通过
