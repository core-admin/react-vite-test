

好的，我来详细讲解 Controller 组件的使用。Controller 主要用于集成第三方组件或自定义受控组件。

## 1. Controller 基础用法

```typescript
import { Controller, useForm } from "react-hook-form";
import Select from "react-select"; // 示例第三方组件

interface FormValues {
  select: { label: string; value: string };
}

function Form() {
  const { control } = useForm<FormValues>();

  return (
    <form>
      <Controller
        name="select"
        control={control}
        defaultValue={{ label: "选项1", value: "1" }}
        rules={{ required: "必选项" }}
        render={({ field, fieldState, formState }) => (
          <Select 
            {...field}
            options={[
              { label: "选项1", value: "1" },
              { label: "选项2", value: "2" }
            ]}
          />
        )}
      />
    </form>
  );
}
```

## 2. Controller 完整参数说明

```typescript
<Controller
  // 必需参数
  name="fieldName"      // 字段名
  control={control}     // 表单控制器
  
  // 可选参数
  defaultValue={value}  // 默认值
  rules={...}          // 验证规则
  shouldUnregister     // 组件卸载时是否注销
  disabled             // 是否禁用
  
  // render 函数，返回实际的组件
  render={({
    field: {
      value,
      onChange,
      onBlur,
      ref,
      name,
      disabled
    },
    fieldState: {
      invalid,
      isTouched,
      isDirty,
      error
    },
    formState
  }) => {
    return <Component {...field} />;
  }}
/>
```

## 3. 常见集成示例

### 3.1 集成 React Select

```typescript
import Select from "react-select";

function SelectForm() {
  const { control } = useForm();

  return (
    <Controller
      name="select"
      control={control}
      defaultValue={null}
      rules={{ required: "请选择一个选项" }}
      render={({ field, fieldState: { error } }) => (
        <div>
          <Select
            {...field}
            options={[
              { label: "选项1", value: "1" },
              { label: "选项2", value: "2" }
            ]}
            // 自定义onChange处理
            onChange={(option) => field.onChange(option)}
            // 自定义value处理
            value={field.value}
            // 错误状态样式
            className={error ? "error" : ""}
          />
          {error && <span>{error.message}</span>}
        </div>
      )}
    />
  );
}
```

### 3.2 集成 MUI TextField

```typescript
import { TextField } from "@mui/material";

function MUIForm() {
  const { control } = useForm();

  return (
    <Controller
      name="textField"
      control={control}
      defaultValue=""
      rules={{
        required: "此字段必填",
        minLength: {
          value: 3,
          message: "最少3个字符"
        }
      }}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          error={!!error}
          helperText={error?.message}
          label="输入框"
          variant="outlined"
        />
      )}
    />
  );
}
```

### 3.3 集成 Ant Design 组件

```typescript
import { DatePicker, Form } from "antd";

function AntdForm() {
  const { control } = useForm();

  return (
    <Controller
      name="datePicker"
      control={control}
      defaultValue={null}
      render={({ field }) => (
        <Form.Item 
          label="选择日期"
          validateStatus={fieldState.error ? "error" : "success"}
          help={fieldState.error?.message}
        >
          <DatePicker
            {...field}
            onChange={(date) => {
              field.onChange(date);
            }}
            selected={field.value}
          />
        </Form.Item>
      )}
    />
  );
}
```

## 4. 高级用法

### 4.1 自定义受控组件

```typescript
function CustomInput({ value, onChange, onBlur }) {
  return (
    <div className="custom-input">
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
      />
      <span className="suffix">后缀</span>
    </div>
  );
}

function Form() {
  const { control } = useForm();

  return (
    <Controller
      name="customField"
      control={control}
      defaultValue=""
      render={({ field, fieldState }) => (
        <div>
          <CustomInput {...field} />
          {fieldState.error && (
            <span className="error">{fieldState.error.message}</span>
          )}
        </div>
      )}
    />
  );
}
```

### 4.2 处理复杂值转换

```typescript
function ComplexForm() {
  const { control } = useForm();

  return (
    <Controller
      name="price"
      control={control}
      defaultValue=""
      render={({ field }) => (
        <input
          {...field}
          onChange={(e) => {
            // 处理金额格式
            const value = e.target.value;
            const formattedValue = new Intl.NumberFormat('zh-CN', {
              style: 'currency',
              currency: 'CNY'
            }).format(value);
            
            field.onChange(formattedValue);
          }}
        />
      )}
    />
  );
}
```

### 4.3 条件渲染

```typescript
function ConditionalForm() {
  const { control, watch } = useForm();
  const type = watch("type");

  return (
    <form>
      <Controller
        name="type"
        control={control}
        defaultValue="text"
        render={({ field }) => (
          <select {...field}>
            <option value="text">文本</option>
            <option value="number">数字</option>
          </select>
        )}
      />

      {type === "text" && (
        <Controller
          name="textValue"
          control={control}
          render={({ field }) => <input {...field} type="text" />}
        />
      )}

      {type === "number" && (
        <Controller
          name="numberValue"
          control={control}
          render={({ field }) => <input {...field} type="number" />}
        />
      )}
    </form>
  );
}
```

## 5. 注意事项

1. Controller 的 `name` 和 `control` 是必需的参数

2. 使用 `defaultValue` 而不是直接在组件中设置默认值

3. `render` 函数中的 `field` 对象包含了所有需要传递给受控组件的属性

4. 处理第三方组件时，可能需要自定义 `onChange` 和 `value` 的处理逻辑

5. 使用 `fieldState` 可以获取字段的验证状态和错误信息

6. 如果需要访问表单的整体状态，可以使用 `formState` 参数

参考资料：
- [React Hook Form - Controller API](https://react-hook-form.com/api/usecontroller/controller)
- [React Hook Form - Controller 使用指南](https://react-hook-form.com/get-started#IntegratingControlledInputs)