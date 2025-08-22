import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";

const ON_CHANGE_TEXT_ERROR_DELAY = 2000;

const useGetFormMethods = <T>(
  fields: DefaultValues<T>,
  schema: z.ZodTypeAny,
) => {
  const methods = useForm<T>({
    mode: "onChange",
    delayError: ON_CHANGE_TEXT_ERROR_DELAY, // delay errors for 2 seconds onChangeText
    resolver: zodResolver(schema),
    defaultValues: {
      ...fields,
    },
  });

  return methods;
};

export { useGetFormMethods };
