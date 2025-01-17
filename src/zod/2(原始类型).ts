// 原始类型

import { z } from 'zod';

// 原始值类型
z.string();
z.number();
z.bigint();
z.boolean();
z.date();
z.symbol();

// 空类型
z.undefined();
z.null();
z.void(); // 接受 undefined

// 任意类型
// 允许任意类型的值
z.any();
z.unknown();

// never 类型
// 不允许值类型存在
z.never();
