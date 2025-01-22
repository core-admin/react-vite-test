import Page from '@/components/page';
import { createLazyFileRoute } from '@tanstack/react-router';
import { SubmitHandler, useForm, UseFormRegister, FieldError, Path } from 'react-hook-form';
import { z, ZodType } from 'zod';

export const Route = createLazyFileRoute('/demo6')({
  component: Index,
});

/**
 * 期望的数据结构形式
 */
interface FormData {
  email: string;
  githubUrl: string;
  yearsOfExperience: number;
  password: string;
  confirmPassword: string;
}

// type ValidFieldNames = 'email' | 'githubUrl' | 'yearsOfExperience' | 'password' | 'confirmPassword';

/**
 * 定义了表单字段组件所期望的属性
 */
interface FormFieldProps<T extends Record<string, any>> {
  // 输入字段的类型（例如，文本、密码）
  type: string;
  // 输入字段的占位符文本
  placeholder: string;

  // 输入字段的名称，对应于 ValidFieldNames 类型中定义的有效字段名称之一
  // name: keyof FormState;

  name: Path<T>;
  // 注册表单
  register: UseFormRegister<T>;
  // 错误信息
  error: FieldError | undefined;
  // 是否应将字段值视为数字
  valueAsNumber?: boolean;
}

const UserSchema: ZodType<FormData> = z
  .object({
    email: z.string().email('请输入正确的邮箱'),
    githubUrl: z.string().url('请输入正确的 URL').includes('github.com', { message: '无效的 GitHub URL' }),
    yearsOfExperience: z
      .number({ message: '请输入' })
      .min(1, '请输入 1-10 之间的数字')
      .max(10, '请输入 1-10 之间的数字'),
    password: z.string().min(8, '密码长度至少为8位').max(16, '密码长度在 8-16 位之间'),
    confirmPassword: z.string().nonempty('请输入确认密码'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '两次密码不一致',
    path: ['confirmPassword'],
  });

function FormField<T extends Record<string, any>>({
  type,
  placeholder,
  name,
  register,
  error,
  valueAsNumber,
}: FormFieldProps<T>) {
  return (
    <>
      <input type={type} placeholder={placeholder} {...register(name, { valueAsNumber })} />
      {error && <span className="error-message">{error.message}</span>}
    </>
  );
}

const mockSubmitApi = (data: FormData) => {
  const result = UserSchema.safeParse(data);
  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  const errors = Object.fromEntries(result.error.issues.map(issue => [issue.path[0], issue.message]));

  return {
    success: false,
    errors,
  };
};

const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    // resolver: zodResolver(UserSchema),
    defaultValues: {
      email: '',
      githubUrl: '',
      yearsOfExperience: undefined,
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async data => {
    const result = await mockSubmitApi(data);

    if (result.success) {
      alert('提交成功');
      console.log(result.data);
      return;
    }
    Object.entries(result.errors || []).forEach(([field, error]) => {
      setError(field as keyof FormData, { message: error });
    });
    console.log('errors >>>', result.errors);
  };

  return (
    <div className="blob-page mx-auto w-2/5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid col-auto">
          <h1 className="text-3xl font-bold mb-4">Zod & React-Hook-Form</h1>
          <FormField type="email" placeholder="Email" name="email" register={register} error={errors.email} />
          <FormField
            type="text"
            placeholder="GitHub URL"
            name="githubUrl"
            register={register}
            error={errors.githubUrl}
          />
          <FormField
            type="number"
            placeholder="工作经验（1-10 年）"
            name="yearsOfExperience"
            register={register}
            error={errors.yearsOfExperience}
            valueAsNumber
          />
          <FormField type="password" placeholder="密码" name="password" register={register} error={errors.password} />

          <FormField
            type="password"
            placeholder="确认密码"
            name="confirmPassword"
            register={register}
            error={errors.confirmPassword}
          />
          <button type="submit" className="submit-button">
            提交
          </button>
        </div>
      </form>
    </div>
  );
};

function Index() {
  return (
    <Page header="Welcome Home!">
      <div className="flex min-h-screen flex-col items-center justify-between">
        <Form />
      </div>
    </Page>
  );
}
