## 1. 什么是 control

`control` 是 react-hook-form 的一个核心对象，由 `useForm` hook 返回：

```tsx
const { control } = useForm<FormValues>();
```

它的主要职责是：

- 管理表单状态（值、错误、验证状态等）
- 处理表单字段的注册和注销
- 协调受控组件与表单状态的同步
- 优化表单重渲染性能

## 2. 使用场景

### 2.1 原生表单元素

对于原生表单元素，直接使用 `register` 即可：

```tsx
const { register } = useForm();

// 原生input不需要control
<input {...register('email')} />;
```

### 2.2 自定义/第三方组件

对于非原生表单组件，需要使用 `Controller` 组件 + `control` 属性：

```tsx
const { control } = useForm();

// 自定义Select组件需要control
<Controller
  name="sex"
  control={control}
  rules={{ required: '请选择性别' }}
  render={({ field }) => (
    <Select onValueChange={field.onChange} value={field.value} name={field.name} ref={field.ref}>
      {/* Select的内容 */}
    </Select>
  )}
/>;
```

## 3. Controller 组件详解

### 3.1 基本属性

```tsx
<Controller
  name="fieldName" // 字段名
  control={control} // 表单控制对象
  defaultValue="" // 默认值（可选）
  rules={{}} // 验证规则（可选）
  render={({ field }) => {
    // 渲染UI组件
  }}
/>
```

### 3.2 field 对象包含的属性

```tsx
{
  value: any,              // 字段当前值
  onChange: (e) => void,   // 值更新处理函数
  onBlur: () => void,      // 失焦处理函数
  name: string,            // 字段名
  ref: (elm) => void      // DOM引用
}
```

## 4. 实际应用示例

### 4.1 基础用法

```tsx
function MyForm() {
  const { control } = useForm({
    defaultValues: {
      select: '',
    },
  });

  return (
    <Controller
      control={control}
      name="select"
      render={({ field }) => <Select value={field.value} onValueChange={field.onChange} />}
    />
  );
}
```

### 4.2 带验证规则

```tsx
<Controller
  control={control}
  name="select"
  rules={{ required: '此项必填' }}
  render={({ field, fieldState: { error } }) => (
    <>
      <Select value={field.value} onValueChange={field.onChange} className={error ? 'error' : ''} />
      {error && <span>{error.message}</span>}
    </>
  )}
/>
```

### 4.3 自定义值转换

```tsx
<Controller
  control={control}
  name="number"
  render={({ field }) => (
    <Select
      value={field.value?.toString()}
      // 将字符串转换为数字
      onValueChange={value => field.onChange(parseInt(value))}
    />
  )}
/>
```

## 5. 最佳实践

### 5.1 使用 FormField 组件

```tsx
import { FormField, FormItem, FormLabel, FormMessage } from './form-components';

function MyForm() {
  const form = useForm();

  return (
    <FormField
      control={form.control}
      name="field"
      render={({ field }) => (
        <FormItem>
          <FormLabel>选项</FormLabel>
          <Select {...field} />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
```

### 5.2 抽象可复用的表单控件

```tsx
interface ControlledSelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: Array<{ label: string; value: string }>;
}

function ControlledSelect<T extends FieldValues>({ name, control, label, options }: ControlledSelectProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value} options={options} />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
```

## 6. 注意事项

1. `control` 对象不应该频繁变化，通常在组件顶层通过 `useForm` 获取
2. 对于复杂表单，建议使用 `FormProvider` 来避免 `control` 的层层传递
3. `Controller` 的 `name` 属性应该与表单数据结构匹配
4. 使用 TypeScript 时，建议为表单值定义接口以获得更好的类型提示

这样的组织方式可以让表单代码更容易维护和扩展，同时保持良好的性能和类型安全。
