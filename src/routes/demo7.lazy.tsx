import Page from '@/components/page';
import { createLazyFileRoute } from '@tanstack/react-router';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

export const Route = createLazyFileRoute('/demo7')({
  component: Index,
});

const FormStateSchema = z
  .object({
    sex: z.string().min(1, '请选择性别'),
    email: z.string().nonempty('请填写邮箱').email('请填写正确的邮箱'),
    password: z.string().min(1, '请填写密码').min(6, '密码长度至少为6位'),
    confirmPassword: z.string().min(1, '请填写确认密码'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '两次密码不一致',
    path: ['confirmPassword'],
  });

interface FormState {
  sex: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const sexOptions = [
  { label: '男', value: '1' },
  { label: '女', value: '2' },
  { label: '未知', value: '3' },
];

function FormPage() {
  const form = useForm<FormState>({
    defaultValues: {
      sex: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(FormStateSchema),
  });
  const {
    register,
    control,
    formState: { errors, isSubmitting },
    reset,
    clearErrors,
  } = form;

  console.log('control >>>', register);

  const onSubmit: SubmitHandler<FormState> = data => {
    console.log('data >>>', data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mx-auto w-2/5">
        <FormField
          name="sex"
          control={control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="text-neutral-700">性别</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value} name={field.name}>
                    <SelectTrigger
                      className={cn({
                        'border-red-500 focus:border-red-200 focus:ring-offset-1 focus:ring-red-500 animate-shake focus:animate-shake':
                          !!errors.sex,
                      })}
                      ref={field.ref}
                    >
                      <SelectValue placeholder="性别" />
                    </SelectTrigger>
                    <SelectContent onCloseAutoFocus={field.onBlur}>
                      {sexOptions.map(option => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                {<FormMessage>{errors.sex?.message}</FormMessage>}
              </FormItem>
            );
          }}
        />
        <FormField
          name="email"
          control={control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="text-neutral-700">邮箱</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="邮箱"
                    className={cn(!!errors.email && 'ring-1 ring-red-500 focus-visible:ring-red-500 animate-shake')}
                  />
                </FormControl>
                {<FormMessage>{errors.email?.message}</FormMessage>}
              </FormItem>
            );
          }}
        />

        <FormField
          name="password"
          control={control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="text-neutral-700">密码</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="请填写密码"
                    className={cn(!!errors.password && 'ring-1 ring-red-500 focus-visible:ring-red-500 animate-shake')}
                  />
                </FormControl>
                {<FormMessage>{errors.password?.message}</FormMessage>}
              </FormItem>
            );
          }}
        />

        <FormField
          name="confirmPassword"
          control={control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="text-neutral-700">确认密码</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="confirmPassword"
                    placeholder="请再次输入密码"
                    className={cn(
                      !!errors.confirmPassword && 'ring-1 ring-red-500 focus-visible:ring-red-500 animate-shake',
                    )}
                  />
                </FormControl>
                {<FormMessage>{errors.confirmPassword?.message}</FormMessage>}
              </FormItem>
            );
          }}
        />

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
      </form>
    </Form>
  );
}

function Index() {
  return (
    <Page header="Welcome Home!">
      <FormPage />
    </Page>
  );
}
