import * as z from 'zod';

const schema = z.object({
  username: z.string().min(1, 'Please enter a valid username'),
  password: z
    .string()
    .min(8, 'Please enter a password with at least 8 characters'),
  hasAcceptedTerms: z.boolean().refine((val) => val === true),
});

export { schema };
