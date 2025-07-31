import type { schema } from './constants';
import type * as z from 'zod';

type SignUpFormSchema = z.infer<typeof schema>;

export type { SignUpFormSchema };
