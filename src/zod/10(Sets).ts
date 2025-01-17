import { z } from 'zod';

const numberSet = z.set(z.number());
type numberSet = z.infer<typeof numberSet>; // Set<number>
