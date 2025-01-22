import Page from '@/components/page';
import { createLazyFileRoute } from '@tanstack/react-router';
import { SubmitHandler, useForm, Controller, useController, UseControllerProps, FieldValues } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { cn, sleep } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useId } from 'react';

export const Route = createLazyFileRoute('/demo4')({
  component: Index,
});

interface SwitchDisabledProps<T extends FieldValues> {
  registerFormProps: UseControllerProps<T>;
}

function SwitchDisabled<T extends FieldValues>({ registerFormProps }: SwitchDisabledProps<T>) {
  const id = useId();

  const { field } = useController<T>(registerFormProps);

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor={id}>是否启用</Label>
      <Switch id={id} checked={field.value} onCheckedChange={field.onChange} />
    </div>
  );
}

interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
  sex: string;
  enable: boolean;
}

const sexOptions = [
  { label: '男', value: '1' },
  { label: '女', value: '2' },
  { label: '未知', value: '3' },
];

interface _ResetOptions {
  /**
   * 是否保留字段的"脏"状态标记
   * 只保留字段是否被修改过的标记（true/false）不保留具体的值
   *
   * const form = useForm({
   *  defaultValues: { name: 'Tom' }
   * });
   *
   * 用户输入 "Jerry" >>> isDirty = true
   *
   * form.reset({ name: '' }, { keepDirty: true });
   * 值会被重置为 ""，但 isDirty 仍为 true
   */
  keepDirty: boolean;
  /**
   * 是否保留被修改过的字段值
   * 保留被用户修改过的字段的实际值
   * 未修改的字段会被重置
   *
   * defaultValues: { name: 'Tom', age: 20 }
   *
   * 用户修改 name 为 "Jerry"
   * reset(undefined, { keepDirtyValues: true });
   *
   * name 保持为 "Jerry"（因为被修改过）
   * age 重置为 20（因为未被修改）
   *
   * values >>> { name: 'Jerry', age: 20 }
   *
   * https://github.com/react-hook-form/react-hook-form/issues/8341
   */
  keepDirtyValues: boolean;
  /**
   * 是否保留错误信息
   */
  keepErrors: boolean;
  /**
   * 是否保留所有当前字段值
   * 保留表单所有字段的当前值
   * 不管字段是否被修改过
   *
   * defaultValues: { name: 'Tom', age: 20 }
   *
   * 用户修改 name 为 "Jerry"
   * reset(undefined, { keepValues: true });
   *
   * name 保持为 "Jerry"，age 保持为 20，所有值都保持不变
   */
  keepValues: boolean;
  /**
   * 是否保留默认值
   */
  keepDefaultValues: boolean;
  /**
   * 是否保留提交状态
   */
  keepIsSubmitted: boolean;
  /**
   * 是否保留提交成功状态
   */
  keepIsSubmitSuccessful: boolean;
  /**
   * 是否保留触摸状态
   */
  keepTouched: boolean;
  /**
   * 是否保留验证进行中的状态，通常用于异步验证场景
   */
  keepIsValidating: boolean;
  /**
   * 是否保留验证结果状态，控制是否保留表单字段的验证结果状态，表示字段是否通过验证
   */
  keepIsValid: boolean;
  /**
   * 是否保留提交次数
   */
  keepSubmitCount: boolean;
}

/**
 *
 * 默认值
 * https://github.com/react-hook-form/react-hook-form/issues/10480
 */

function Index() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    /**
     * reset 问题还是挺多的，需要实际使用时多测试
     * 如：resetOptions.keepDirtyValues 设置的值并不能作用到reset方法的配置对象上，
     * 使用时还需要手动设置：reset(undefined, { keepDirtyValues: true })
     */
    reset,
    getValues,
    clearErrors,
  } = useForm<FormState>({
    values: {
      sex: '1',
      enable: true,
      email: '123@123.com',
      password: '',
      confirmPassword: '',
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  const onSubmit: SubmitHandler<FormState> = async data => {
    await sleep(1000);
    console.log('data >>>', data);
  };

  // console.log('dirtyFields.password >>>', dirtyFields.password);

  return (
    <Page header="Welcome Home!">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mx-auto w-2/5">
        <div>
          <Controller
            // name="sex"

            name={register('sex').name}
            control={control}
            rules={{ required: '请选择性别' }}
            render={data => {
              /**
               * {
               *   field: {
               *     name: 'sex',
               *     onChange: (event: any) => void,
               *     onBlur: () => void,
               *     value: any,
               *     ref: (elm: any) => void,
               *   },
               *   fieldState: {
               *     error: undefined,
               *     invalid: boolean,
               *     isDirty: boolean,
               *     isTouched: boolean,
               *     isValidating: boolean,
               *   },
               *   formState: >>> 对应useForm的返回值中的formState
               * }
               */
              console.log('Controller render fn data >>>', data);

              const { field } = data;
              const { value, onChange, onBlur, ref, name } = field;

              /**
               * Select 组件依然存在校验错误时，焦点顺序错误问题（当前组件位于第一项，而焦点在第二项，即使重新设置ref也无济于事）
               *
               * 解决：将 Controller 组件的name属性值替换为使用 register 返回的 name 值，用于正确处理焦点顺序。
               * issues:https://github.com/radix-ui/primitives/issues/2590#issuecomment-2537519392
               *
               * react-hook-form 的 register 方法会自动处理原生表单元素的默认值
               * 自定义组件（如 Select）需要明确设置默认值
               * Controller 需要手动处理自定义组件的默认值
               */
              return (
                <Select onValueChange={onChange} value={value || ''} name={name}>
                  <SelectTrigger
                    className={cn({
                      'border-red-500 focus:border-red-200 focus:ring-offset-1 focus:ring-red-500 animate-shake focus:animate-shake':
                        !!errors.sex,
                    })}
                    ref={ref}
                  >
                    <SelectValue placeholder="请选择性别" />
                  </SelectTrigger>
                  <SelectContent onCloseAutoFocus={onBlur}>
                    {sexOptions.map(option => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />
          {errors.sex && <p className="text-red-500 py-1.5">{errors.sex.message}</p>}
        </div>

        <SwitchDisabled
          registerFormProps={{
            control: control,
            name: register('enable').name,
          }}
        />

        <Separator className="bg-blue-500" />

        <div>
          <Input
            {...register('email', {
              required: '请填写邮箱',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: '请填写正确的邮箱',
              },
            })}
            type="email"
            placeholder="请填写邮箱"
          />
          {errors.email && <p className="text-red-500 py-1.5">{errors.email.message}</p>}
        </div>

        <div>
          <Input
            {...register('password', {
              required: '请填写密码',
              minLength: {
                value: 6,
                message: '密码长度至少为6位',
              },
            })}
            type="password"
            placeholder="请填写密码"
          />
          {errors.password && <p className="text-red-500 py-1.5">{errors.password.message}</p>}
        </div>

        <div>
          <Input
            {...register('confirmPassword', {
              required: '请填写确认密码',
              validate: value => {
                return value === getValues('password') || '两次密码不一致';
              },
            })}
            type="password"
            placeholder="请再次输入密码"
          />
          {errors.confirmPassword && <p className="text-red-500 py-1.5">{errors.confirmPassword.message}</p>}
        </div>

        <div className="space-y-4">
          <Button type="submit" disabled={isSubmitting} className="block w-full">
            提交
          </Button>
          <Button
            type="button"
            variant="outline"
            className="block w-full"
            onClick={() => reset(undefined, { keepDirtyValues: true })}
          >
            重置表单
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={Object.keys(errors).length === 0}
            className="block w-full"
            onClick={() => clearErrors()}
          >
            重置错误
          </Button>
        </div>

        <div className="mt-5">
          <pre>{JSON.stringify(getValues(), null, 2)}</pre>
        </div>
      </form>
    </Page>
  );
}
