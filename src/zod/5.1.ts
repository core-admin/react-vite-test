import { z } from 'zod';

// .pick/.omit

// 受 TypeScript 内置的Pick和Omit工具类型的启发，所有 Zod 对象模式都有.pick和 .omit方法，可以返回一个修改后的版本。考虑一下这个 Recipe 模式。

const Recipe = z.object({
  id: z.string(),
  name: z.string(),
  ingredients: z.array(z.string()),
});

// ---------------------------- .pick 方法，要想只保留某些 Key，使用 .pick ----------------------------

const JustTheName = Recipe.pick({ name: true });
type JustTheName = z.infer<typeof JustTheName>;

// ---------------------------- .omit 方法，要删除某些 Key，请使用 .omit ----------------------------

const NoIDRecipe = Recipe.omit({ id: true });

type NoIDRecipe = z.infer<typeof NoIDRecipe>;
// => { name: string, ingredients: string[] }

// ---------------------------- .partial 方法，受 TypeScript 内置的实用类型Partial的启发, .partial 方法使所有属性都是可选的 ----------------------------

const user = z.object({
  username: z.string(),
});
// { username: string }

// 我们可以创建一个 Partial 版本:

const partialUser = user.partial();
// { username?: string | undefined }

// ---------------------------- 未被识别的 keys | 默认情况下，Zod 对象的模式在解析过程中会剥离出未被识别的 keys ----------------------------

const person = z.object({
  name: z.string(),
});

person.parse({
  name: 'bob dylan',
  extraKey: 61,
});
// => { name: "bob dylan" }
// extraKey已经被剥离

// 默认行为与 .strip 方法一致 | 你可以使用.strip方法将一个对象模式重置为默认行为(剥离未识别的 keys)。

// ---------------------------- .passthrough 方法 | 如果你想通过未知的 keys，使用 .passthrough() ----------------------------

// 将不会删除多余的属性
person.passthrough().parse({
  name: 'bob dylan',
  extraKey: 61,
});
// => { name: "bob dylan", extraKey: 61 }

// ---------------------------- .strict 方法 | 你可以用.strict()来 禁止 未知键。如果输入中存在任何未知的 keys，Zod 将抛出一个错误。 ----------------------------

const person2 = z
  .object({
    name: z.string(),
  })
  .strict();

person2.parse({
  name: 'bob dylan',
  extraKey: 61, // 此属性多余，将抛出错误
});

// ----------------------------  ----------------------------
