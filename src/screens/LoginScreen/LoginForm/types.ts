import { loginSchema } from "src/constants";
import type * as z from "zod";

type LoginFormSchema = z.infer<typeof loginSchema>;

export type { LoginFormSchema };
