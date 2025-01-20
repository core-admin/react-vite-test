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
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async data => {
    await sleep(2000);
    console.log('data >>>', data);
  };
  return (
    <Page header="Welcome Home!">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mx-auto w-3/5">
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
        {errors.email && <p className="text-red-500 !mt-2">{errors.email.message}</p>}

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
        {errors.password && <p className="text-red-500 !mt-2">{errors.password.message}</p>}

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
        {errors.confirmPassword && <p className="text-red-500 !mt-2">{errors.confirmPassword.message}</p>}

        <Button type="submit" disabled={isSubmitting} className="block w-full">
          提交
        </Button>
      </form>
    </Page>
  );
}
