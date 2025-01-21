import Page from '@/components/page';
import { createLazyFileRoute } from '@tanstack/react-router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { sleep } from '@/lib/utils';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

interface Inputs {
  email: string;
  password: string;
  confirmPassword: string;
}

function Index() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
    getValues,
    clearErrors,
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async data => {
    await sleep(1000);
    console.log('data >>>', data);
  };
  return (
    <Page header="Welcome Home!">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mx-auto w-2/5">
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
