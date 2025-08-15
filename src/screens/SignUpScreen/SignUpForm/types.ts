import { signUpSchema } from "src/constants";
import type * as z from "zod";

type SignUpFormSchema = z.infer<typeof signUpSchema>;

export type { SignUpFormSchema };
