import type { schema } from './constants';
import type * as z from 'zod';

type SetPasswordFormSchema = z.infer<typeof schema>;

export type { SetPasswordFormSchema };
