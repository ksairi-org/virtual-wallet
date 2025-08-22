import { forgotPasswordSchema } from "@constants";
import type * as z from "zod";

type ForgotPasswordFormSchema = z.infer<typeof forgotPasswordSchema>;

export type { ForgotPasswordFormSchema };
