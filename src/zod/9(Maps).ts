import { z } from 'zod';

const stringNumberMap = z.map(z.string(), z.number());

type StringNumberMap = z.infer<typeof stringNumberMap>; // type StringNumber = Map<string, number>
