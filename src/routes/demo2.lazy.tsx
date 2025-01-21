import Page from '@/components/page';
import { createLazyFileRoute } from '@tanstack/react-router';
import { Path, RegisterOptions, SubmitHandler, useForm, UseFormRegister } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn, sleep } from '@/lib/utils';
import { forwardRef } from 'react';

export const Route = createLazyFileRoute('/demo2')({
  component: Index,
});

interface NameInputProps extends React.ComponentProps<'input'> {
  name: Path<FormState>;
  register: UseFormRegister<FormState>;
  registerOptions: RegisterOptions<FormState>;
}

const NameInput = forwardRef<HTMLInputElement, NameInputProps>(
  ({ name, register, registerOptions, className, ...props }, ref) => {
    return (
      <input
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className,
        )}
        {...register(name, registerOptions)}
        {...props}
        ref={ref}
      />
    );
  },
);
NameInput.displayName = 'NameInput';

const NameInput2 = forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className,
      )}
      {...props}
      ref={ref}
    />
  );
});
NameInput2.displayName = 'NameInput2';

interface FormState {
  name: string;
  name2: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * register email 的返回值
 *
 * {
 *   name: "email",
 *   onBlur: (event) => void,
 *   onChange: (event) => void,
 *   ref: (element: HTMLInputElement | null) => void,
 * }
 */

/**
 * 在自定义组件中，register 注册的方式不同，NameInput这个组件采用组件内部注册的方式（在组件内部执行register方法）将返回的属性传递给组件
 * 而在NameInput2这个组件中，采用外部注册的方式（在组件外部执行register方法）将返回的属性传递给组件
 *
 * 这两种注册方法的差异造成了，当我们提交表单校验时，焦点focus的位置不对，在以下代码中，focus将始终从NameInput2组件开始。
 *
 * 原因分析：
 *  - 当传递 register 函数时，register 的执行发生在组件内部，这会影响 react-hook-form 的注册顺序。
 *  - 而直接传递 register 执行结果时，注册发生在父组件，保持了正确的注册顺序。
 *
 * 所以在封装自定义表单组件时，应该优先考虑传递 register 执行后的结果，而不是传递 register 函数。
 */

function Index() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
    getValues,
    clearErrors,
  } = useForm<FormState>({
    shouldFocusError: true,
  });

  const onSubmit: SubmitHandler<FormState> = async data => {
    await sleep(1000);
    console.log('data >>>', data);
  };

  return (
    <Page header="Welcome Home!">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mx-auto w-2/5">
        <div>
          <NameInput
            name="name"
            register={register}
            registerOptions={{ required: '请填写姓名' }}
            placeholder="请填写姓名"
          />
          {errors.name && <p className="text-red-500 py-1.5">{errors.name.message}</p>}
        </div>

        <div>
          <NameInput2 {...register('name2', { required: '请填写姓名2' })} placeholder="请填写姓名2" />
          {errors.name2 && <p className="text-red-500 py-1.5">{errors.name2.message}</p>}
        </div>
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

        {isSubmitSuccessful && (
          <div className="mt-5">
            <pre>{JSON.stringify(getValues(), null, 2)}</pre>
          </div>
        )}
      </form>
    </Page>
  );
}
