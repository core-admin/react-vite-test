import { z } from 'zod';

// 所有属性都是默认需要的
const Dog = z.object({
  name: z.string(),
  age: z.number(),
});

Dog.parse({ name: 'Fido', age: 3 }); // success
Dog.parse({ name: 'Fido' }); // error

// 像这样提取推断出的类型
type Dog = z.infer<typeof Dog>;

// 相当于:
type _Dog = {
  name: string;
  age: number;
};

// ---------------------------- .shape 来访问特定键的模式，提取特定键的模式 ----------------------------

const nameSchema = Dog.shape.name; // => string schema
const ageSchema = Dog.shape.age; // => number schema

const newDog = z.object({
  name: z.string(),
  age2: Dog.shape.age,
});
/*
  type _NewDog = {
    name: string;
    age2: number;
  }
*/
type _NewDog = z.infer<typeof newDog>;

// ---------------------------- .extend 方法在对象模式中添加额外的字段，当然也可以覆盖字段 ----------------------------

const DogWithBreed = Dog.extend({
  breed: z.string(),
  age: z.number().optional(),
});

/*
  type _DogWithBreed = {
    name: string;
    age?: number | undefined;
    breed: string;
  }
*/
type _DogWithBreed = z.infer<typeof DogWithBreed>;

// ---------------------------- .merge 方法 相当于 A.extend(B.shape) ----------------------------

const BaseTeacher = z.object({ students: z.array(z.string()) });
const HasID = z.object({ id: z.string() });

const Teacher = BaseTeacher.merge(HasID);
type Teacher = z.infer<typeof Teacher>; // => { students: string[], id: string }

// 如果两个模式共享 keys，那么 B 的属性将覆盖 A 的属性。返回的模式也继承了 "unknownKeys 密钥 "策略(strip/strict/passthrough+)和 B 的全面模式。
