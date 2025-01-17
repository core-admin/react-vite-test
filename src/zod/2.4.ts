import { z } from 'zod';

// z.string() 只验证数据类型，不验证具体的值，比如：'' 空字符串，如果不能为空，需要设置 min 长度
const res1 = z.string().trim().safeParse('');

const res2 = z.string().min(1).safeParse(''); // success: false >>> "String must contain at least 1 character(s)"

// 验证
z.string().max(5); // 验证字符串的长度必须小于等于 5
z.string().min(5); // 验证字符串的长度必须大于等于 5

z.string().length(5); // 验证字符串的长度必须严格等于 5

z.string().email(); // 验证字符串是否是有效的电子邮件地址

z.string().url(); // 验证字符串是否是有效的 URL

z.string().emoji(); // 验证字符串是否是有效的 Emoji

z.string().uuid(); // 验证字符串是否是有效的 UUID

z.string().cuid(); // 验证字符串是否是有效的 CUID

z.string().cuid2(); // 验证字符串是否是有效的 CUID2

z.string().ulid(); // 验证字符串是否是有效的 ULID

z.string().duration(); // 验证字符串是否是有效的 Duration

z.string().regex(/^[a-z]+$/); // 验证字符串是否匹配正则表达式

z.string().includes('foo'); // 验证字符串是否包含 'foo'

z.string().startsWith('foo'); // 验证字符串是否以 'foo' 开头

z.string().endsWith('foo'); // 验证字符串是否以 'foo' 结尾

z.string().datetime(); // ISO 8601；默认值为无 UTC 偏移，选项见下文

z.string().ip(); // 默认为 IPv4 和 IPv6，选项见下文

// 转变
z.string().trim(); // 减除空白
z.string().toLowerCase(); // 小写化
z.string().toUpperCase(); // 大写化
