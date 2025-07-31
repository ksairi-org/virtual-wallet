import * as z from 'zod';

/*
 * This is an example of a more complicated validation schema
 * The `confirmPassword` field is dependent on the `password` field.
 */
const schema = z
  .object({
    username: z.string().min(1, 'Please enter a valid username'),
    password: z
      .string()
      .min(8, 'Please enter a password with at least 8 characters'),
    confirmPassword: z.string().min(8),
    hasAcceptedTerms: z.boolean().refine((val) => val === true),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Given that this is a React library, we don't want to use anything from `react-native`, i.e. Platform
const IS_WEB = typeof window !== 'undefined' && typeof document !== 'undefined';

export { schema, IS_WEB };
