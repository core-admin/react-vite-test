import Page from '@/components/page';
import { createLazyFileRoute } from '@tanstack/react-router';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cn, sleep } from '@/lib/utils';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export const Route = createLazyFileRoute('/demo5')({
  component: Index,
});

const FormStateSchema = z
  .object({
    sex: z.string().min(1, '请选择性别'),

    // OK 按照正确的顺序校验
    // email: z.string().min(1, '请填写邮箱').email('请填写正确的邮箱'),

    // 有问题，min与regex的校验同时进行，当未填写时，会触发正则的错误提示，而非min的
    // email: z.string().min(1, '请填写邮箱').regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, '请填写正确的邮箱'),

    // 解决：1.使用第一种方式.min.email 2.使用一下方式，使用nonempty处理非空校验
    email: z.string().nonempty('请填写邮箱').email('请填写正确的邮箱'),

    password: z.string().min(1, '请填写密码').min(6, '密码长度至少为6位'),
    confirmPassword: z.string().min(1, '请填写确认密码'),
  })
  // 自定义校验：
  .refine(data => data.password === data.confirmPassword, {
    message: '两次密码不一致',
    // 指定错误信息显示在哪个字段（关联使用）
    path: ['confirmPassword'],
  });

const res = FormStateSchema.safeParse({
  sex: '',
  email: '',
  password: '',
  confirmPassword: '',
});
/*
  {
    "sex": [
      "请选择性别"
    ],
    "email": [
      "请填写邮箱",
      "请填写正确的邮箱"
    ],
    "password": [
      "请填写密码",
      "密码长度至少为6位"
    ],
    "confirmPassword": [
      "请填写确认密码"
    ]
  }
*/
console.log('FormStateSchema flatten errors >>>', res.error, res.error?.flatten().fieldErrors);

interface FormState {
  sex: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function Index() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
    getValues,
    clearErrors,
  } = useForm<FormState>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      sex: '',
    },
    resolver: zodResolver(FormStateSchema),
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
            name={register('sex').name}
            control={control}
            defaultValue="1"
            render={data => {
              const sexOptions = [
                { label: '男', value: '1' },
                { label: '女', value: '2' },
                { label: '未知', value: '3' },
              ];

              const { field } = data;
              const { value, onChange, onBlur, ref, name } = field;

              return (
                <Select onValueChange={onChange} value={value} name={name}>
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

        <div>
          <Input
            {...register('email')}
            type="email"
            placeholder="请填写邮箱"
            className={cn(!!errors.email && 'ring-1 ring-red-500 focus-visible:ring-red-500 animate-shake')}
          />
          {errors.email && <p className="text-red-500 py-1.5">{errors.email.message}</p>}
        </div>

        <div>
          <Input {...register('password')} type="password" placeholder="请填写密码" />
          {errors.password && <p className="text-red-500 py-1.5">{errors.password.message}</p>}
        </div>

        <div>
          <Input {...register('confirmPassword')} type="password" placeholder="请再次输入密码" />
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
