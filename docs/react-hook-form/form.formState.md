我来详细解释一下 react-hook-form 中 formState 对象的各个属性及其作用：

### formState 主要属性

1. **isDirty**

- 类型: `boolean`
- 作用: 表示表单是否被修改过
- 当用户修改了任何表单字段的值时变为 `true`

2. **dirtyFields**

- 类型: `object`
- 作用: 记录所有被修改过的字段
- 例如: `{ email: true, username: true }`

3. **touched**

- 类型: `object`
- 作用: 记录用户交互过的字段
- 当字段被聚焦后失焦时会被标记

4. **isSubmitted**

- 类型: `boolean`
- 作用: 表示表单是否已经提交过
- 提交后永久为 `true`，直到表单重置

5. **isSubmitting**

- 类型: `boolean`
- 作用: 表示表单是否正在提交中
- 提交过程中为 `true`

6. **isSubmitSuccessful**

- 类型: `boolean`
- 作用: 表示表单是否提交成功
- 注意：`react-hook-form` 中的 `isSubmitSuccessful` 是在表单提交成功且没有验证错误时才会被设置为 `true`。但是它并不知道你的 API 请求是否真的成功了。`isSubmitSuccessful` 只反映表单的提交状态（没有验证错误），而不是 API 请求的结果

1. **errors**

- 类型: `object`
- 作用: 包含所有表单验证错误信息
- 例如: `{ email: { type: 'required', message: '请输入邮箱' } }`

1. **isValid**

- 类型: `boolean`
- 作用: 表示整个表单是否通过验证

### 使用示例

```tsx
import { useForm } from 'react-hook-form';

function MyForm() {
  const { formState } = useForm();

  const {
    isDirty,
    dirtyFields,
    touched,
    isSubmitted,
    isSubmitting,
    isSubmitSuccessful,
    errors,
    isValid,
  } = formState;

  return (
    <div>
      {isDirty && <p>表单已被修改</p>}
      {isSubmitting && <p>正在提交...</p>}
      {errors.email && <p>邮箱错误：{errors.email.message}</p>}
    </div>
  );
}
```

### 实用技巧

1. **性能优化**

- formState 的属性都是按需订阅的
- 只有你实际使用了某个属性，它才会触发重渲染

2. **表单状态监听**

```tsx
useEffect(() => {
  console.log('表单状态：', formState);
}, [formState]);
```

3. **条件渲染**

```tsx
{
  isValid && <button type="submit">提交</button>;
}
{
  isSubmitting && <LoadingSpinner />;
}
```

这些状态对于构建复杂的表单交互非常有用，可以帮助你实现：

- 表单验证反馈
- 提交状态展示
- 脏数据检测
- 用户交互跟踪等功能。
