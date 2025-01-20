eact-hook-form 结合 shadcn/ui form 组件的使用与对比

## 1. 基本安装和配置

```bash
npm install react-hook-form
```

如果需要使用 schema 验证,还需要安装相关依赖:
```bash
npm install @hookform/resolvers yup zod
```

## 2. 基础表单示例

```typescript
import { useForm, SubmitHandler } from "react-hook-form";

interface IFormInputs {
  username: string;
  email: string;
  password: string;
}

function App() {
  const { 
    register, 
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm<IFormInputs>();

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("username", { required: "用户名是必填的" })} />
      {errors.username && <p>{errors.username.message}</p>}
      
      <input {...register("email", { 
        required: "邮箱是必填的",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "邮箱格式不正确"
        }
      })} />
      {errors.email && <p>{errors.email.message}</p>}
      
      <input type="submit" />
    </form>
  );
}
```

## 3. 主要 API 说明

### 3.1 useForm Hook 返回的主要方法

```typescript
const {
  register,           // 注册表单字段
  handleSubmit,       // 处理表单提交
  formState,          // 表单状态
  watch,              // 监听字段值变化
  setValue,           // 设置字段值
  reset,              // 重置表单
  clearErrors,        // 清除错误
  setError,           // 设置错误
  trigger            // 触发验证
} = useForm();
```

### 3.2 register 方法的使用

```typescript
// 基础用法
<input {...register("fieldName")} />

// 带验证规则
<input {...register("fieldName", {
  required: "错误信息",
  minLength: { value: 4, message: "最小长度为 4" },
  maxLength: { value: 20, message: "最大长度为 20" },
  pattern: { value: /[A-Za-z]/, message: "只能输入字母" }
})} />
```

### 3.3 表单验证模式

```typescript
const { register } = useForm({
  mode: "onSubmit",     // 提交时验证(默认)
  mode: "onChange",     // 值变化时验证
  mode: "onBlur",       // 失焦时验证
  mode: "onTouched",    // 首次失焦后值变化时验证
  mode: "all"           // 所有时机都验证
});
```

## 4. 高级用法

### 4.1 Schema 验证 (使用 Zod)

```typescript
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  username: z.string().min(3, "用户名至少3个字符"),
  email: z.string().email("邮箱格式不正确"),
  age: z.number().min(18, "年龄必须大于18岁")
});

function App() {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema)
  });
  
  return (
    <form>
      <input {...register("username")} />
      <input {...register("email")} />
      <input type="number" {...register("age", { valueAsNumber: true })} />
    </form>
  );
}
```

### 4.2 使用 Controller 组件集成第三方组件

```typescript
import { Controller } from "react-hook-form";
import Select from "react-select";

function App() {
  const { control } = useForm();
  
  return (
    <form>
      <Controller
        name="select"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <Select 
            {...field}
            options={[
              { value: "1", label: "选项1" },
              { value: "2", label: "选项2" }
            ]}
          />
        )}
      />
    </form>
  );
}
```

### 4.3 表单数组字段处理

```typescript
import { useFieldArray } from "react-hook-form";

function App() {
  const { control } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });
  
  return (
    <form>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(`items.${index}.name`)} />
          <button type="button" onClick={() => remove(index)}>删除</button>
        </div>
      ))}
      <button type="button" onClick={() => append({ name: "" })}>
        添加项目
      </button>
    </form>
  );
}
```

## 5. 需要注意的差异点

1. **register 方法的使用差异**:
- v6 版本: `ref={register}`
- v7 版本: `{...register("fieldName")}`

2. **验证模式的差异**:
```typescript
// onChange 模式
const { register } = useForm({ mode: "onChange" });

// onSubmit 模式 (默认)
const { register } = useForm();
```

3. **Controller vs register**:
- `register`: 用于原生 HTML 输入元素
- `Controller`: 用于第三方组件或受控组件

4. **异步验证的处理**:
```typescript
{...register("username", {
  validate: async (value) => {
    const response = await checkUsername(value);
    return response.isValid || "用户名已存在";
  }
})}
```

## 6. 性能优化建议

1. 使用 `defaultValues` 预设值而不是 `setValue`:
```typescript
const { register } = useForm({
  defaultValues: {
    username: "默认值"
  }
});
```

2. 避免不必要的重渲染:
```typescript
// 推荐
const { watch } = useForm();
const watchedValue = watch("field");

// 不推荐
const { watch } = useForm();
const allValues = watch(); // 监听所有字段会导致频繁重渲染
```

3. 合理使用 `mode` 配置:
```typescript
// 对于复杂表单，避免使用 onChange 模式
const { register } = useForm({
  mode: "onBlur" // 推荐使用 onBlur 或 onSubmit
});
```

参考资料：
- [React Hook Form 官方文档](https://react-hook-form.com/)
- [React Hook Form - Get Started](https://react-hook-form.com/get-started)

## @hookform/resolvers yup 是干嘛用的，yup与zod的区别是什么？



让我来详细解释一下 @hookform/resolvers、yup 和 zod 的关系及区别。

## 1. @hookform/resolvers 的作用

`@hookform/resolvers` 是 React Hook Form 的一个解析器包，它的主要作用是：

1. 连接 React Hook Form 和各种验证库（如 Yup、Zod、Joi 等）
2. 将验证库的验证结果转换为 React Hook Form 可以理解的格式

```typescript
// 使用 Yup
import { yupResolver } from '@hookform/resolvers/yup';

// 使用 Zod
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm({
  resolver: yupResolver(schema) // 或 zodResolver(schema)
});
```

## 2. Yup vs Zod 主要区别

### 2.1 语法对比

```typescript
// Yup 示例
import * as yup from 'yup';

const yupSchema = yup.object({
  name: yup.string()
    .required('姓名必填')
    .min(2, '最少2个字符'),
  age: yup.number()
    .required()
    .positive()
    .integer(),
  email: yup.string()
    .email('邮箱格式不正确')
});

// Zod 示例
import { z } from 'zod';

const zodSchema = z.object({
  name: z.string()
    .min(2, '最少2个字符'),
  age: z.number()
    .positive()
    .int(),
  email: z.string()
    .email('邮箱格式不正确')
});
```

### 2.2 类型推断

```typescript
// Yup 类型推断
type YupSchema = yup.InferType<typeof yupSchema>;

// Zod 类型推断
type ZodSchema = z.infer<typeof zodSchema>;
```

### 2.3 主要特点对比

#### Yup 特点：
1. 更成熟，历史更长
2. API 设计更偏向 JavaScript 风格
3. 文件体积较大
4. 类型推断相对较弱
5. 验证性能相对较慢

```typescript
// Yup 特有的链式调用风格
const schema = yup.object().shape({
  name: yup.string()
    .required()
    .when('age', {
      is: (age: number) => age >= 18,
      then: (schema) => schema.min(3),
      otherwise: (schema) => schema.min(2)
    })
});
```

#### Zod 特点：
1. 更现代，专为 TypeScript 设计
2. 类型推断更强大
3. 文件体积更小
4. 验证性能更好
5. API 设计更简洁

```typescript
// Zod 的类型安全特性
const schema = z.object({
  name: z.string(),
  age: z.number(),
}).transform((data) => ({
  ...data,
  // 类型安全的转换
  isAdult: data.age >= 18
}));
```

## 3. 实际使用示例对比

### 3.1 表单验证示例

```typescript
// Yup 版本
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  username: yup.string()
    .required('用户名必填')
    .min(4, '用户名最少4个字符'),
  password: yup.string()
    .required('密码必填')
    .matches(/[0-9]/, '密码必须包含数字')
}).required();

function YupForm() {
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema)
  });

  return (
    <form>
      <input {...register("username")} />
      <input {...register("password")} />
    </form>
  );
}

// Zod 版本
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  username: z.string()
    .min(4, '用户名最少4个字符'),
  password: z.string()
    .regex(/[0-9]/, '密码必须包含数字')
});

function ZodForm() {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema)
  });

  return (
    <form>
      <input {...register("username")} />
      <input {...register("password")} />
    </form>
  );
}
```

### 3.2 复杂验证示例

```typescript
// Yup 复杂验证
const yupSchema = yup.object({
  items: yup.array().of(
    yup.object({
      name: yup.string().required(),
      value: yup.number().when('name', {
        is: 'special',
        then: yup.number().min(10),
        otherwise: yup.number().min(0)
      })
    })
  )
});

// Zod 复杂验证
const zodSchema = z.object({
  items: z.array(
    z.object({
      name: z.string(),
      value: z.number()
    }).refine(
      (data) => {
        if (data.name === 'special') {
          return data.value >= 10;
        }
        return data.value >= 0;
      },
      { message: '值不符合要求' }
    )
  )
});
```

## 4. 选择建议

1. 如果你的项目是新项目，推荐使用 Zod：
   - 更好的 TypeScript 支持
   - 更好的性能
   - 更小的包体积

2. 如果是现有项目或者需要更复杂的条件验证，可以选择 Yup：
   - 更成熟的生态
   - 更多的验证规则
   - 更灵活的条件验证

3. 如果项目对包大小特别敏感，建议使用 Zod

4. 如果团队更熟悉 JavaScript，可以选择 Yup

参考资料：
- [Zod 文档](https://zod.dev)
- [Yup 文档](https://github.com/jquense/yup)
- [@hookform/resolvers 文档](https://github.com/react-hook-form/resolvers)