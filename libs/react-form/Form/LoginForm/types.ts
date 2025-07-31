import type { schema } from './constants';
import type * as z from 'zod';

type LoginFormSchema = z.infer<typeof schema>;

export type { LoginFormSchema };
