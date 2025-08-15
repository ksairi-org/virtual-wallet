import * as z from "zod";

const baseSchema = {
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
};

const loginSchema = z.object({
  ...baseSchema,
});

const signUpSchema = z
  .object({
    ...baseSchema,
    firstName: z.string().min(5, "Enter a valid name"),
    lastName: z.string().min(6, "Enter a valid last name"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export { loginSchema, signUpSchema };
