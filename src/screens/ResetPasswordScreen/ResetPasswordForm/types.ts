import { resetPasswordSchema } from "@constants";
import type * as z from "zod";

type ResetPasswordFormSchema = z.infer<typeof resetPasswordSchema>;

export type { ResetPasswordFormSchema };
