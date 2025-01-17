import { z } from 'zod';

/**
 * 在 Zod 中，有两种方法来定义枚举。
 */

/**
 * Zod enums
 */

const FishEnum = z.enum(['Salmon', 'Tuna', 'Trout']);
type FishEnum = z.infer<typeof FishEnum>;
// 'Salmon' | 'Tuna' | 'Trout'

// 你必须将数值数组直接传入z.enum()。这样做是不行的:
const fish = ['Salmon', 'Tuna', 'Trout'];
// const FishEnum2 = z.enum(fish);

// 在这种情况下，Zod 无法推断出各个枚举元素；相反，推断出的类型将是 string 而不是'Salmon'|'Tuna'|'Trout'。

// 另一种可行的方式是使用as const，这样 Zod 就可以推断出正确的类型。

const VALUES = ['Salmon', 'Tuna', 'Trout'] as const;
const FishEnum3 = z.enum(VALUES);
type FishEnum3 = z.infer<typeof FishEnum3>; // 'Salmon' | 'Tuna' | 'Trout'

// -------------------------- 为了获得 Zod 枚举的自动完成，请使用你的模式的.enum属性 --------------------------

const fishEnum = FishEnum.enum;
/*
  { Salmon: 'Salmon', Tuna: 'Tuna', Trout: 'Trout' }
*/
console.log(fishEnum);
fishEnum.Salmon; // => 自动补全

// { Salmon: 'Salmon', Tuna: 'Tuna', Trout: 'Trout' }
console.log(FishEnum.Enum);

// 属性检索选项列表
console.log('FishEnum.options', FishEnum.options); // [ 'Salmon', 'Tuna', 'Trout' ]
