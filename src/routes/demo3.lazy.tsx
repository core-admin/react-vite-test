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

export const Route = createLazyFileRoute('/demo3')({
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

function Index() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    control,
    reset,
    getValues,
    clearErrors,
  } = useForm<FormState>({
    defaultValues: {
      enable: true,
      sex: undefined,
    },
  });

  const onSubmit: SubmitHandler<FormState> = async data => {
    await sleep(1000);
    console.log('data >>>', data);
  };
  return (
    <Page header="Welcome Home!">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mx-auto w-2/5">
        <div>
          <Controller
            // name="sex"

            name={register('sex').name}
            control={control}
            rules={{ required: '请选择性别' }}
            defaultValue=""
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
          <Button type="button" variant="outline" className="block w-full" onClick={() => reset()}>
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
