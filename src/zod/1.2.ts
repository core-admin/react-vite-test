import { z } from 'zod';

const User = z.object({
  username: z.string(),
});

User.parse({ username: 'Ludwig' });

// 提取出推断的类型
type User = z.infer<typeof User>;

/*

type User = {
    username: string;
}

*/
